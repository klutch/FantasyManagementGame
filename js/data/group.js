var Group = function(id, options)
{
  options = options || {};
  options.characterIds = options.characterIds || [];
  options.tileI = options.tileI || 0;
  options.tileJ = options.tileJ || 0;
  options.featureId = options.featureId == null ? -1 : options.featureId;
  options.name = options.name || "Group " + id;
  options.playerControlled = options.playerControlled == undefined ? true : options.playerControlled;
  
  this.id = id;
  this.characterIds = options.characterIds;
  this.tileI = options.tileI;
  this.tileJ = options.tileJ;
  this.featureId = options.featureId;
  this.name = options.name;
  this.movementUsed = 0;
  this.playerControlled = options.playerControlled;
  
  if (this.featureId != -1)
  {
    var feature = worldManager.world.features[this.featureId];
    
    // Temporary debug
    if (feature == undefined)
    {
      console.error("Feature is undefined");
    }
    
    this.tileI = feature.tileI;
    this.tileJ = feature.tileJ;
  }
};

Group.prototype.isInFeature = function() { return this.featureId != -1; };