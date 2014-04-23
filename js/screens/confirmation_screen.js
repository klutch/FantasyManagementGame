var ConfirmationScreen = function()
{
  this.type = ScreenType.Confirmation;
  this.inputEnabled = true;
  this.z = 90;
  this.confirmBox = null;
  
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

ConfirmationScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.container);
  game.stage.children.sort(depthCompare);
};

ConfirmationScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.container);
};

ConfirmationScreen.prototype.openConfirmation = function(confirmBox)
{
  this.confirmBox = confirmBox;
  this.container.addChild(this.background);
  this.container.addChild(this.confirmBox);
  this.container.children.sort(depthCompare);
};

ConfirmationScreen.prototype.closeConfirmation = function()
{
  this.container.removeChild(this.background);
  this.container.removeChild(this.confirmBox);
  this.confirmBox = null;
};

ConfirmationScreen.prototype.update = function()
{
  if (this.confirmBox != null)
  {
    this.confirmBox.update();
  }
};