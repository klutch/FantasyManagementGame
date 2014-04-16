var OrderSystem = function()
{
  this.type = SystemType.Order;
  this.groupOrders = {};
  this.lastTileGridI = -999999;
  this.lastTileGridJ = -999999;
  this.hasMouseChangedTiles = false;
  this.settingUpOrder = false;
};

OrderSystem.prototype.initialize = function()
{
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.worldSystem = game.systemManager.getSystem(SystemType.World);
  this.gameEventSystem = game.systemManager.getSystem(SystemType.GameEvent);
  this.loyaltySystem = game.systemManager.getSystem(SystemType.Loyalty);
  this.worldMapScreen = game.screenManager.screens[ScreenType.WorldMap];
  this.worldMap = this.worldMapScreen.worldMap;
  this.tooltip = game.screenManager.screens[ScreenType.Tooltip].tooltip;
  this.pathPreview = this.worldMapScreen.pathPreview;
};

OrderSystem.prototype.getUnusedId = function()
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

OrderSystem.prototype.getOrder = function(orderId)
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

OrderSystem.prototype.addOrder = function(order)
{
  if (this.groupOrders[order.groupId] == null)
  {
    this.groupOrders[order.groupId] = [];
  }
  this.groupOrders[order.groupId].push(order);
};

OrderSystem.prototype.removeOrder = function(orderId)
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

OrderSystem.prototype.cancelOrder = function(orderId)
{
  var order = this.getOrder(orderId);
  
  this.removeOrder(orderId);
  this.pathPreview.clearPath(order.path.getHead());
}

OrderSystem.prototype.cancelAllOrders = function(groupId)
{
  delete this.groupOrders[groupId];
};

OrderSystem.prototype.startOrderSetup = function()
{
  this.settingUpOrder = true;
  document.body.style.cursor = "pointer";
  this.worldMapScreen.setTileSelectorColor(0xFFFF00);
};

OrderSystem.prototype.endOrderSetup = function()
{
  this.lastTileGridI = -999999;
  this.lastTileGridJ = -999999;
  this.settingUpOrder = false;
  document.body.style.cursor = "auto";
  this.worldMapScreen.setTileSelectorColor(DEFAULT_TILE_SELECTOR_COLOR);
};

OrderSystem.prototype.processOrderMovement = function(order)
{
  var isDone = false;
  
  while(!isDone)
  {
    var nextNode = order.path.next;
    var doesTileExist = this.worldSystem.doesTileExist(nextNode.i, nextNode.j);
    var nextTile = doesTileExist ? this.worldSystem.getTile(nextNode.i, nextNode.j) : null;
    var group = this.groupSystem.getGroup(order.groupId);
    var groupMovementAbility = this.groupSystem.getGroupMovementAbility(order.groupId);
    var remainingMovement = groupMovementAbility - group.movementUsed;
    var recalculatePath = false;

    // Determine whether to move, or to perform discovery
    if (nextNode.unsure)
    {
      // Attempt discovery
      if (remainingMovement >= 20)
      {
        this.worldSystem.discoverRadius(order.path.i, order.path.j, this.groupSystem.getGroupDiscoveryRadius(order.groupId));
        group.movementUsed += 20;
        recalculatePath = true;
      }
      else
      {
        isDone = true;
      }
    }
    else
    {
      // Attempt movement
      if (nextTile.movementCost <= remainingMovement)
      {
        this.groupSystem.moveGroupToTile(group.id, nextTile.i, nextTile.j);
        group.movementUsed += nextTile.movementCost;
        order.path = nextNode;
      }
      else
      {
        isDone = true;
      }
    }

    // Recalculate paths when hitting an unsure node
    if (recalculatePath)
    {
      var tailNode = order.path.getTail();
      var newPath = game.pathfinderManager.findPath(group.tileI, group.tileJ, tailNode.i, tailNode.j, order.pathfindingOptions);

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
          this.createReturnOrder(group.id);
        }
      }
    }

    // Stop if all movement used
    if (group.movementUsed >= groupMovementAbility)
    {
      isDone = true;
    }
    
    // Stop if order is complete
    if (order.isComplete())
    {
      isDone = true;
    }
  }
};

OrderSystem.prototype.doesGroupHaveOrders = function(groupId)
{
  return this.groupOrders[groupId] != null;
};

OrderSystem.prototype.getStartingPoint = function(groupId)
{
  if (this.groupOrders[groupId] != null)
  {
    var length = this.groupOrders[groupId].length;
    var tail = this.groupOrders[groupId][length - 1].path.getTail();
    
    return [tail.i, tail.j];
  }
  else
  {
    var group = this.groupSystem.getGroup(groupId);
    
    if (group == undefined)
    {
      console.error("Group is undefined");
    }
    
    return [group.tileI, group.tileJ];
  }
};

