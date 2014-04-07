var NotificationManager = function()
{
  this.notifications = [];
  this.worldMapScreen = screenManager.screens[ScreenType.WorldMap];
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

NotificationManager.prototype.showNotification = function(notification)
{
  if (notification.type == NotificationType.DwellingVisit)
  {
    var component = new notification.component(this.worldMapScreen, notification.featureId);
    
    game.stage.addChild(component);
    console.log("added dwelling notification component to the stage");
  }
  
  notification.open = true;
};

NotificationManager.prototype.createDwellingVisitNotification = function(featureId)
{
  var feature = worldManager.world.features[featureId];
  
  var notification = new Notification(
    NotificationType.DwellingVisit,
    {
      featureId: featureId,
      component: feature.isLoyal ? HireWorkerPanelComponent : DwellingLoyaltyComponent
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
        this.showNotification(this.notifications[0]);
      }
    }
  }
};