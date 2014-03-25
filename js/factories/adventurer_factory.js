var AdventurerFactory = {};

AdventurerFactory.createArcher = function(powerLevel)
{
  return new Adventurer(
    adventurerManager.getUnusedAdventurerId(),
    AdventurerType.Archer,
    {
      baseOffense: Math.ceil(0.85 * powerLevel),
      baseDefense: 0,
      baseSupport: Math.ceil(0.15 * powerLevel),
      movementAbility: 70,
      description: "Archers are heavily focused on offense, but can provide a small amount of support."
    });
};

AdventurerFactory.createKnight = function(powerLevel)
{
  return new Adventurer(
    adventurerManager.getUnusedAdventurerId(),
    AdventurerType.Knight,
    {
      baseOffense: Math.ceil(0.5 * powerLevel),
      baseDefense: Math.ceil(0.5 * powerLevel),
      baseSupport: 0,
      movementAbility: 40,
      description: "Knights are trained equally in both offense and defense."
    });
};

AdventurerFactory.createHealer = function(powerLevel)
{
  return new Adventurer(
    adventurerManager.getUnusedAdventurerId(),
    AdventurerType.Healer,
    {
      baseOffense: 0,
      baseDefense: 0,
      baseSupport: powerLevel,
      movementAbility: 60,
      description: "Healers are trained to support their team."
    });
};