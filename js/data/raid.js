var Raid = function(id, featureId, groupId, options)
{
  options = options || {};
  options.turnsToComplete = options.turnToComplete || 5;
  
  this.id = id;
  this.featureId = featureId;
  this.groupId = groupId;
  this.turnsPassed = 0;
  
  for (var key in options)
  {
    if (options.hasOwnProperty(key))
    {
      this[key] = options[key];
    }
  }
};