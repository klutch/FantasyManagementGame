var CharacterType = Object.freeze({
  Worker: "Worker",
  Archer: "Archer",
  Knight: "Knight",
  Healer: "Healer"
});

var Character = function(id, options)
{
  options = options || {};
  options.type = options.type || CharacterType.Worker;
  options.baseOffense = options.baseOffense || 0;
  options.baseDefense = options.baseDefense || 0;
  options.baseSupport = options.baseSupport || 0;
  options.movementAbility = options.movementAbility || 50;
  options.isMiner = options.isMiner || false;
  options.isLogger = options.isLogger || false;
  options.isLaborer = options.isLaborer || false;
  options.isExplorer = options.isExplorer || false;
  options.description = options.description || "TODO: This character needs a description.";
  options.discoveryRadius = options.discoveryRadius || 8;
  
  for (var key in options)
  {
    if (options.hasOwnProperty(key))
    {
      this[key] = options[key];
    }
  }
  
  this.id = id;
  this.isWorker = this.isMiner || this.isLogger || this.isLaborer;
  this.inventoryItemIds = [];
  this.equipmentSlotIds = [];
};