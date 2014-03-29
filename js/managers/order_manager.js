var OrderManager = function()
{
  this.queuedOrders = [];
  this.lastTileGridI = -999999;
  this.lastTileGridJ = -999999;
  this.hasMouseChangedTiles = false;
  this.worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  this.worldMap = this.worldMapScreen.worldMap;
  this.tooltip = screenManager.screens[ScreenType.Tooltip].tooltip;
  this.pathPreview = screenManager.screens[ScreenType.WorldMap].pathPreview;
  this.settingUpOrder = false;
  this.settingUpTravelOrder = false;
  this.settingUpBuildRoadOrder = false;
  this.settingUpMineOrder = false;
  this.settingUpLogOrder = false;
  this.doneProcessingOrdersForTurn = true;
};

OrderManager.prototype.getUnusedId = function()
{
  var count = 0;
  
  while (this.queuedOrders[count] != null) { count++; }
  
  return count;
};

OrderManager.prototype.addOrder = function(order)
{
  this.queuedOrders[order.id] = order;
};

OrderManager.prototype.getGroupOrder = function(groupId)
{
  for (var key in this.queuedOrders)
  {
    if (this.queuedOrders.hasOwnProperty(key))
    {
      var order = this.queuedOrders[key];
      
      if (order.groupId == groupId)
      {
        return order;
      }
    }
  }
  return null;
}

OrderManager.prototype.doesGroupHaveOrders = function(groupId)
{
  return this.getGroupOrder(groupId) != null;
};

OrderManager.prototype.cancelGroupOrder = function(groupId)
{
  var order = this.getGroupOrder(groupId);
  
  this.pathPreview.clearPath(order.path.getHead());
  delete this.queuedOrders[order.id];
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
  this.settingUpTravelOrder = false;
  this.settingUpBuildRoadOrder = false;
  this.settingUpMineOrder = false;
  this.settingUpLogOrder = false;
};

OrderManager.prototype.processOrderMovement = function(order)
{
  var nextNode = order.path.next;
  var nextTile = worldManager.getTile(nextNode.i, nextNode.j);
  var group = adventurerManager.groups[order.groupId];
  var groupMovementAbility = adventurerManager.getGroupMovementAbility(order.groupId);
  var remainingMovement = groupMovementAbility - group.movementUsed;
  
  if (nextTile.movementCost <= remainingMovement)
  {
    adventurerManager.moveGroupToTile(group.id, nextTile.i, nextTile.j);
    order.path = nextNode;
  }
  else
  {
    order.isDoneForThisTurn = true;
  }
};

OrderManager.prototype.processQueuedOrders = function()
{
  var completedOrders = [];
  
  this.doneProcessingOrdersForTurn = true;
  
  _.each(this.queuedOrders, function(order)
    {
      // Process movement aspects of orders
      if (order.type == OrderType.Return || 
          order.type == OrderType.Explore || 
          order.type == OrderType.Raid || 
          order.type == OrderType.VisitDwelling ||
          order.type == OrderType.VisitGathering)
      {
        this.processOrderMovement(order);
      }
      
      if (order.isComplete())
      {
        completedOrders.push(order);
      }
      else if (!order.isDoneForThisTurn)
      {
        this.doneProcessingOrdersForTurn = false;
      }
    },
    this);
  
  // Handle completed orders
  for (var i = 0; i < completedOrders.length; i++)
  {
    var order = completedOrders[i];
    
    if (order.onComplete != null)
    {
      order.onComplete();
    }
    delete this.queuedOrders[order.id];
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
  _.each(this.queuedOrders, function(order)
    {
      order.isDoneForThisTurn = false;
    });
};

OrderManager.prototype.createExploreOrder = function(groupId, tileI, tileJ)
{
  var root = this;
  var group = adventurerManager.groups[groupId];
  var path = PathfinderHelper.findPath(group.tileI, group.tileJ, tileI, tileJ);
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
        isComplete: function()
        {
          return group.tileI == tileI && group.tileJ == tileJ;
        },
        onComplete: function() 
        {
          root.pathPreview.clearPath(this.path.getHead());
          worldManager.discoverRadius(tileI, tileJ, adventurerManager.getGroupDiscoveryRadius(groupId));
          root.createReturnOrder(groupId);
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
  var path = PathfinderHelper.findPath(group.tileI, group.tileJ, worldManager.world.playerCastleI, worldManager.world.playerCastleJ);
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
  var feature = worldManager.world.features[featureId];
  var path = PathfinderHelper.findPath(group.tileI, group.tileJ, feature.tileI, feature.tileJ);
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
  var feature = worldManager.world.features[featureId];
  var path = PathfinderHelper.findPath(group.tileI, group.tileJ, feature.tileI, feature.tileJ);
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
        isComplete: function()
        {
          return feature.containsTile(group.tileI, group.tileJ);
        },
        onComplete: function()
        {
          root.pathPreview.clearPath(this.path.getHead());
          root.createReturnOrder(groupId);
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
  var feature = worldManager.world.features[featureId];
  var path = PathfinderHelper.findPath(group.tileI, group.tileJ, feature.tileI, feature.tileJ);
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
        isComplete: function()
        {
          return feature.containsTile(group.tileI, group.tileJ);
        },
        onComplete: function()
        {
          root.pathPreview.clearPath(this.path.getHead());
          root.createReturnOrder(groupId);
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
        this.endOrderSetup();
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