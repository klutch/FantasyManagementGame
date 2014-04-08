var WorldMapScreen = function()
{
  var root = this;
  
  this.type = ScreenType.WorldMap;
  this.inputEnabled = true;
  this.z = 80;
  this.isGroupMenuOpen = false;
  this.selectedGroupPanel = null;
  
  // Create button container
  this.mainButtonsContainer = new PIXI.DisplayObjectContainer();
  this.mainButtonsContainer.position.x = 0;
  this.mainButtonsContainer.position.y = 26;
  this.mainButtonsContainer.z = this.z + 2;
  
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
      z: this.z + 2,
      normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.homeCastleButtons[0]),
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
      normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.groupButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.groupButtons[1]),
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
      normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.endTurnButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.endTurnButtons[1]),
      onClick: function(e) { turnManager.startProcessing(); },
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
  if (worldManager.doesTileExist(tileI, tileJ))
  {
    var tile = worldManager.getTile(tileI, tileJ);
    var feature = tile.featureId == undefined ? null : worldManager.world.features[tile.featureId];
    var string = "";
    
    string += "Tile [" + tile.i + ", " + tile.j + "]:\n";
    string += "\ttype: " + tile.type + "\n";
    
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
      }
    }
  }
  else
  {
    string += "Tile does not exist.";
  }
  alert(string);
};

WorldMapScreen.prototype.handleInput = function()
{
  // Handle input
  if (inputManager.keysPressed[KeyCode.A])
  {
    this.worldMap.moveCamera(-5, 0);
  }
  if (inputManager.keysPressed[KeyCode.D])
  {
    this.worldMap.moveCamera(5, 0);
  }
  if (inputManager.keysPressed[KeyCode.S])
  {
    this.worldMap.moveCamera(0, 5);
  }
  if (inputManager.keysPressed[KeyCode.W])
  {
    this.worldMap.moveCamera(0, -5);
  }
  if (inputManager.mouseWheelDelta != 0)
  {
    this.worldMap.zoomCamera(inputManager.mouseWheelDelta * 0.1);
  }
  if (inputManager.leftButton && !inputManager.leftButtonLastFrame && !inputManager.leftButtonHandled)
  {
    this.debugClick(this.worldMap.tileGridI, this.worldMap.tileGridJ);
  }
  
  // E key -- End turn
  if (inputManager.simpleKey(KeyCode.E))
  {
    this.endTurnButton.onClick();
  }
  
  // G key -- Toggle group menu
  if (inputManager.simpleKey(KeyCode.G))
  {
    this.groupButton.onClick();
  }
};

WorldMapScreen.prototype.update = function()
{
  // Update world map component
  this.worldMap.update();
  
  // Update group menu component
  if (this.isGroupMenuOpen) { this.groupMenu.update(); }
  
  // Update resource indicators
  _.each(this.resourceIndicators, function(indicator) { indicator.update(); });
  
  // Update order sub menu
  if (this.orderSubmenu != null) { this.orderSubmenu.update(); }
  
  // Update selected group menu
  if (this.selectedGroupPanel != null) { this.selectedGroupPanel.update(); }
  
  // Update adventurer groups
  this.worldGroups.update();
  
  // Handle input
  if (this.inputEnabled) { this.handleInput(); }
};