var OrderManager = function()
{
  this.groupOrders = {};
  this.lastTileGridI = -999999;
  this.lastTileGridJ = -999999;
  this.hasMouseChangedTiles = false;
  this.worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  this.worldMap = this.worldMapScreen.worldMap;
  this.tooltip = screenManager.screens[ScreenType.Tooltip].tooltip;
  this.pathPreview = screenManager.screens[ScreenType.WorldMap].pathPreview;
  this.settingUpOrder = false;
  this.doneProcessingOrdersForTurn = true;
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
        
        if (order != null && order.id == orderId)
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

OrderManager.prototype.startOrderSetup = function()
{
  this.settingUpOrder = true;
};

OrderManager.prototype.endOrderSetup = function()
{
  this.lastTileGridI = -999999;
  this.lastTileGridJ = -999999;
  this.settingUpOrder = false;
};

OrderManager.prototype.processOrderMovement = function(order)
{
  var nextNode = order.path.next;
  var doesTileExist = worldManager.doesTileExist(nextNode.i, nextNode.j);
  var nextTile = doesTileExist ? worldManager.getTile(nextNode.i, nextNode.j) : null;
  var group = adventurerManager.groups[order.groupId];
  var groupMovementAbility = adventurerManager.getGroupMovementAbility(order.groupId);
  var remainingMovement = groupMovementAbility - group.movementUsed;
  
  if (doesTileExist && nextTile.discovered)
  {
    // Movement
    if (nextTile.movementCost <= remainingMovement)
    {
      adventurerManager.moveGroupToTile(group.id, nextTile.i, nextTile.j);
      group.movementUsed += nextTile.movementCost;
      order.path = nextNode;
    }
    else
    {
      order.isDoneForThisTurn = true;
    }
  }
  else
  {
    // Discover area
    if (remainingMovement >= 20)
    {
      worldManager.discoverRadius(group.tileI, group.tileJ, 8);
      group.movementUsed += 20;   // TODO: Come up with a discovery cost
    }
    else
    {
      order.isDoneForThisTurn = true;
    }
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
      
      currentOrder.doWork();
      
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
  if (this.doneProcessingOrdersForTurn)
  {
    turnManager.endProcessing();
    adventurerManager.resetGroupMovement();
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
    var group = adventurerManager.groups[groupId];
    
    return [group.tileI, group.tileJ];
  }
};

OrderManager.prototype.createExploreOrder = function(groupId, tileI, tileJ)
{
  var root = this;
  var group = adventurerManager.groups[groupId];
  var startingPoint = this.getStartingPoint(groupId);
  var path = pathfinderManager.findPath(startingPoint[0], startingPoint[1], tileI, tileJ, {preferDiscoveredTerrain: false});
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
          worldManager.discoverRadius(tileI, tileJ, adventurerManager.getGroupDiscoveryRadius(groupId));
          
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

OrderManager.prototype.createReturnOrder = function(groupId)
{
  var root = this;
  var group = adventurerManager.groups[groupId];
  var startingPoint = this.getStartingPoint(groupId);
  var path = pathfinderManager.findPath(startingPoint[0], startingPoint[1], worldManager.world.playerCastleI, worldManager.world.playerCastleJ, {preferDiscoveredTerrain: true});
  var order;
  
  if (path != null)
  {
    order = new Order(
      this.getUnusedId(),
      OrderType.Return,
      groupId,
      {
        featureId: worldManager.world.playerCastleFeatureId,
        path: path,
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
          adventurerManager.moveGroupIntoFeature(groupId);
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

OrderManager.prototype.createRaidOrder = function(groupId, featureId)
{
  var root = this;
  var group = adventurerManager.groups[groupId];
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
          adventurerManager.moveGroupIntoFeature(groupId);
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
  var group = adventurerManager.groups[groupId];
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

OrderManager.prototype.createVisitGatheringOrder = function(groupId, featureId)
{
  var root = this;
  var group = adventurerManager.groups[groupId];
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

OrderManager.prototype.getOrderContexts = function(i, j)
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
  
  // Check for undiscovered/non-existant tile
  if (!worldManager.doesTileExist(i, j) || !(tile = worldManager.getTile(i, j)).discovered)
  {
    contexts[OrderType.Explore] = true;
    return contexts;
  }
  
  // Check for mining context
  if (tile.type == TileType.Mountain)
  {
    contexts[OrderType.Mine] = true;
    return contexts;
  }
  
  // Check for cut-logs context
  if (tile.type == TileType.Forest)
  {
    contexts[OrderType.CutLogs] = true;
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
    if (feature.type == FeatureType.Dwelling)
    {
      contexts[OrderType.VisitDwelling] = true;
    }
    
    // Check for gathering context
    if (feature.type == FeatureType.Gathering)
    {
      contexts[OrderType.VisitGathering] = true;
    }
    
    // Check for raid context
    if (feature.type == FeatureType.Dungeon)
    {
      contexts[OrderType.Raid] = true;
    }
    
    // TODO: Check for fight context
  }
  
  // Check for explorable tiles
  if (tile.type != TileType.Water && tile.type != TileType.Mountain)
  {
    contexts[OrderType.Explore] = true;
  }
  
  return contexts;
};

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
      var startingGroup = adventurerManager.groups[0];

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
      var contexts = this.getOrderContexts(mouseI, mouseJ);
      var numContexts = _.size(contexts);
      
      inputManager.leftButtonHandled = true;
      
      if (numContexts > 1)
      {
        // Show sub menu
        if (this.worldMapScreen.orderSubmenu == null)
        {
          this.worldMapScreen.openOrderSubmenu(contexts, adventurerManager.selectedGroupId, mouseI, mouseJ);
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
          this.createExploreOrder(adventurerManager.selectedGroupId, mouseI, mouseJ);
        }
        else if (contextKey == OrderType.Mine)
        {
          this.createMineOrder(adventurerManager.selectedGroupId, mouseI, mouseJ);
        }
        //this.endOrderSetup();
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