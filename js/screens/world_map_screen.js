var WorldMapScreen = function()
{
  this.type = ScreenType.WorldMap;
  this.worldRenderer = new WorldRenderer();
  this.bottomBar = new PanelComponent({
    x: -8,
    y: game.containerHeight - 28,
    width: game.containerWidth + 16,
    height: 34
  });
};

WorldMapScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.worldRenderer.container);
  game.stage.addChild(this.worldRenderer.camera);
  game.stage.addChild(this.bottomBar);
};

WorldMapScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.worldRenderer.container);
  game.stage.removeChild(this.worldRenderer.camera);
  game.stage.removeChild(this.bottomBar);
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