OrderSystem.prototype.createExploreOrder = function(groupId, tileI, tileJ)
{
  var root = this;
  var group = this.groupSystem.getGroup(groupId);
  var startingPoint = this.getStartingPoint(groupId);
  var pathfindingOptions = {preferDiscoveredTerrain: false};
  var path = game.pathfinderManager.findPath(startingPoint[0], startingPoint[1], tileI, tileJ, pathfindingOptions);
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
          var walkStart = this.path;
          
          root.processOrderMovement(this);
          root.gameEventSystem.appendGameEvent(GameEventFactory.createWalkEvent(groupId, walkStart, order.path));
        },
        isComplete: function()
        {
          return group.tileI == tileI && group.tileJ == tileJ;
        },
        onComplete: function() 
        {
          root.pathPreview.clearPath(this.path.getHead());
          root.worldSystem.discoverRadius(tileI, tileJ, root.groupSystem.getGroupDiscoveryRadius(groupId));
          
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

OrderSystem.prototype.createReturnOrder = function(groupId, options)
{
  var root = this;
  var group = this.groupSystem.getGroup(groupId);
  var startingPoint = this.getStartingPoint(groupId);
  var pathfindingOptions = {preferDiscoveredTerrain: true};
  var path = game.pathfinderManager.findPath(startingPoint[0], startingPoint[1], this.worldSystem.world.playerCastleI, this.worldSystem.world.playerCastleJ, pathfindingOptions);
  var order;
  
  options = options || {};
  
  if (path != null)
  {
    order = new Order(
      this.getUnusedId(),
      OrderType.Return,
      groupId,
      {
        featureId: this.worldSystem.world.playerCastleFeatureId,
        path: path,
        pathfindingOptions: pathfindingOptions,
        name: "Return to castle",
        doWork: function()
        {
          var walkStart = this.path;
          
          root.processOrderMovement(this);
          root.gameEventSystem.appendGameEvent(GameEventFactory.createWalkEvent(groupId, walkStart, order.path));
        },
        isComplete: function()
        {
          var feature = root.worldSystem.getFeature(this.featureId);
          var result = feature.containsTile(group.tileI, group.tileJ);
          
          return result;
        },
        onComplete: function()
        {
          root.pathPreview.clearPath(this.path.getHead());
          root.gameEventSystem.appendGameEvent(GameEventFactory.createEnterFeatureEvent(groupId, this.featureId));
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

OrderSystem.prototype.createRaidOrder = function(groupId, featureId)
{
  var root = this;
  var group = this.groupSystem.getGroup(groupId);
  var startingPoint = this.getStartingPoint(groupId);
  var feature = this.worldSystem.world.features[featureId];
  var path = game.pathfinderManager.findPath(startingPoint[0], startingPoint[1], feature.tileI, feature.tileJ);
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
          var walkStart = this.path;
          
          root.processOrderMovement(this);
          root.gameEventSystem.appendGameEvent(GameEventFactory.createWalkEvent(groupId, walkStart, order.path));
        },
        isComplete: function()
        {
          return feature.containsTile(group.tileI, group.tileJ);
        },
        onComplete: function() 
        {
          root.pathPreview.clearPath(this.path.getHead());
          root.gameEventSystem.appendGameEvent(GameEventFactory.createEnterFeatureEvent(groupId, this.featureId));
          root.gameEventSystem.appendGameEvent(GameEventFactory.createRaidEvent(groupId, this.featureId));
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

OrderSystem.prototype.createVisitDwellingOrder = function(groupId, featureId)
{
  var root = this;
  var group = this.groupSystem.getGroup(groupId);
  var startingPoint = this.getStartingPoint(groupId);
  var feature = this.worldSystem.world.features[featureId];
  var path = game.pathfinderManager.findPath(startingPoint[0], startingPoint[1], feature.tileI, feature.tileJ);
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
          var walkStart = this.path;
          
          root.processOrderMovement(this);
          root.gameEventSystem.appendGameEvent(GameEventFactory.createWalkEvent(groupId, walkStart, order.path));
        },
        isComplete: function()
        {
          return feature.containsTile(group.tileI, group.tileJ);
        },
        onComplete: function()
        {
          root.pathPreview.clearPath(this.path.getHead());
          root.gameEventSystem.appendGameEvent(GameEventFactory.createDwellingVisitEvent(groupId, featureId));
          
          if (feature.isLoyaltyFree)
          {
            root.loyaltySystem.makeLoyal(featureId);
          }
          
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

OrderSystem.prototype.createVisitGatheringOrder = function(groupId, featureId)
{
  var root = this;
  var group = this.groupSystem.getGroup(groupId);
  var startingPoint = this.getStartingPoint(groupId);
  var feature = this.worldSystem.world.features[featureId];
  var path = game.pathfinderManager.findPath(startingPoint[0], startingPoint[1], feature.tileI, feature.tileJ);
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
          var walkStart = this.path;
          
          root.processOrderMovement(this);
          root.gameEventSystem.appendGameEvent(GameEventFactory.createWalkEvent(groupId, walkStart, order.path));
        },
        isComplete: function()
        {
          return feature.containsTile(group.tileI, group.tileJ);
        },
        onComplete: function()
        {
          root.pathPreview.clearPath(this.path.getHead());
          root.gameEventSystem.appendGameEvent(GameEventFactory.createGatheringVisitEvent(groupId, featureId));
          
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

OrderSystem.prototype.getOrderContexts = function(groupId, i, j)
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
  var canExplore = this.groupSystem.canGroupExplore(groupId);
  var canMine = this.groupSystem.canGroupMine(groupId);
  var canLog = this.groupSystem.canGroupLog(groupId);
  var canVisitDwelling = this.groupSystem.canGroupVisitDwelling(groupId);
  var canVisitGathering = this.groupSystem.canGroupVisitGathering(groupId);
  var canRaid = this.groupSystem.canGroupRaid(groupId);
  
  // Check for undiscovered/non-existant tile
  if (!this.worldSystem.doesTileExist(i, j) || !(tile = this.worldSystem.getTile(i, j)).discovered)
  {
    if (canExplore)
    {
      contexts[OrderType.Explore] = true;
    }
    return contexts;
  }
  
  // Check for mining context
  if (tile.type == TileType.Mountain)
  {
    if (canMine)
    {
      contexts[OrderType.Mine] = true;
    }
    return contexts;
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
    var feature = this.worldSystem.world.features[tile.featureId];
    
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

OrderSystem.prototype.rebuildPaths = function(groupId)
{
  var orders = this.groupOrders[groupId];
  var group = this.groupSystem.getGroup(groupId);
  
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
  if (orders.length == 1)
  {
    var startingI = group.tileI;
    var startingJ = group.tileJ;
    var order = orders[0];
    var tail = order.path.getTail();
    var newPath = game.pathfinderManager.findPath(startingI, startingJ, tail.i, tail.j, order.pathfindingOptions);
    
    if (newPath != null)
    {
      order.path = newPath;
    }
    else
    {
      console.error("Couldn't find new path when rebuilding them.");
    }
  }
  else
  {
    var startingI = orders[0].path.getTail().i;
    var startingJ = orders[0].path.getTail().j;
    
    for (var i = 1; i < orders.length; i++)
    {
      var order = orders[i];
      var tail = order.path.getTail();
      var newPath = game.pathfinderManager.findPath(startingI, startingJ, tail.i, tail.j, order.pathfindingOptions);

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
  }
  
  // Redraw all paths
  for (var i = 0; i < orders.length; i++)
  {
    this.pathPreview.drawPath(orders[i].path.getHead());
  }
}

OrderSystem.prototype.updateWaitingOnPlayerState = function()
{
  var mouseI = this.worldMap.tileGridI;
  var mouseJ = this.worldMap.tileGridJ;
  
  this.hasMouseChangedTiles = mouseI != this.lastTileGridI || mouseJ != this.lastTileGridJ;
  
  // Pathfinding debug
  if (DEBUG_PATHFINDER)
  {
    if (game.inputManager.simpleKey(KeyCode.Enter))
    {
      var startingGroup = this.groupSystem.groups[0];

      game.pathfinderManager.findPath(startingGroup.tileI, startingGroup.tileJ, mouseI, mouseJ);
    }
    return;
  }

  // Handle order setup
  if (this.settingUpOrder)
  {
    // Escape key -- cancel order setup
    if (game.inputManager.simpleKey(KeyCode.Escape))
    {
      this.endOrderSetup();
    }
    
    // Check for mouse
    if (game.inputManager.leftButton && !game.inputManager.leftButtonLastFrame && !game.inputManager.leftButtonHandled)
    {
      var contexts = this.getOrderContexts(this.groupSystem.selectedGroupId, mouseI, mouseJ);
      var numContexts = _.size(contexts);
      
      game.inputManager.leftButtonHandled = true;
      
      if (numContexts > 1)
      {
        // Show sub menu
        if (this.worldMapScreen.orderSubmenu == null)
        {
          this.worldMapScreen.openOrderSubmenu(contexts, this.groupSystem.selectedGroupId, mouseI, mouseJ);
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
          this.createExploreOrder(this.groupSystem.selectedGroupId, mouseI, mouseJ);
        }
        else if (contextKey == OrderType.Mine)
        {
          this.createMineOrder(this.groupSystem.selectedGroupId, mouseI, mouseJ);
        }
        if (!game.inputManager.keysPressed[KeyCode.Shift])
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

OrderSystem.prototype.updateOrderProcessingState = function()
{
  var completedOrders = [];
  
  for (var groupId in this.groupOrders)
  {
    if (this.groupOrders.hasOwnProperty(groupId))
    {
      var currentOrder = this.groupOrders[groupId][0];
      
      currentOrder.doWork();
      
      if (currentOrder.isComplete())
      {
        this.removeOrder(currentOrder.id);
        currentOrder.onComplete();
      }
    }
  }
  
  this.groupSystem.resetGroupMovement();
  game.switchToNextState();
};

OrderSystem.prototype.update = function()
{
  if (game.state == GameState.WaitingOnPlayer)
  {
    this.updateWaitingOnPlayerState();
  }
  else if (game.state == GameState.OrderProcessing)
  {
    this.updateOrderProcessingState();
  }
};