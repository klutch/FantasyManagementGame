var OrderManager = function()
{
  this.groupOrders = {};
  this.lastTileGridI = -999999;
  this.lastTileGridJ = -999999;
  this.hasMouseChangedTiles = false;
  this.settingUpOrder = false;
  this.doneProcessingOrdersForTurn = true;
};

OrderManager.prototype.initialize = function()
{
  this.worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  this.worldMap = this.worldMapScreen.worldMap;
  this.tooltip = screenManager.screens[ScreenType.Tooltip].tooltip;
  this.pathPreview = this.worldMapScreen.pathPreview;
};

OrderManager.prototype.getUnusedId = function()
{
  var count = 0;
  
  while (true)
  {
    var matched = false;
    
    _.each(this.groupOrders, function(orders)
      {
        _.each(orders, function(order)
          {
            if (order.id == count)
            {
              matched = true;
              count++;
            }
          });
      });
    
    if (!matched)
    {
      return count;
    }
  }
};

OrderManager.prototype.getOrder = function(orderId)
{
  for (var groupId in this.groupOrders)
  {
    if (this.groupOrders.hasOwnProperty(groupId))
    {
      for (var i = 0; i < this.groupOrders[groupId].length; i++)
      {
        var order = this.groupOrders[groupId][i];
        
        if (order.id == orderId)
        {
          return order;
        }
      }
    }
  }
};

OrderManager.prototype.addOrder = function(order)
{
  if (this.groupOrders[order.groupId] == null)
  {
    this.groupOrders[order.groupId] = [];
  }
  this.groupOrders[order.groupId].push(order);
};

OrderManager.prototype.removeOrder = function(orderId)
{
  for (var groupId in this.groupOrders)
  {
    if (this.groupOrders.hasOwnProperty(groupId))
    {
      for (var i = 0; i < this.groupOrders[groupId].length; i++)
      {
        var order = this.groupOrders[groupId][i];
        
        if (order.id == orderId)
        {
          delete this.groupOrders[groupId][i];
        }
      }
      
      // Compact order array
      this.groupOrders[groupId] = _.compact(this.groupOrders[groupId]);
      
      // Remove empty arrays
      if (this.groupOrders[groupId].length == 0)
      {
        delete this.groupOrders[groupId];
      }
    }
  }
};

OrderManager.prototype.cancelOrder = function(orderId)
{
  var order = this.getOrder(orderId);
  
  this.removeOrder(orderId);
  this.pathPreview.clearPath(order.path.getHead());
}

OrderManager.prototype.startOrderSetup = function()
{
  this.settingUpOrder = true;
  document.body.style.cursor = "pointer";
  this.worldMapScreen.setTileSelectorColor(0xFFFF00);
};

OrderManager.prototype.endOrderSetup = function()
{
  this.lastTileGridI = -999999;
  this.lastTileGridJ = -999999;
  this.settingUpOrder = false;
  document.body.style.cursor = "auto";
  this.worldMapScreen.setTileSelectorColor(DEFAULT_TILE_SELECTOR_COLOR);
};

