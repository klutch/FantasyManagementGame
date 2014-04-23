var NotificationScreen = function()
{
  this.type = ScreenType.Notification;
  this.inputEnabled = true;
  this.z = 50;
  
  // Background
  this.background = PIXI.Sprite.fromImage(game.assetManager.paths.ui.black);
  this.background.position.x = -16;
  this.background.position.y = -16;
  this.background.z = 0;
  this.background.width = game.containerWidth + 32;
  this.background.height = game.containerHeight + 32;
  this.background.alpha = 0.5;
  
  // Container
  this.container = new PIXI.DisplayObjectContainer();
  this.container.z = this.z;
};

NotificationScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.container);
  game.stage.children.sort(depthCompare);
};

NotificationScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.container);
};

NotificationScreen.prototype.showBackground = function()
{
  this.container.addChild(this.background);
};

NotificationScreen.prototype.hideBackground = function()
{
  this.container.removeChild(this.background);
};

NotificationScreen.prototype.update = function()
{
};