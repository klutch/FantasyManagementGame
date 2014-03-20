var Group = function(id, options)
{
  options = options || {};
  options.adventurerIds = options.adventurerIds || [];
  options.tileI = options.tileI || 0;
  options.tileJ = options.tileJ || 0;
  options.featureId = options.featureId == null ? -1 : options.featureId;
  options.name = options.name || "Group " + id;
  options.takesOrders = options.takesOrders || false;
  
  this.id = id;
  this.adventurerIds = options.adventurerIds;
  this.tileI = options.tileI;
  this.tileJ = options.tileJ;
  this.featureId = options.featureId;
  this.name = options.name;
};

Group.prototype.isInFeature = function() { return this.featureId != -1; };