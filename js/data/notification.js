var NotificationType = Object.freeze({
  DwellingVisit: 0
});

var Notification = function(type, options)
{
  options = options || {};
  
  this.type = type;
  this.open = false;
  
  for (var key in options)
  {
    if (options.hasOwnProperty(key))
    {
      this[key] = options[key];
    }
  }
};