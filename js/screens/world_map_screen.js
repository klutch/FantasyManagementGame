var WorldMapScreen = function()
{
  var root = this;
  this.type = ScreenType.WorldMap;
  this.worldRenderer = new WorldRenderer();
  this.bottomBar = new PanelComponent({
    x: -8,
    y: game.containerHeight - 28,
    width: game.containerWidth + 16,
    height: 34
  });
  this.homeButton = new ButtonComponent({
    x: Math.floor(game.containerWidth * 0.5),
    y: game.containerHeight - 28,
    centerX: true,
    centerY: true,
    normalTexture: PIXI.Texture.fromImage(assetPathManager.assetPaths.ui.homeCastleButtons[0]),
    onClick: function(e) { root.worldRenderer.moveCameraToHome(); }
  });
};

WorldMapScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.worldRenderer.container);
  game.stage.addChild(this.worldRenderer.camera);
  game.stage.addChild(this.bottomBar);
  game.stage.addChild(this.homeButton);
};

WorldMapScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.worldRenderer.container);
  game.stage.removeChild(this.worldRenderer.camera);
  game.stage.removeChild(this.bottomBar);
  game.stage.removeChild(this.homeButton);
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
  this.worldRenderer.prerender();
};