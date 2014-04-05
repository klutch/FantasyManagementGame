var FeatureFactory = {};

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

FeatureFactory.createTownDwelling = function(tileI, tileJ)
{
  var feature = new Feature(
    worldManager.getUnusedFeatureId(),
    FeatureType.Dwelling,
    tileI,
    tileJ,
    2,
    2);
  
  feature.dwellingType = DwellingType.Town;
  worldManager.addFeature(feature);
  return feature;
};

FeatureFactory.createGroveDwelling = function(tileI, tileJ)
{
  var feature = new Feature(
    worldManager.getUnusedFeatureId(),
    FeatureType.Dwelling,
    tileI,
    tileJ,
    2,
    2);
  
  feature.dwellingType = DwellingType.Grove;
  worldManager.addFeature(feature);
  return feature;
};

FeatureFactory.createCaveDungeon = function(tileI, tileJ)
{
  var feature = new Feature(
    worldManager.getUnusedFeatureId(),
    FeatureType.Dungeon,
    tileI,
    tileJ,
    2,
    2);
  
  feature.dungeonType = DungeonType.Cave;
  worldManager.addFeature(feature);
  return feature;
};

FeatureFactory.createTavernGathering = function(tileI, tileJ)
{
  var feature = new Feature(
    worldManager.getUnusedFeatureId(),
    FeatureType.Gathering,
    tileI,
    tileJ,
    2,
    1);
  
  feature.gatheringType = GatheringType.Tavern;
  worldManager.addFeature(feature);
  return feature;
};