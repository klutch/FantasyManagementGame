var AdventurerType = Object.freeze({
  Worker: "Worker",
  Archer: "Archer",
  Knight: "Knight",
  Healer: "Healer"
});

var Adventurer = function(id, type, options)
{
  options = options || {};
  options.baseOffense = options.baseOffense || 0;
  options.baseDefense = options.baseDefense || 0;
  options.baseSupport = options.baseSupport || 0;
  options.movementAbility = options.movementAbility || 50;
  options.isWorker = options.isWorker || false;
  options.description = options.description || "TODO: This adventurer needs a description.";
  options.discoveryRadius = options.discoveryRadius || 8;
  
  this.id = id;
  this.type = type;
  this.baseOffense = options.baseOffense;
  this.baseDefense = options.baseDefense;
  this.baseSupport = options.baseSupport;
  this.movementAbility = options.movementAbility;
  this.isWorker = options.isWorker;
  this.discoveryRadius = options.discoveryRadius;
};