OrderManager.prototype.processOrderMovement = function(order)
{
  var nextNode = order.path.next;
  var doesTileExist = worldManager.doesTileExist(nextNode.i, nextNode.j);
  var nextTile = doesTileExist ? worldManager.getTile(nextNode.i, nextNode.j) : null;
  var group = groupManager.getGroup(order.groupId);
  var groupMovementAbility = groupManager.getGroupMovementAbility(order.groupId);
  var remainingMovement = groupMovementAbility - group.movementUsed;
  var recalculatePath = false;
  
  // Determine whether to move, or to perform discovery
  if (nextNode.unsure)
  {
    // Attempt discovery
    if (remainingMovement >= 20)
    {
      worldManager.discoverRadius(order.path.i, order.path.j, groupManager.getGroupDiscoveryRadius(order.groupId));
      group.movementUsed += 20;
      recalculatePath = true;
    }
    else
    {
      order.isDoneForThisTurn = true;
    }
  }
  else
  {
    // Attempt movement
    if (nextTile.movementCost <= remainingMovement)
    {
      groupManager.moveGroupToTile(group.id, nextTile.i, nextTile.j);
      group.movementUsed += nextTile.movementCost;
      order.path = nextNode;
    }
    else
    {
      order.isDoneForThisTurn = true;
    }
  }
  
  // Recalculate paths when hitting an unsure node
  if (recalculatePath)
  {
    var tailNode = order.path.getTail();
    var newPath = pathfinderManager.findPath(group.tileI, group.tileJ, tailNode.i, tailNode.j, order.pathfindingOptions);
    
    if (newPath != null)
    {
      // Cut the current path, and splice it together with the new one
      this.pathPreview.clearPath(order.path.getHead());
      order.path.cut();
      order.path.append(newPath.next);
      this.pathPreview.drawPath(order.path.getHead());
    }
    else
    {
      // Cancel order, because there is no path to the target
      this.cancelOrder(order.id);
      if (!this.doesGroupHaveOrders(group.id))
      {
        this.createReturnOrder(group.id, {isDoneForThisTurn: true});
      }
    }
  }
  
  // Check movement used
  if (group.movementUsed >= groupMovementAbility)
  {
    order.isDoneForThisTurn = true;
  }
};

OrderManager.prototype.processQueuedOrders = function()
{
  var completedOrders = [];
  
  this.doneProcessingOrdersForTurn = true;
  
  for (var groupId in this.groupOrders)
  {
    if (this.groupOrders.hasOwnProperty(groupId))
    {
      var currentOrder = this.groupOrders[groupId][0];
      
      // Do order work (and ensure this order hasn't been flagged as done for this turn already)
      if (!currentOrder.isDoneForThisTurn)
      {
        currentOrder.doWork();
      }
      
      // Check completion status
      if (currentOrder.isComplete())
      {
        this.removeOrder(currentOrder.id);
        currentOrder.onComplete();
      }
      else if (!currentOrder.isDoneForThisTurn)
      {
        this.doneProcessingOrdersForTurn = false;
      }
    }
  }
  
  // Check for end of turn
  if (this.doneProcessingOrdersForTurn && turnManager.state == TurnState.Processing)
  {
    turnManager.endProcessing();
    groupManager.resetGroupMovement();
    this.resetOrderProcessingStatus();
  }
};

OrderManager.prototype.resetOrderProcessingStatus = function()
{
  _.each(this.groupOrders, function(orders)
    {
      _.each(orders, function(order)
        {
          order.isDoneForThisTurn = false;
        });
    });
};

OrderManager.prototype.doesGroupHaveOrders = function(groupId)
{
  return this.groupOrders[groupId] != null;
};

OrderManager.prototype.getStartingPoint = function(groupId)
{
  if (this.groupOrders[groupId] != null)
  {
    var length = this.groupOrders[groupId].length;
    var tail = this.groupOrders[groupId][length - 1].path.getTail();
    
    return [tail.i, tail.j];
  }
  else
  {
    var group = groupManager.getGroup(groupId);
    
    if (group == undefined)
    {
      console.error("Group is undefined");
    }
    
    return [group.tileI, group.tileJ];
  }
};

