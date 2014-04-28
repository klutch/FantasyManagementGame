var WorldMapScreen = function()
{
  var root = this;
  
  this.type = ScreenType.WorldMap;
  this.inputEnabled = true;
  this.z = 10;
  this.isGroupMenuOpen = false;
  this.selectedGroupPanel = null;
  this.worldSystem = game.systemManager.getSystem(SystemType.World);
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.orderSystem = game.systemManager.getSystem(SystemType.Order);
  
  // Create button container
  this.mainButtonsContainer = new PIXI.DisplayObjectContainer();
  this.mainButtonsContainer.position.x = 0;
  this.mainButtonsContainer.position.y = 26;
  this.mainButtonsContainer.z = this.z + 0.5;
  
  // Create world map component
  this.worldMap = new WorldMapComponent();
  
  // Add pathfinder debug component, if flag is set
  if (DEBUG_PATHFINDER)
  {
    this.pathfinderDebug = new PathfinderDebugComponent();
    this.worldMap.addChild(this.pathfinderDebug);
  }
  
  // Create path preview component
  this.pathPreview = new PathPreviewComponent({z: this.z + 1});
  
  // Create adventurer groups component
  this.worldGroups = new WorldGroupsComponent({z: this.z + 2});
  
  // Create resource bar
  this.resourceBar = new PanelComponent({
    x: -8,
    y: -8,
    z: this.z + 1,
    width: game.containerWidth + 16,
    height: 36
  });
  
  // Create home button
  this.homeButton = new ButtonComponent(
    this,
    {
      x: game.containerWidth - 80,
      y: game.containerHeight - 80,
      z: this.z + 0.5,
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.homeCastleButtons[0]),
      onClick: function(e) { root.worldMap.moveCameraToHome(); },
      tooltipCategory: "worldMapScreen",
      tooltipTag: "homeCastleButton",
      tooltipText: "Center on home castle"
    });
  
  // Create group button
  this.groupButton = new ButtonComponent(
    this,
    {
      x: 16,
      y: 16,
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.groupButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.groupButtons[1]),
      onClick: function(e) { root.toggleGroupMenu(); },
      tooltipCategory: "worldMapScreen",
      tooltipTag: "groupMenuButton",
      tooltipText: "Group menu"
    });
  this.mainButtonsContainer.addChild(this.groupButton);
  
  // Create end turn button
  this.endTurnButton = new ButtonComponent(
    this,
    {
      x: 80,
      y: 16,
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.endTurnButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.endTurnButtons[1]),
      onClick: function(e) 
      {
        if (game.state == GameState.WaitingOnPlayer)
        {
          game.switchToNextState();
        }
      },
      tooltipCategory: "worldMapScreen",
      tooltipTag: "endTurnButton",
      tooltipText: "End turn"
    });
  this.mainButtonsContainer.addChild(this.endTurnButton);
  
  // Create group menu
  this.groupMenu = new GroupMenuComponent(
    this,
    {
      x: -8,
      y: -8,
      z: this.z - 1,
      width: 256,
      height: game.containerHeight + 16
    });
  
  // Create resource indicators
  this.buildResourceIndicators();
};

WorldMapScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.worldMap);
  this.worldMap.addChild(this.pathPreview);
  this.worldMap.addChild(this.worldGroups);
  game.stage.addChild(this.resourceBar);
  game.stage.addChild(this.homeButton);
  game.stage.addChild(this.mainButtonsContainer);
  _.each(this.resourceIndicators, function(indicator) { game.stage.addChild(indicator); });
};

WorldMapScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.worldMap);
  this.worldMap.removeChild(this.pathPreview);
  this.worldMap.removeChild(this.worldGroups);
  game.stage.removeChild(this.resourceBar);
  game.stage.removeChild(this.homeButton);
  game.stage.removeChild(this.mainButtonsContainer);
  _.each(this.resourceIndicators, function(indicator) { game.stage.removeChild(indicator); });
};

WorldMapScreen.prototype.buildResourceIndicators = function()
{
  var offset = 74;
  var counter = 0;
  
  this.resourceIndicators = {};
  _.each(ResourceType, function(resourceType)
    {
      this.resourceIndicators[resourceType] = new ResourceIndicatorComponent(this, resourceType, offset * counter, 2);
      this.resourceIndicators[resourceType].z = this.resourceBar.z + (counter + 1) * 0.01;
      counter++;
    },
    this);
};

WorldMapScreen.prototype.toggleGroupMenu = function()
{
  this.isGroupMenuOpen = !this.isGroupMenuOpen;
  
  if (this.isGroupMenuOpen)
  {
    game.stage.addChild(this.groupMenu);
    game.stage.children.sort(depthCompare);
    this.mainButtonsContainer.position.x = 248;
  }
  else
  {
    game.stage.removeChild(this.groupMenu);
    this.mainButtonsContainer.position.x = 0;
  }
};

WorldMapScreen.prototype.openSelectedGroupPanel = function(groupId)
{
  this.selectedGroupPanel = new SelectedGroupPanelComponent(this, groupId, {z: this.z + 0.5});
  game.stage.addChild(this.selectedGroupPanel);
  game.stage.children.sort(depthCompare);
};

WorldMapScreen.prototype.closeSelectedGroupPanel = function()
{
  game.stage.removeChild(this.selectedGroupPanel);
  this.selectedGroupPanel = null;
};

