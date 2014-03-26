var OrderType = Object.freeze({
  Explore: 0,
  VisitDwelling: 1,
  VisitGathering: 2,
  BuildRoad: 3,
  Log: 4,
  Mine: 5,
  Raid: 6,
  Fight: 7,
  Return: 8
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