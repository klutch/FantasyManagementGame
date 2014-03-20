var OrderManager = function()
{
  this.queuedOrders = [];
  this.settingUpOrderType = null;
  this.lastMouseGridI = -999999;
  this.lastMouseGridJ = -999999;
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

OrderManager.prototype.cancelOrder = function(orderId)
{
  delete this.queuedOrders[order.id];
};

OrderManager.prototype.startOrderSetup = function(orderType)
{
  this.settingUpOrderType = orderType;
  screenManager.screens[ScreenType.Tooltip].enableTooltip("Travel");
};

OrderManager.prototype.cancelOrderSetup = function()
{
  // TODO: handle clean-up here
  this.lastMouseGridI = -999999;
  this.lastMouseGridJ = -999999;
  screenManager.screens[ScreenType.Tooltip].disableTooltip();
  this.settingUpOrderType = null;
};

OrderManager.prototype.processOrder = function(order)
{
};

OrderManager.onTurnEnd = function()
{
  var completedOrders = [];
  
  // Process orders
  _.each(this.queuedOrders, function(order)
    {
      this.processOrder(order);
      if (order.isComplete())
      {
        completedOrders.push(order);
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
};

OrderManager.prototype.updateTooltip = function()
{
  var worldMap = screenManager.screens[ScreenType.WorldMap].worldMap;
  var tooltip = screenManager.screens[ScreenType.Tooltip].tooltip;
  
  if (worldMap.tileGridI == this.lastMouseGridI && worldMap.tileGridJ == this.lastMouseGridJ)
  {
    return;
  }
  
  if (worldManager.doesTileExist(worldMap.tileGridI, worldMap.tileGridJ))
  {
    var tile = worldManager.getTile(worldMap.tileGridI, worldMap.tileGridJ);

    if (tile.featureId != null)
    {
      var feature = worldManager.world.features[tile.featureId];

      if (feature.type == FeatureType.Castle)
      {
        tooltip.setText("Return to castle");
      }
      else if (feature.type == FeatureType.Dungeon)
      {
        tooltip.setText("Raid dungeon");
      }
      else if (feature.type == FeatureType.Dwelling)
      {
        tooltip.setText("Visit dwelling");
      }
      else if (feature.type == FeatureType.Gathering)
      {
        tooltip.setText("Visit gathering");
      }
    }
    else
    {
      tooltip.setText("Explore");
    }
  }
  else
  {
    tooltip.setText("Explore");
  }
};

OrderManager.prototype.update = function()
{
  var worldMap = screenManager.screens[ScreenType.WorldMap].worldMap;
  
  // Handle order setup
  if (this.settingUpOrderType != null)
  {
    // Update tooltip
    this.updateTooltip();
    
    // Check for escape
    if (inputManager.keysPressed[27] && !inputManager.keysPressedLastFrame[27])
    {
      inputManager.escapeHandled = true;
      this.cancelOrderSetup();
    }
    
    // Check for mouse down
    if (inputManager.leftButton && !inputManager.leftButtonLastFrame && !inputManager.leftButtonHandled)
    {
      var path;
      var startTile = adventurerManager.getGroupTile(adventurerManager.selectedGroupId);
      
      inputManager.leftButtonHandled = true;
      path = PathfinderHelper.findPath(startTile.i, startTile.j, worldMap.mouseGridI, worldMap.mouseGridJ);
      alert("results of pathfinding: " + path);
    }
    
    // Cache mouse tile position
    this.lastMouseGridI = worldMap.tileGridI;
    this.lastMouseGridJ = worldMap.tileGridJ;
  }
};