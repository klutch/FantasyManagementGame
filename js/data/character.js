var CharacterType = Object.freeze({
  Worker: "Worker",
  Archer: "Archer",
  Knight: "Knight",
  Healer: "Healer"
});

var Character = function(id, type, options)
{
  options = options || {};
  options.baseOffense = options.baseOffense || 0;
  options.baseDefense = options.baseDefense || 0;
  options.baseSupport = options.baseSupport || 0;
  options.movementAbility = options.movementAbility || 50;
  options.isMiner = options.isMiner || false;
  options.isLogger = options.isLogger || false;
  options.isLaborer = options.isLaborer || false;
  options.description = options.description || "TODO: This character needs a description.";
  options.discoveryRadius = options.discoveryRadius || 8;
  
  this.id = id;
  this.type = type;
  this.baseOffense = options.baseOffense;
  this.baseDefense = options.baseDefense;
  this.baseSupport = options.baseSupport;
  this.movementAbility = options.movementAbility;
  this.isMiner = options.isMiner;
  this.isLogger = options.isLogger;
  this.isLaborer = options.isLaborer;
  this.isWorker = this.isMiner || this.isLogger || this.isLaborer;
  this.discoveryRadius = options.discoveryRadius;
};