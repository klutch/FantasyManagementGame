var NotificationManager = function()
{
  this.notifications = [];
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
}