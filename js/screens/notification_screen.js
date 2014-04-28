var NotificationScreen = function()
{
  this.type = ScreenType.Notification;
  this.inputEnabled = true;
  this.z = 50;
  this.components = [];
  
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

NotificationScreen.prototype.addComponent = function(component)
{
  this.container.addChild(component);
  this.components.push(component);
};

NotificationScreen.prototype.removeComponent = function(component)
{
  this.container.removeChild(component);
  
  for (var i = 0; i < this.components.length; i++)
  {
    if (this.components[i] == component)
    {
      delete this.components[i];
      break;
    }
  }
  
  this.components = _.compact(this.components);
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
  for (var i = 0; i < this.components.length; i++)
  {
    this.components[i].update();
  }
};