OrderManager.prototype.createExploreOrder = function(groupId, tileI, tileJ)
{
  var root = this;
  var group = groupManager.getGroup(groupId);
  var startingPoint = this.getStartingPoint(groupId);
  var pathfindingOptions = {preferDiscoveredTerrain: false};
  var path = pathfinderManager.findPath(startingPoint[0], startingPoint[1], tileI, tileJ, pathfindingOptions);
  var order;
  
  if (path != null)
  {
    order = new Order(
      this.getUnusedId(),
      OrderType.Explore,
      groupId,
      {
        tileI: tileI,
        tileJ: tileJ,
        path: path,
        pathfindingOptions: pathfindingOptions,
        name: "Explore",
        doWork: function()
        {
          root.processOrderMovement(this);
        },
        isComplete: function()
        {
          return group.tileI == tileI && group.tileJ == tileJ;
        },
        onComplete: function() 
        {
          root.pathPreview.clearPath(this.path.getHead());
          worldManager.discoverRadius(tileI, tileJ, groupManager.getGroupDiscoveryRadius(groupId));
          
          if (!root.doesGroupHaveOrders(groupId))
          {
            root.createReturnOrder(groupId);
          }
        }
      });
    this.addOrder(order);
    this.pathPreview.drawPath(path);
    return true;
  }
  else
  {
    return false;
  }
};

OrderManager.prototype.createReturnOrder = function(groupId, options)
{
  var root = this;
  var group = groupManager.getGroup(groupId);
  var startingPoint = this.getStartingPoint(groupId);
  var pathfindingOptions = {preferDiscoveredTerrain: true};
  var path = pathfinderManager.findPath(startingPoint[0], startingPoint[1], worldManager.world.playerCastleI, worldManager.world.playerCastleJ, pathfindingOptions);
  var order;
  
  options = options || {};
  options.isDoneForThisTurn = options.isDoneForThisTurn == undefined ? false : options.isDoneForThisTurn;
  
  if (path != null)
  {
    order = new Order(
      this.getUnusedId(),
      OrderType.Return,
      groupId,
      {
        featureId: worldManager.world.playerCastleFeatureId,
        path: path,
        pathfindingOptions: pathfindingOptions,
        name: "Return to castle",
        doWork: function()
        {
          root.processOrderMovement(this);
        },
        isComplete: function()
        {
          var feature = worldManager.world.features[this.featureId];

          return feature.containsTile(group.tileI, group.tileJ);
        },
        onComplete: function()
        {
          root.pathPreview.clearPath(this.path.getHead());
          groupManager.moveGroupIntoFeature(groupId);
        },
        isDoneForThisTurn: options.isDoneForThisTurn
      });
    this.addOrder(order);
    this.pathPreview.drawPath(path);
    return true;
  }
  else
  {
    return false;
  }
};

OrderManager.prototype.createRaidOrder = function(groupId, featureId)
{
  var root = this;
  var group = groupManager.getGroup(groupId);
  var startingPoint = this.getStartingPoint(groupId);
  var feature = worldManager.world.features[featureId];
  var path = pathfinderManager.findPath(startingPoint[0], startingPoint[1], feature.tileI, feature.tileJ);
  var order;
  
  if (path != null)
  {
    order = new Order(
      this.getUnusedId(),
      OrderType.Raid,
      groupId,
      {
        featureId: featureId,
        path: path,
        name: "Raid",
        doWork: function()
        {
          root.processOrderMovement(this);
        },
        isComplete: function()
        {
          return feature.containsTile(group.tileI, group.tileJ);
        },
        onComplete: function() 
        {
          root.pathPreview.clearPath(this.path.getHead());
          groupManager.moveGroupIntoFeature(groupId);
          raidManager.createRaid(featureId, groupId);
        }
      });
    this.addOrder(order);
    this.pathPreview.drawPath(path);
    return true;
  }
  else
  {
    return false;
  }
};

