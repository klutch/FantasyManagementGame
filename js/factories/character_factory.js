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