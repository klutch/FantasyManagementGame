var FeatureFactory = {};

FeatureFactory.copyOptionsToFeature = function(feature, options)
{
  options = options || {};
  for (var key in options)
  {
    if (options.hasOwnProperty(key))
    {
      feature[key] = options[key];
    }
  }
};

FeatureFactory.createPlayerCastle = function(tileI, tileJ)
{
  var worldSystem = game.systemManager.getSystem(SystemType.World);
  var feature = new Feature(
    worldSystem.getUnusedFeatureId(),
    FeatureType.Castle,
    tileI,
    tileJ,
    4,
    4);
  feature.castleType = CastleType.Player;
  worldSystem.addFeature(feature);
  return feature;
};

FeatureFactory.createTownDwelling = function(tileI, tileJ, options)
{
  var worldSystem = game.systemManager.getSystem(SystemType.World);
  var groupSystem = game.systemManager.getSystem(SystemType.Group);
  var feature = new Feature(
    worldSystem.getUnusedFeatureId(),
    FeatureType.Dwelling,
    tileI,
    tileJ,
    2,
    2);
  var workerGroup = groupSystem.createGroup({name: "Available Workers", playerControlled: false});
  var defenderGroup = groupSystem.createGroup({name: "Town Guards", playerControlled: false});
  
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createMinerWorker().id);
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createMinerWorker().id);
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createLaborerWorker().id);
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createLaborerWorker().id);
  
  workerGroup.tileI = feature.tileI;
  workerGroup.tileJ = feature.tileJ;
  
  groupSystem.addCharacterToGroup(defenderGroup.id, CharacterFactory.createKnight(10).id);
  groupSystem.addCharacterToGroup(defenderGroup.id, CharacterFactory.createHealer(10).id);
  
  defenderGroup.tileI = feature.tileI;
  defenderGroup.tileJ = feature.tileJ;
  
  this.copyOptionsToFeature(feature, options);
  feature.dwellingType = DwellingType.Town;
  feature.hireableGroupId = workerGroup.id;
  feature.defenderGroupId = defenderGroup.id;
  worldSystem.addFeature(feature);
  return feature;
};

FeatureFactory.createGroveDwelling = function(tileI, tileJ, options)
{
  var worldSystem = game.systemManager.getSystem(SystemType.World);
  var groupSystem = game.systemManager.getSystem(SystemType.Group);
  var feature = new Feature(
    worldSystem.getUnusedFeatureId(),
    FeatureType.Dwelling,
    tileI,
    tileJ,
    2,
    2);
  var workerGroup = groupSystem.createGroup({name: "Available Workers", playerControlled: false});
  var defenderGroup = groupSystem.createGroup({name: "Town Guards", playerControlled: false});
  
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createMinerWorker().id);
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createLoggerWorker().id);
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createLoggerWorker().id);
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createLaborerWorker().id);
  
  workerGroup.tileI = feature.tileI;
  workerGroup.tileJ = feature.tileJ;
  
  groupSystem.addCharacterToGroup(defenderGroup.id, CharacterFactory.createKnight(10).id);
  groupSystem.addCharacterToGroup(defenderGroup.id, CharacterFactory.createHealer(10).id);
  
  defenderGroup.tileI = feature.tileI;
  defenderGroup.tileJ = feature.tileJ;
  
  this.copyOptionsToFeature(feature, options);
  feature.dwellingType = DwellingType.Grove;
  feature.hireableGroupId = workerGroup.id;
  feature.defenderGroupId = defenderGroup.id;
  worldSystem.addFeature(feature);
  return feature;
};

FeatureFactory.createCaveDungeon = function(tileI, tileJ, options)
{
  var worldSystem = game.systemManager.getSystem(SystemType.World);
  var groupSystem = game.systemManager.getSystem(SystemType.Group);
  var feature = new Feature(
    worldSystem.getUnusedFeatureId(),
    FeatureType.Dungeon,
    tileI,
    tileJ,
    2,
    2);
  var group = groupSystem.createGroup({name: "Enemy Group", playerControlled: false});
  
  groupSystem.addCharacterToGroup(group.id, CharacterFactory.createKnight(10).id);
  groupSystem.addCharacterToGroup(group.id, CharacterFactory.createKnight(10).id);
  groupSystem.addCharacterToGroup(group.id, CharacterFactory.createArcher(10).id);
  
  this.copyOptionsToFeature(feature, options);
  feature.dungeonType = DungeonType.Cave;
  feature.enemyGroupId = group.id;
  worldSystem.addFeature(feature);
  return feature;
};

FeatureFactory.createTavernGathering = function(tileI, tileJ, options)
{
  var worldSystem = game.systemManager.getSystem(SystemType.World);
  var groupSystem = game.systemManager.getSystem(SystemType.Group);
  var feature = new Feature(
    worldSystem.getUnusedFeatureId(),
    FeatureType.Gathering,
    tileI,
    tileJ,
    2,
    1);
  
  var group = groupSystem.createGroup({name: "Adventurers", playerControlled: false});
  
  groupSystem.addCharacterToGroup(group.id, CharacterFactory.createKnight(10).id);
  groupSystem.addCharacterToGroup(group.id, CharacterFactory.createKnight(10).id);
  groupSystem.addCharacterToGroup(group.id, CharacterFactory.createArcher(10).id);
  groupSystem.addCharacterToGroup(group.id, CharacterFactory.createArcher(10).id);
  
  this.copyOptionsToFeature(feature, options);
  feature.gatheringType = GatheringType.Tavern;
  feature.hireableGroupId = group.id;
  worldSystem.addFeature(feature);
  return feature;
};