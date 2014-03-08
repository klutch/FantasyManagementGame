var WorldMapScreen = function()
{
  var root = this;
  
  this.type = ScreenType.WorldMap;
  this.z = 90;
  this.worldRenderer = new WorldRenderer();
  this.resourceBar = new PanelComponent({
    x: -8,
    y: -8,
    z: this.z,
    width: game.containerWidth + 16,
    height: 36
  });
  this.homeButton = new ButtonComponent({
    x: game.containerWidth - 28,
    y: -4,
    z: this.z + 1,
    centerX: true,
    centerY: false,
    normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.homeCastleButtons[0]),
    onClick: function(e) { root.worldRenderer.moveCameraToHome(); },
    tooltipText: "Center on home castle"
  });
  
  this.buildResourceIndicators();
};

WorldMapScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.worldRenderer.container);
  game.stage.addChild(this.worldRenderer.camera);
  game.stage.addChild(this.resourceBar);
  game.stage.addChild(this.homeButton);
  _.each(this.resourceIndicators, function(indicator) { game.stage.addChild(indicator); });
};

WorldMapScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.worldRenderer.container);
  game.stage.removeChild(this.worldRenderer.camera);
  game.stage.removeChild(this.resourceBar);
  game.stage.removeChild(this.homeButton);
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
      this.resourceIndicators[resourceType].z = this.z + (counter + 1) * 0.01;
      counter++;
    },
    this);
};

WorldMapScreen.prototype.update = function()
{
  // Handle input
  if (inputManager.keysPressed[65])
  {
    this.worldRenderer.moveCamera(-5, 0);
  }
  if (inputManager.keysPressed[68])
  {
    this.worldRenderer.moveCamera(5, 0);
  }
  if (inputManager.keysPressed[83])
  {
    this.worldRenderer.moveCamera(0, 5);
  }
  if (inputManager.keysPressed[87])
  {
    this.worldRenderer.moveCamera(0, -5);
  }
  if (inputManager.mouseWheelDelta != 0)
  {
    this.worldRenderer.zoomCamera(inputManager.mouseWheelDelta * 0.1);
  }
  
  this.worldRenderer.update();
  _.each(this.resourceIndicators, function(indicator) { indicator.update(); });
};