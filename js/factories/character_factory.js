var CharacterFactory = {};

CharacterFactory.createArcher = function(powerLevel)
{
  return new Character(
    characterManager.getUnusedCharacterId(),
    CharacterType.Archer,
    {
      baseOffense: Math.ceil(0.85 * powerLevel),
      baseDefense: 0,
      baseSupport: Math.ceil(0.15 * powerLevel),
      movementAbility: 70,
      description: "Archers are heavily focused on offense, but can provide a small amount of support."
    });
};

CharacterFactory.createKnight = function(powerLevel)
{
  return new Character(
    characterManager.getUnusedCharacterId(),
    CharacterType.Knight,
    {
      baseOffense: Math.ceil(0.5 * powerLevel),
      baseDefense: Math.ceil(0.5 * powerLevel),
      baseSupport: 0,
      movementAbility: 40,
      description: "Knights are trained equally in both offense and defense."
    });
};

CharacterFactory.createHealer = function(powerLevel)
{
  return new Character(
    characterManager.getUnusedCharacterId(),
    CharacterType.Healer,
    {
      baseOffense: 0,
      baseDefense: 0,
      baseSupport: powerLevel,
      movementAbility: 60,
      description: "Healers are trained to support their team."
    });
};

CharacterFactory.createMinerWorker = function()
{
  return new Character(
    characterManager.getUnusedCharacterId(),
    CharacterType.Worker,
    {
      isMiner: true,
      movementAbility: 30,
      description: "Miners mine for valuable resources, and can clear paths through mountainous terrain."
    });
};

CharacterFactory.createLoggerWorker = function()
{
  return new Character(
    characterManager.getUnusedCharacterId(),
    CharacterType.Worker,
    {
      isLogger: true,
      movementAbility: 40,
      description: "Loggers cut down forest terrain, and give you logs."
    });
};

CharacterFactory.createLaborerWorker = function()
{
  return new Character(
    characterManager.getUnusedCharacterId(),
    CharacterType.Worker,
    {
      isLaborer: true,
      movementAbility: 40,
      description: "Laborers perform more generic tasks, like building roads."
    });
};