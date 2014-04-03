var ViewOrdersScreen = function()
{
  this.type = ScreenType.ViewOrders;
  this.inputEnabled = true;
  this.z = 90;
  
  this.background = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.black);
  this.background.position.x = -16;
  this.background.position.y = -16;
  this.background.z = this.z;
  this.background.width = game.containerWidth + 32;
  this.background.height = game.containerHeight + 32;
  this.background.alpha = 0.5;
};

ViewOrdersScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.background);
  game.stage.children.sort(depthCompare);
};

ViewOrdersScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.background);
};

ViewOrdersScreen.prototype.update = function()
{
};