OrderManager.prototype.createVisitDwellingOrder = function(groupId, featureId)
{
  var root = this;
  var group = groupManager.getGroup(groupId);
  var startingPoint = this.getStartingPoint(groupId);
  var feature = worldManager.world.features[featureId];
  var path = pathfinderManager.findPath(startingPoint[0], startingPoint[1], feature.tileI, feature.tileJ);
  var order;
  
  if (path != null)
  {
    order = new Order(
      this.getUnusedId(),
      OrderType.VisitDwelling,
      groupId,
      {
        featureId: featureId,
        path: path,
        name: "Visit dwelling",
        doWork: function()
        {
          root.processOrderMovement(this);
        },
        isComplete: function()
        {
          return feature.containsTile(group.tileI, group.tileJ);
        },
        onComplete: function()
        {
          root.pathPreview.clearPath(this.path.getHead());
          
          // Create notification and pause processing
          notificationManager.createDwellingVisitNotification(featureId);
          turnManager.pauseProcessing();
          
          // Make dwelling loyal if it is offered freely
          if (feature.isLoyaltyFree)
          {
            dwellingManager.makeLoyal(featureId);
          }
          
          // Create return order if there are no other orders left
          if (!root.doesGroupHaveOrders(groupId))
          {
            root.createReturnOrder(groupId, {isDoneForThisTurn: true});
          }
        }
      });
    this.addOrder(order);
    this.pathPreview.drawPath(path);
    return true;
  }
  else
  {
    return false;
  }
};

OrderManager.prototype.createVisitGatheringOrder = function(groupId, featureId)
{
  var root = this;
  var group = groupManager.getGroup(groupId);
  var startingPoint = this.getStartingPoint(groupId);
  var feature = worldManager.world.features[featureId];
  var path = pathfinderManager.findPath(startingPoint[0], startingPoint[1], feature.tileI, feature.tileJ);
  var order;
  
  if (path != null)
  {
    order = new Order(
      this.getUnusedId(),
      OrderType.VisitGathering,
      groupId,
      {
        featureId: featureId,
        path: path,
        name: "Visit gathering",
        doWork: function()
        {
          root.processOrderMovement(this);
        },
        isComplete: function()
        {
          return feature.containsTile(group.tileI, group.tileJ);
        },
        onComplete: function()
        {
          root.pathPreview.clearPath(this.path.getHead());
          
          if (!root.doesGroupHaveOrders(groupId))
          {
            root.createReturnOrder(groupId);
          }
        }
      });
    this.addOrder(order);
    this.pathPreview.drawPath(path);
    return true;
  }
  else
  {
    return false;
  }
};

OrderManager.prototype.getOrderContexts = function(groupId, i, j)
{
  var contexts = {};
  var exploreContext = false;
  var visitDwellingContext = false;
  var visitGatheringContext = false;
  var cutLogsContext = false;
  var mineContext = false;
  var raidContext = false;
  var fightContext = false;
  var returnContext = false;
  var tile;
  var canExplore = groupManager.canGroupExplore(groupId);
  var canMine = groupManager.canGroupMine(groupId);
  var canLog = groupManager.canGroupLog(groupId);
  var canVisitDwelling = groupManager.canGroupVisitDwelling(groupId);
  var canVisitGathering = groupManager.canGroupVisitGathering(groupId);
  var canRaid = groupManager.canGroupRaid(groupId);
  
  // Check for undiscovered/non-existant tile
  if (!worldManager.doesTileExist(i, j) || !(tile = worldManager.getTile(i, j)).discovered)
  {
    if (canExplore)
    {
      contexts[OrderType.Explore] = true;
      return contexts;
    }
  }
  
  // Check for mining context
  if (tile.type == TileType.Mountain)
  {
    if (canMine)
    {
      contexts[OrderType.Mine] = true;
      return contexts;
    }
  }
  
  // Check for cut-logs context
  if (tile.type == TileType.Forest)
  {
    if (canLog)
    {
      contexts[OrderType.CutLogs] = true;
    }
  }
  
  if (tile.featureId != undefined)
  {
    var feature = worldManager.world.features[tile.featureId];
    
    // Check for castle
    if (feature.type == FeatureType.Castle)
    {
      var obj = {};
      
      obj[OrderType.Return] = true;
      return obj;
    }
    
    // Check for dwelling context
    if (feature.type == FeatureType.Dwelling && canVisitDwelling)
    {
      contexts[OrderType.VisitDwelling] = true;
    }
    
    // Check for gathering context
    if (feature.type == FeatureType.Gathering && canVisitGathering)
    {
      contexts[OrderType.VisitGathering] = true;
    }
    
    // Check for raid context
    if (feature.type == FeatureType.Dungeon && canRaid)
    {
      contexts[OrderType.Raid] = true;
    }
    
    // TODO: Check for fight context
  }
  
  // Check for explorable tiles
  if (tile.type != TileType.Water && tile.type != TileType.Mountain)
  {
    if (canExplore)
    {
      contexts[OrderType.Explore] = true;
    }
  }
  
  return contexts;
};

