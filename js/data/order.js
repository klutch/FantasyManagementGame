var OrderType = Object.freeze({
  Travel: 0,
  BuildRoad: 1,
  Log: 2,
  Mine: 3
});

var TravelType = Object.freeze({
  Raid: 0,
  Fight: 1,
  Explore: 2
});

var Order = function(type, options)
{
  this.type = type;
  this.isComplete = options.isComplete;
  
  if (type == OrderType.Travel)
  {
    this.travelType = options.travelType;
    
    if (this.travelType == TravelType.Raid)
    {
      this.featureId = options.featureId;
    }
    else if (this.travelType == TravelType.Fight)
    {
      this.enemyId = options.enemyId;
    }
    else if (this.travelType == TravelType.Explore)
    {
      this.tileI = options.tileI;
      this.tileJ = options.tileJ;
    }
  }
  else if (type == OrderType.BuildRoad)
  {
    this.waypoints = options.waypoints;
  }
  else if (type == OrderType.Log)
  {
    this.tileI = options.tileI;
    this.tileJ = options.tileJ;
  }
  else if (type == OrderType.Mine)
  {
    this.tileI = options.tileI;
    this.tileJ = options.tileJ;
  }
};