WorldMapScreen.prototype.openOrderSubmenu = function(contexts, groupId, tileI, tileJ)
{
  this.orderSubmenu = new OrderSubMenuComponent(this, contexts, groupId, tileI, tileJ, {z: this.z + 0.9 });
  game.stage.addChild(this.orderSubmenu);
};

WorldMapScreen.prototype.closeOrderSubmenu = function()
{
  game.stage.removeChild(this.orderSubmenu);
  this.orderSubmenu = null;
};

WorldMapScreen.prototype.setTileSelectorColor = function(tint)
{
  this.worldMap.tileSelection.tint = tint;
};

WorldMapScreen.prototype.debugClick = function(tileI, tileJ)
{
  var string = "";
  
  if (this.worldSystem.doesTileExist(tileI, tileJ))
  {
    var tile = this.worldSystem.getTile(tileI, tileJ);
    var feature = tile.featureId == undefined ? null : this.worldSystem.getFeature(tile.featureId);
    
    string += "Tile [" + tile.i + ", " + tile.j + "]:\n";
    string += "\ttype: " + tile.type + "\n";
    string += "\tmovementCost: " + tile.movementCost + "\n";
    string += "\twalkable: " + tile.walkable + "\n";
    
    if (feature != null)
    {
      string += "\nFeature [" + feature.id + "]:";
      string += "\ttype: " + feature.type + "\n";
      
      if (feature.type == FeatureType.Dwelling)
      {
        string += "\tdwellingType: " + feature.dwellingType + "\n";
        string += "\tisLoyaltyFree: " + feature.isLoyaltyFree + "\n";
        string += "\trequiresGift: " + feature.requiresGift + "\n";
        string += "\tisLoyal: " + feature.isLoyal + "\n";
        string += "\thireableGroupId: " + feature.hireableGroupId + "\n";
      }
      else if (feature.type == FeatureType.Gathering)
      {
        string += "\thireableGroupId: " + feature.hireableGroupId + "\n";
      }
    }
  }
  else
  {
    string = "Tile does not exist.";
  }
  alert(string);
};

WorldMapScreen.prototype.getOrderContexts = function(groupId, i, j)
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

WorldMapScreen.prototype.handleInput = function()
{
  var mouseI = this.worldMap.tileGridI;
  var mouseJ = this.worldMap.tileGridJ;
  
  if (game.inputManager.keysPressed[KeyCode.A])
  {
    this.worldMap.moveCamera(-5, 0);
  }
  if (game.inputManager.keysPressed[KeyCode.D])
  {
    this.worldMap.moveCamera(5, 0);
  }
  if (game.inputManager.keysPressed[KeyCode.S])
  {
    this.worldMap.moveCamera(0, 5);
  }
  if (game.inputManager.keysPressed[KeyCode.W])
  {
    this.worldMap.moveCamera(0, -5);
  }
  if (game.inputManager.mouseWheelDelta != 0)
  {
    this.worldMap.zoomCamera(game.inputManager.mouseWheelDelta * 0.1);
  }
  
  // Handle order setup
  if (this.orderSystem.settingUpOrder)
  {
    // Escape key -- cancel order setup
    if (game.inputManager.simpleKey(KeyCode.Escape))
    {
      this.orderSystem.endOrderSetup();
    }
    
    // Check for mouse
    if (game.inputManager.singleLeftButton())
    {
      var contexts = this.getOrderContexts(this.groupSystem.selectedGroupId, mouseI, mouseJ);
      var numContexts = _.size(contexts);
      
      game.inputManager.leftButtonHandled = true;
      
      if (numContexts > 1)
      {
        // Show sub menu
        if (this.orderSubmenu == null)
        {
          this.openOrderSubmenu(contexts, this.groupSystem.selectedGroupId, mouseI, mouseJ);
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
          this.orderSystem.createExploreOrder(this.groupSystem.selectedGroupId, mouseI, mouseJ);
        }
        else if (contextKey == OrderType.Mine)
        {
          this.orderSystem.createMineOrder(this.groupSystem.selectedGroupId, mouseI, mouseJ);
        }
        if (!game.inputManager.keysPressed[KeyCode.Shift])
        {
          this.orderSystem.endOrderSetup();
        }
      }
      else
      {
        console.log("no contexts");
      }
    }
  }
  
  // E key -- End turn
  if (game.inputManager.simpleKey(KeyCode.E))
  {
    this.endTurnButton.onClick();
  }
  
  // G key -- Toggle group menu
  if (game.inputManager.simpleKey(KeyCode.G))
  {
    this.groupButton.onClick();
  }
  
  if (game.inputManager.singleLeftButton())
  {
    this.debugClick(this.worldMap.tileGridI, this.worldMap.tileGridJ);
  }
};

WorldMapScreen.prototype.update = function()
{
  // Update components
  this.groupButton.update();
  this.endTurnButton.update();
  this.worldMap.update();
  if (this.isGroupMenuOpen) { this.groupMenu.update(); }
  _.each(this.resourceIndicators, function(indicator) { indicator.update(); });
  if (this.orderSubmenu != null) { this.orderSubmenu.update(); }
  if (this.selectedGroupPanel != null) { this.selectedGroupPanel.update(); }
  this.worldGroups.update();
  
  // Handle input
  if (this.inputEnabled && game.state == GameState.WaitingOnPlayer)
  {
    this.handleInput();
  }
};