OrderManager.prototype.rebuildPaths = function(groupId)
{
  var orders = this.groupOrders[groupId];
  var startingI;
  var startingJ;
  
  // Early exit
  if (orders == null || orders.length == 0)
  {
    return;
  }
  
  // Clear all paths
  for (var i = 0; i < orders.length; i++)
  {
    this.pathPreview.clearPath(orders[i].path.getHead());
  }
  
  // Rebuild paths
  startingI = orders[0].path.getTail().i;
  startingJ = orders[0].path.getTail().j;
  for (var i = 1; i < orders.length; i++)
  {
    var order = orders[i];
    var tail = order.path.getTail();
    var newPath = pathfinderManager.findPath(startingI, startingJ, tail.i, tail.j, order.pathfindingOptions);
    
    if (newPath != null)
    {
      order.path = newPath;
      startingI = order.path.getTail().i;
      startingJ = order.path.getTail().j;
    }
    else
    {
      console.error("Couldn't find new path when rebuilding them.");
    }
  }
  
  // Redraw all paths
  for (var i = 0; i < orders.length; i++)
  {
    this.pathPreview.drawPath(orders[i].path.getHead());
  }
}

OrderManager.prototype.update = function()
{
  var mouseI = this.worldMap.tileGridI;
  var mouseJ = this.worldMap.tileGridJ;
  
  this.hasMouseChangedTiles = mouseI != this.lastTileGridI || mouseJ != this.lastTileGridJ;
  
  // Pathfinding debug
  if (DEBUG_PATHFINDER)
  {
    if (inputManager.simpleKey(KeyCode.Enter))
    {
      var startingGroup = groupManager.groups[0];

      pathfinderManager.findPath(startingGroup.tileI, startingGroup.tileJ, mouseI, mouseJ);
    }
    return;
  }

  // Handle order setup
  if (this.settingUpOrder)
  {
    // Escape key -- cancel order setup
    if (inputManager.simpleKey(KeyCode.Escape))
    {
      this.endOrderSetup();
    }
    
    // Check for mouse
    if (inputManager.leftButton && !inputManager.leftButtonLastFrame && !inputManager.leftButtonHandled)
    {
      var contexts = this.getOrderContexts(groupManager.selectedGroupId, mouseI, mouseJ);
      var numContexts = _.size(contexts);
      
      inputManager.leftButtonHandled = true;
      
      if (numContexts > 1)
      {
        // Show sub menu
        if (this.worldMapScreen.orderSubmenu == null)
        {
          this.worldMapScreen.openOrderSubmenu(contexts, groupManager.selectedGroupId, mouseI, mouseJ);
        }
      }
      else if (numContexts == 1)
      {
        var contextKey;
        
        for (var key in contexts)
        {
          if (contexts.hasOwnProperty(key))
          {
            contextKey = key;
          }
        }
        
        // Create order
        if (contextKey == OrderType.Explore)
        {
          this.createExploreOrder(groupManager.selectedGroupId, mouseI, mouseJ);
        }
        else if (contextKey == OrderType.Mine)
        {
          this.createMineOrder(groupManager.selectedGroupId, mouseI, mouseJ);
        }
        if (!inputManager.keysPressed[KeyCode.Shift])
        {
          this.endOrderSetup();
        }
      }
      else
      {
        console.log("no contexts");
      }
    }

    // Cache mouse tile position
    this.lastTileGridI = mouseI;
    this.lastTileGridJ = mouseJ;
  }
};