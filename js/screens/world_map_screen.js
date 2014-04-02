var WorldMapScreen = function(world)
{
  var root = this;
  
  this.type = ScreenType.WorldMap;
  this.z = 90;
  this.world = world;
  this.isGroupPanelOpen = false;
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
  this.adventurerGroups = new AdventurerGroupsComponent({z: this.z + 2});
  
  // Create resource bar
  this.resourceBar = new PanelComponent({
    x: -8,
    y: -8,
    z: this.z + 1,
    width: game.containerWidth + 16,
    height: 36
  });
  
  // Create home button
  this.homeButton = new ButtonComponent({
    x: game.containerWidth - 80,
    y: game.containerHeight - 80,
    z: this.z + 2,
    normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.homeCastleButtons[0]),
    onClick: function(e) { root.worldMap.moveCameraToHome(); },
    tooltipText: "Center on home castle"
  });
  
  // Create group button
  this.groupButton = new ButtonComponent({
    x: 16,
    y: 16,
    normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.groupButtons[0]),
    hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.groupButtons[1]),
    onClick: function(e) { root.toggleGroupPanel(); },
    tooltipText: "Group menu"
  });
  this.mainButtonsContainer.addChild(this.groupButton);
  
  // Create end turn button
  this.endTurnButton = new ButtonComponent({
    x: 80,
    y: 16,
    normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.endTurnButtons[0]),
    hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.endTurnButtons[1]),
    onClick: function(e) { turnManager.startProcessing(); },
    tooltipText: "End turn"
  });
  this.mainButtonsContainer.addChild(this.endTurnButton);
  
  // Create group panel
  this.groupPanel = new GroupPanelComponent({
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
  this.worldMap.addChild(this.adventurerGroups);
  game.stage.addChild(this.resourceBar);
  game.stage.addChild(this.homeButton);
  game.stage.addChild(this.mainButtonsContainer);
  _.each(this.resourceIndicators, function(indicator) { game.stage.addChild(indicator); });
};

WorldMapScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.worldMap);
  this.worldMap.removeChild(this.pathPreview);
  this.worldMap.removeChild(this.adventurerGroups);
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
      this.resourceIndicators[resourceType] = new ResourceIndicatorComponent(resourceType, offset * counter, 2);
      this.resourceIndicators[resourceType].z = this.resourceBar.z + (counter + 1) * 0.01;
      counter++;
    },
    this);
};

WorldMapScreen.prototype.toggleGroupPanel = function()
{
  this.isGroupPanelOpen = !this.isGroupPanelOpen;
  
  if (this.isGroupPanelOpen)
  {
    game.stage.addChild(this.groupPanel);
    game.stage.children.sort(depthCompare);
    this.mainButtonsContainer.position.x = 248;
  }
  else
  {
    game.stage.removeChild(this.groupPanel);
    this.mainButtonsContainer.position.x = 0;
  }
};

WorldMapScreen.prototype.openSelectedGroupPanel = function(groupId)
{
  this.selectedGroupPanel = new SelectedGroupPanelComponent(groupId, {z: this.z + 1});
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
  this.orderSubmenu = new OrderSubMenuComponent(contexts, groupId, tileI, tileJ, {z: this.z + 0.9 });
  game.stage.addChild(this.orderSubmenu);
  console.log("opened submenu");
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
    alert("world map clicked: [" + this.worldMap.tileGridI + ", " + this.worldMap.tileGridJ + "]");
  }
  
  // E key -- End turn
  if (inputManager.simpleKey(KeyCode.E))
  {
    this.endTurnButton.onClick();
  }
  
  // G key -- Toggle group panel
  if (inputManager.simpleKey(KeyCode.G))
  {
    this.groupButton.onClick();
  }
};

WorldMapScreen.prototype.update = function()
{
  // Update world map component
  this.worldMap.update();
  
  // Update group panel component
  if (this.isGroupPanelOpen) { this.groupPanel.update(); }
  
  // Update resource indicators
  _.each(this.resourceIndicators, function(indicator) { indicator.update(); });
  
  // Update order sub menu
  if (this.orderSubmenu != null) { this.orderSubmenu.update(); }
  
  // Update selected group panel
  if (this.selectedGroupPanel != null) { this.selectedGroupPanel.update(); }
  
  // Update adventurer groups
  this.adventurerGroups.update();
  
  // Handle input
  this.handleInput();
};