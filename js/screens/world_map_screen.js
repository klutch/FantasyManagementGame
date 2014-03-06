var WorldMapScreen = function()
{
  var root = this;
  this.type = ScreenType.WorldMap;
  this.worldRenderer = new WorldRenderer();
  this.bottomBar = new PanelComponent({
    x: -8,
    y: -8,
    width: game.containerWidth + 16,
    height: 34
  });
  this.homeButton = new ButtonComponent({
    x: game.containerWidth - 28,
    y: -4,
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
  game.stage.addChild(this.bottomBar);
  game.stage.addChild(this.homeButton);
  _.each(this.resourceIndicators, function(indicator) { game.stage.addChild(indicator); });
};

WorldMapScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.worldRenderer.container);
  game.stage.removeChild(this.worldRenderer.camera);
  game.stage.removeChild(this.bottomBar);
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