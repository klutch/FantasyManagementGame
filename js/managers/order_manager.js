var OrderManager = function()
{
  this.queuedOrders = [];
  this.lastTileGridI = -999999;
  this.lastTileGridJ = -999999;
  this.hasMouseChangedTiles = false;
  this.worldMap = screenManager.screens[ScreenType.WorldMap].worldMap;
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
  
  this.pathPreview.clearPath(order.path);
  delete this.queuedOrders[order.id];
};

OrderManager.prototype.startOrderSetup = function()
{
  this.settingUpOrder = true;
  screenManager.screens[ScreenType.Tooltip].enableTooltip("");
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
  screenManager.screens[ScreenType.Tooltip].disableTooltip();
};

OrderManager.prototype.processOrderMovement = function(order)
{
  var nextNode = order.path.next;
  var nextTile = worldManager.getTile(nextNode.i, nextNode.j);
  var lastNode = order.path.end;
  var group = adventurerManager.groups[order.groupId];
  var groupMovementAbility = adventurerManager.getGroupMovementAbility(order.groupId);
  var remainingMovement = groupMovementAbility - group.movementUsed;
  
  if (nextTile.movementCost <= remainingMovement)
  {
    adventurerManager.moveGroupToTile(group.id, nextTile.i, nextTile.j);
    this.pathPreview.clearPath(order.path);
    order.path = PathfinderHelper.findPath(nextTile.i, nextTile.j, lastNode.i, lastNode.j);
    this.pathPreview.drawPath(order.path);
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
      if (order.type == OrderType.Explore || order.type == OrderType.Raid)
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

OrderManager.prototype.createExploreOrder = function(groupId, tileI, tileJ, path)
{
  var order = new Order(
    this.getUnusedId(),
    OrderType.Explore,
    groupId,
    {
      tileI: tileI,
      tileJ: tileJ,
      path: path,
      isComplete: function()
      {
        var group = adventurerManager.groups[groupId];
        
        return group.tileI == tileI && group.tileJ == tileJ;
      },
      onComplete: function() { alert("Group at destination"); }
    });
  this.addOrder(order);
};

OrderManager.prototype.createRaidOrder = function(groupId, featureId, path)
{
  var order = new Order(
    this.getUnusedId(),
    OrderType.Raid,
    groupId,
    {
      featureId: featureId,
      path: path,
      isComplete: function()
      {
        var group = adventurerManager.groups[groupId];
        var feature = worldManager.world.features[featureId];
        
        return feature.containsTileI(group.tileI) && feature.containsTileJ(group.tileJ);
      },
      onComplete: function() { alert("Group at destination"); }
    });
  this.addOrder(order);
};

OrderManager.prototype.handleTravelOrderSetup = function()
{
  var raidContext = false;
  var exploreContext = false;
  var feature = null;
  var currentTile = null;
  var mouseI = this.worldMap.tileGridI;
  var mouseJ = this.worldMap.tileGridJ;
  var createOrder = inputManager.leftButton && !inputManager.leftButtonLastFrame && !inputManager.leftButtonHandled;
  
  // Determine tile context
  currentTile = worldManager.doesTileExist(mouseI, mouseJ) ? worldManager.getTile(mouseI, mouseJ) : null;
  if (currentTile == null || !currentTile.discovered)
  {
    this.tooltip.setText("Out of bounds");
  }
  else if (currentTile.featureId != null)
  {
    feature = worldManager.world.features[currentTile.featureId];
    
    if (feature.type == FeatureType.Dungeon)
    {
      raidContext = true;
      this.tooltip.setText("Raid dungeon");
    }
    else if (feature.type == FeatureType.Dwelling)
    {
      exploreContext = true;
      this.tooltip.setText("Visit dwelling");
    }
    else if (feature.type == FeatureType.Gathering)
    {
      exploreContext = true;
      this.tooltip.setText("Visit gathering");
    }
  }
  else
  {
    exploreContext = true;
    this.tooltip.setText("Explore area");
  }
  
  // Create order
  if (createOrder)
  {
    var startTile = adventurerManager.getGroupTile(adventurerManager.selectedGroupId);
    var path = PathfinderHelper.findPath(startTile.i, startTile.j, mouseI, mouseJ);
    
    if (path != null)
    {
      if (raidContext)
      {
        inputManager.leftButtonHandled = true;
        this.pathPreview.drawPath(path);
        this.createRaidOrder(adventurerManager.selectedGroupId, feature.id, path);
        this.endOrderSetup();
      }
      else if (exploreContext)
      {
        inputManager.leftButtonHandled = true;
        this.pathPreview.drawPath(path);
        this.createExploreOrder(adventurerManager.selectedGroupId, mouseI, mouseJ, path);
        this.endOrderSetup();
      }
    }
  }
};

OrderManager.prototype.update = function()
{
  this.hasMouseChangedTiles = this.worldMap.tileGridI != this.lastTileGridI || this.worldMap.tileGridJ != this.lastTileGridJ;

  // Handle order setup
  if (this.settingUpOrder)
  {
    // Check for escape
    if (inputManager.keysPressed[27] && !inputManager.keysPressedLastFrame[27])
    {
      inputManager.escapeHandled = true;
      this.endOrderSetup();
    }

    // Handle setup of all travel-type orders (explore, raid, fight)
    if (this.settingUpTravelOrder)
    {
      this.handleTravelOrderSetup();
    }

    // Cache mouse tile position
    this.lastTileGridI = this.worldMap.tileGridI;
    this.lastTileGridJ = this.worldMap.tileGridJ;
  }
};