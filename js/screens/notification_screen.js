var NotificationScreen = function()
{
  this.type = ScreenType.Notification;
  this.inputEnabled = true;
  this.z = 90;
  
  // Background
  this.background = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.black);
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

NotificationScreen.prototype.openNotification = function(notification)
{
  if (notification.type == NotificationType.DwellingVisit)
  {
    var componentInstance = new notification.component(this, notification, notification.featureId);
    
    notification.componentInstance = componentInstance;
    this.container.addChild(this.background);
    this.container.addChild(componentInstance);
    this.container.children.sort(depthCompare);
  }
  
  notification.open = true;
};

NotificationScreen.prototype.closeNotification = function(notification)
{
  this.container.removeChild(notification.componentInstance);
  this.container.removeChild(this.background);
};

NotificationScreen.prototype.update = function()
{
};