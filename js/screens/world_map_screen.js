var WorldMapScreen = function(world)
{
  var root = this;
  
  this.type = ScreenType.WorldMap;
  this.z = 90;
  this.world = world;
  
  // Create world map component
  this.worldMap = new WorldMapComponent();
  
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
    x: game.containerWidth - 28,
    y: -4,
    z: this.z + 2,
    centerX: true,
    centerY: false,
    normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.homeCastleButtons[0]),
    onClick: function(e) { root.worldMap.moveCameraToHome(); },
    tooltipText: "Center on home castle"
  });
  
  // Create group button
  this.groupButton = new ButtonComponent({
    x: 16,
    y: 32,
    z: this.z + 2,
    normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.groupButtons[0]),
    hoverTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.groupButtons[1]),
    tooltipText: "Group menu"
  });
  
  // Create resource indicators
  this.buildResourceIndicators();
};

WorldMapScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.worldMap);
  game.stage.addChild(this.resourceBar);
  game.stage.addChild(this.homeButton);
  game.stage.addChild(this.groupButton);
  _.each(this.resourceIndicators, function(indicator) { game.stage.addChild(indicator); });
};

WorldMapScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.worldMap);
  game.stage.removeChild(this.resourceBar);
  game.stage.removeChild(this.homeButton);
  game.stage.removeChild(this.groupButton);
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

WorldMapScreen.prototype.handleInput = function()
{
  // Handle input
  if (inputManager.keysPressed[65])
  {
    this.worldMap.moveCamera(-5, 0);
  }
  if (inputManager.keysPressed[68])
  {
    this.worldMap.moveCamera(5, 0);
  }
  if (inputManager.keysPressed[83])
  {
    this.worldMap.moveCamera(0, 5);
  }
  if (inputManager.keysPressed[87])
  {
    this.worldMap.moveCamera(0, -5);
  }
  if (inputManager.mouseWheelDelta != 0)
  {
    this.worldMap.zoomCamera(inputManager.mouseWheelDelta * 0.1);
  }
};

WorldMapScreen.prototype.update = function()
{
  // Handle input
  this.handleInput();
  
  // Update world map component
  this.worldMap.update();
  
  // Update resource indicators
  _.each(this.resourceIndicators, function(indicator) { indicator.update(); });
};