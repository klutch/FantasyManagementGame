var ShopScreen = function()
{
  this.type = ScreenType.Shop;
  this.inputEnabled = true;
  this.z = 90;
  this.hirePanel = null;
  this.container = new PIXI.DisplayObjectContainer();
  this.container.z = this.z;
  
  // Background
  this.background = PIXI.Sprite.fromImage(game.assetManager.paths.ui.black);
  this.background.position.x = -16;
  this.background.position.y = -16;
  this.background.z = 0;
  this.background.width = game.containerWidth + 32;
  this.background.height = game.containerHeight + 32;
  this.background.alpha = 0.5;
};

ShopScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.container);
};

ShopScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.container);
};

ShopScreen.prototype.openHirePanel = function(featureId)
{
  this.hirePanel = new HireWorkerPanelComponent(this, featureId, {z: 1});
  this.container.addChild(this.background);
  this.container.addChild(this.hirePanel);
};

ShopScreen.prototype.closeHirePanel = function()
{
  this.container.removeChild(this.background);
  this.container.removeChild(this.hirePanel);
  this.hirePanel = null;
};

ShopScreen.prototype.update = function()
{
  if (this.hirePanel != null) { this.hirePanel.update(); }
};