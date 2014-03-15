var Adventurer = function(id, portraitType, options)
{
  options = options || {};
  options.baseOffense = options.baseOffense || 0;
  options.baseDefense = options.baseDefense || 0;
  options.baseSupport = options.baseSupport || 0;
  options.movementSpeed = options.movementSpeed || 1.0;
  options.isWorker = options.isWorker || false;
  options.description = options.description || "TODO: This adventurer needs a description.";
  
  this.id = id;
  this.portraitType = portraitType;
  this.baseOffense = options.baseOffense;
  this.baseDefense = options.baseDefense;
  this.baseSupport = options.baseSupport;
  this.movementSpeed = options.movementSpeed;
  this.isWorker = options.isWorker;
};