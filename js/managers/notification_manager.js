var NotificationManager = function()
{
  this.notifications = [];
};

NotificationManager.prototype.initialize = function()
{
  this.worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  this.notificationScreen = new NotificationScreen();
};

NotificationManager.prototype.addNotification = function(notification)
{
  this.notifications.push(notification);
};

NotificationManager.prototype.removeNotification = function(notification)
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

NotificationManager.prototype.createDwellingVisitNotification = function(featureId)
{
  var feature = worldManager.world.features[featureId];
  
  var notification = new Notification(
    NotificationType.DwellingVisit,
    {
      featureId: featureId
    });
  
  this.addNotification(notification);
};

NotificationManager.prototype.update = function()
{
  if (turnManager.state == TurnState.PausedProcessing)
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
  }
};