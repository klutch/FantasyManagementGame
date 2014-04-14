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
  
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createMinerWorker().id);
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createMinerWorker().id);
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createLaborerWorker().id);
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createLaborerWorker().id);
  
  workerGroup.tileI = feature.tileI;
  workerGroup.tileJ = feature.tileJ;
  
  this.copyOptionsToFeature(feature, options);
  feature.dwellingType = DwellingType.Town;
  feature.workerGroupId = workerGroup.id;
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
  
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createMinerWorker().id);
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createLoggerWorker().id);
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createLoggerWorker().id);
  groupSystem.addCharacterToGroup(workerGroup.id, CharacterFactory.createLaborerWorker().id);
  
  workerGroup.tileI = feature.tileI;
  workerGroup.tileJ = feature.tileJ;
  
  this.copyOptionsToFeature(feature, options);
  feature.dwellingType = DwellingType.Grove;
  feature.workerGroupId = workerGroup.id;
  worldSystem.addFeature(feature);
  return feature;
};

FeatureFactory.createCaveDungeon = function(tileI, tileJ, options)
{
  var worldSystem = game.systemManager.getSystem(SystemType.World);
  var feature = new Feature(
    worldSystem.getUnusedFeatureId(),
    FeatureType.Dungeon,
    tileI,
    tileJ,
    2,
    2);
  
  this.copyOptionsToFeature(feature, options);
  feature.dungeonType = DungeonType.Cave;
  worldSystem.addFeature(feature);
  return feature;
};

FeatureFactory.createTavernGathering = function(tileI, tileJ, options)
{
  var worldSystem = game.systemManager.getSystem(SystemType.World);
  var feature = new Feature(
    worldSystem.getUnusedFeatureId(),
    FeatureType.Gathering,
    tileI,
    tileJ,
    2,
    1);
  
  this.copyOptionsToFeature(feature, options);
  feature.gatheringType = GatheringType.Tavern;
  worldSystem.addFeature(feature);
  return feature;
};