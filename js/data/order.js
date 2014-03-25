var OrderType = Object.freeze({
  Explore: 0,
  BuildRoad: 1,
  Log: 2,
  Mine: 3,
  Raid: 4,
  Fight: 5
});

var Order = function(id, type, groupId, options)
{
  this.id = id;
  this.type = type;
  this.groupId = groupId;
  this.isDoneForThisTurn = false;
  
  for (var key in options)
  {
    if (options.hasOwnProperty(key))
    {
      this[key] = options[key];
    }
  }
};