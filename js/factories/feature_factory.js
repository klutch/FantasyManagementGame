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
  var feature = new Feature(
    worldManager.getUnusedFeatureId(),
    FeatureType.Castle,
    tileI,
    tileJ,
    4,
    4);
  feature.castleType = CastleType.Player;
  worldManager.addFeature(feature);
  return feature;
};

FeatureFactory.createTownDwelling = function(tileI, tileJ, options)
{
  var feature = new Feature(
    worldManager.getUnusedFeatureId(),
    FeatureType.Dwelling,
    tileI,
    tileJ,
    2,
    2);
  var workerGroup = characterManager.createGroup({name: "Available Workers", playerControlled: false});
  
  characterManager.addCharacter(workerGroup.id, CharacterFactory.createMinerWorker());
  characterManager.addCharacter(workerGroup.id, CharacterFactory.createMinerWorker());
  characterManager.addCharacter(workerGroup.id, CharacterFactory.createLaborerWorker());
  characterManager.addCharacter(workerGroup.id, CharacterFactory.createLaborerWorker());
  
  this.copyOptionsToFeature(feature, options);
  feature.dwellingType = DwellingType.Town;
  feature.workerGroupId = workerGroup.id;
  worldManager.addFeature(feature);
  return feature;
};

FeatureFactory.createGroveDwelling = function(tileI, tileJ, options)
{
  var feature = new Feature(
    worldManager.getUnusedFeatureId(),
    FeatureType.Dwelling,
    tileI,
    tileJ,
    2,
    2);
  var workerGroup = characterManager.createGroup({name: "Available Workers", playerControlled: false});
  
  characterManager.addCharacter(workerGroup.id, CharacterFactory.createMinerWorker());
  characterManager.addCharacter(workerGroup.id, CharacterFactory.createLoggerWorker());
  characterManager.addCharacter(workerGroup.id, CharacterFactory.createLoggerWorker());
  characterManager.addCharacter(workerGroup.id, CharacterFactory.createLaborerWorker());
  
  this.copyOptionsToFeature(feature, options);
  feature.dwellingType = DwellingType.Grove;
  feature.workerGroupId = workerGroup.id;
  worldManager.addFeature(feature);
  return feature;
};

FeatureFactory.createCaveDungeon = function(tileI, tileJ, options)
{
  var feature = new Feature(
    worldManager.getUnusedFeatureId(),
    FeatureType.Dungeon,
    tileI,
    tileJ,
    2,
    2);
  
  this.copyOptionsToFeature(feature, options);
  feature.dungeonType = DungeonType.Cave;
  worldManager.addFeature(feature);
  return feature;
};

FeatureFactory.createTavernGathering = function(tileI, tileJ, options)
{
  var feature = new Feature(
    worldManager.getUnusedFeatureId(),
    FeatureType.Gathering,
    tileI,
    tileJ,
    2,
    1);
  
  this.copyOptionsToFeature(feature, options);
  feature.gatheringType = GatheringType.Tavern;
  worldManager.addFeature(feature);
  return feature;
};