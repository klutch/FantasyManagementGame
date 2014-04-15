var CharacterFactory = {};

CharacterFactory.createArcher = function(powerLevel)
{
  var characterSystem = game.systemManager.getSystem(SystemType.Character);
  
  return characterSystem.createCharacter({
    type: CharacterType.Archer,
    baseOffense: Math.ceil(0.85 * powerLevel),
    baseDefense: 0,
    baseSupport: Math.ceil(0.15 * powerLevel),
    movementAbility: 170,
    isExplorer: true,
    description: "Archers are heavily focused on offense, but can provide a small amount of support."
  });
};

CharacterFactory.createKnight = function(powerLevel)
{
  var characterSystem = game.systemManager.getSystem(SystemType.Character);
  
  return characterSystem.createCharacter({
    type: CharacterType.Knight,
    baseOffense: Math.ceil(0.5 * powerLevel),
    baseDefense: Math.ceil(0.5 * powerLevel),
    baseSupport: 0,
    movementAbility: 140,
    description: "Knights are trained equally in both offense and defense."
  });
};

CharacterFactory.createHealer = function(powerLevel)
{
  var characterSystem = game.systemManager.getSystem(SystemType.Character);
  
  return characterSystem.createCharacter({
    type: CharacterType.Healer,
    baseOffense: 0,
    baseDefense: 0,
    baseSupport: powerLevel,
    movementAbility: 160,
    description: "Healers are trained to support their team."
  });
};

CharacterFactory.createMinerWorker = function()
{
  var characterSystem = game.systemManager.getSystem(SystemType.Character);
  
  return characterSystem.createCharacter({
    type: CharacterType.Worker,
    isMiner: true,
    movementAbility: 130,
    description: "Miners mine for valuable resources, and can clear paths through mountainous terrain."
  });
};

CharacterFactory.createLoggerWorker = function()
{
  var characterSystem = game.systemManager.getSystem(SystemType.Character);
  
  return characterSystem.createCharacter({
    type: CharacterType.Worker,
    isLogger: true,
    movementAbility: 140,
    description: "Loggers cut down forest terrain, and give you logs."
  });
};

CharacterFactory.createLaborerWorker = function()
{
  var characterSystem = game.systemManager.getSystem(SystemType.Character);
  
  return characterSystem.createCharacter({
    type: CharacterType.Worker,
    isLaborer: true,
    movementAbility: 140,
    description: "Laborers perform more generic tasks, like building roads."
  });
};