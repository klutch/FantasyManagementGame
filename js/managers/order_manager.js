var OrderManager = function()
{
  this.queuedOrders = [];
  this.settingUpOrderType = null;
  this.lastTileGridI = -999999;
  this.lastTileGridJ = -999999;
  this.hasMouseChangedTiles = false;
  this.worldMap = screenManager.screens[ScreenType.WorldMap].worldMap;
  this.tooltip = screenManager.screens[ScreenType.Tooltip].tooltip;
  
  // Travel order specific variables
  this.settingUpTravelOrderType = null;
  this.travelToFeatureId = null;
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

OrderManager.prototype.endOrderSetup = function()
{
  this.lastTileGridI = -999999;
  this.lastTileGridJ = -999999;
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

OrderManager.prototype.createExploreOrder = function(groupId, tileI, tileJ)
{
  var order = new Order(
    this.getUnusedId(),
    OrderType.Travel,
    groupId,
    {
      travelType: TravelType.Explore,
      tileI: tileI,
      tileJ: tileJ,
      isComplete: function()
      {
        var group = adventurerManager.groups[groupId];
        
        return group.tileI == tileI && group.tileJ == tileJ;
      },
      onComplete: function() { alert("Group at destination"); }
    });
  this.addOrder(order);
};

OrderManager.prototype.createRaidOrder = function(groupId, featureId)
{
  var order = new Order(
    this.getUnusedId(),
    OrderType.Travel,
    groupId,
    {
      travelType: TravelType.Raid,
      featureId: featureId,
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
  // Handle tile context
  if (this.hasMouseChangedTiles)
  {
    if (this.settingUpOrderType == OrderType.Travel)
    {
      // Travel order
      if (worldManager.doesTileExist(this.worldMap.tileGridI, this.worldMap.tileGridJ))
      {
        var tile = worldManager.getTile(this.worldMap.tileGridI, this.worldMap.tileGridJ);

        if (!tile.discovered)
        {
          // Treat undiscovered tiles as out of bounds
          this.tooltip.setText("Out of bounds");
          this.settingUpTravelOrderType = null;
        }
        else if (tile.featureId != null)
        {
          // Change context based on feature type
          var feature = worldManager.world.features[tile.featureId];
          
          this.travelToFeatureId = feature.id;
          if (feature.type == FeatureType.Castle)
          {
            this.tooltip.setText("Return to castle");
            this.settingUpTravelOrderType = TravelType.Explore;
          }
          else if (feature.type == FeatureType.Dungeon)
          {
            this.tooltip.setText("Raid dungeon");
            this.settingUpTravelOrderType = TravelType.Raid;
          }
          else if (feature.type == FeatureType.Dwelling)
          {
            this.tooltip.setText("Visit dwelling");
            this.settingUpTravelOrderType = TravelType.Explore;
          }
          else if (feature.type == FeatureType.Gathering)
          {
            this.tooltip.setText("Visit gathering");
            this.settingUpTravelOrderType = TravelType.Explore;
          }
        }
        else
        {
          this.tooltip.setText("Explore");
          this.settingUpTravelOrderType = TravelType.Explore;
        }
      }
      else
      {
        // Treat non-existent tiles as out of bounds
        this.tooltip.setText("Out of bounds");
        this.settingUpTravelOrderType = null;
      }
    }
  }
  
  // Check for mouse down
  if ((inputManager.leftButton && !inputManager.leftButtonLastFrame && !inputManager.leftButtonHandled) &&
      this.settingUpTravelOrderType != null)
  {
    var path;
    var startTile = adventurerManager.getGroupTile(adventurerManager.selectedGroupId);

    inputManager.leftButtonHandled = true;
    path = PathfinderHelper.findPath(startTile.i, startTile.j, this.worldMap.tileGridI, this.worldMap.tileGridJ);

    if (path != null)
    {
      if (this.settingUpTravelOrderType == TravelType.Explore)
      {
        this.createExploreOrder(adventurerManager.selectedGroupId, this.worldMap.tileGridI, this.worldMap.tileGridJ);
      }
      else if (this.settingUpTravelOrderType == TravelType.Raid)
      {
        this.createRaidOrder(adventurerManager.selectedGroupId, this.travelToFeatureId);
      }
      this.endOrderSetup();
      this.worldMap.drawPath(path);
    }
  }
};

OrderManager.prototype.update = function()
{
  this.hasMouseChangedTiles = this.worldMap.tileGridI != this.lastTileGridI || this.worldMap.tileGridJ != this.lastTileGridJ;
  
  // Handle order setup
  if (this.settingUpOrderType != null)
  {
    // Check for escape
    if (inputManager.keysPressed[27] && !inputManager.keysPressedLastFrame[27])
    {
      inputManager.escapeHandled = true;
      this.endOrderSetup();
    }
    
    if (this.settingUpOrderType == OrderType.Travel)
    {
      this.handleTravelOrderSetup();
    }
    
    // Cache mouse tile position
    this.lastTileGridI = this.worldMap.tileGridI;
    this.lastTileGridJ = this.worldMap.tileGridJ;
  }
};