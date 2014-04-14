var NotificationSystem = function()
{
  this.type = SystemType.Notification;
  this.notifications = [];
};

NotificationSystem.prototype.initialize = function()
{
  this.worldMapScreen = game.screenManager.screens[ScreenType.WorldMap];
  this.notificationScreen = new NotificationScreen();
};

NotificationSystem.prototype.addNotification = function(notification)
{
  this.notifications.push(notification);
};

NotificationSystem.prototype.removeNotification = function(notification)
{
  for (var i = 0; i < this.notifications.length; i++)
  {
    if (this.notifications[i] == notification)
    {
      delete this.notifications[i];
      break;
    }
  }
  
  this.notifications = _.compact(this.notifications);
};

NotificationSystem.prototype.createDwellingVisitNotification = function(featureId)
{
  var feature = worldManager.world.features[featureId];
  
  var notification = new Notification(
    NotificationType.DwellingVisit,
    {
      featureId: featureId
    });
  
  this.addNotification(notification);
};

NotificationSystem.prototype.update = function()
{
  /*
  if (game.state == GameState.EventProcessing)
  {
    if (this.notifications.length > 0)
    {
      if (!this.notifications[0].open)
      {
        this.notificationScreen.openNotification(this.notifications[0]);
      }
    }
    else
    {
      turnManager.resumeProcessing();
    }
  }*/
};