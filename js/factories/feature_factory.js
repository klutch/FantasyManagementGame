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

FeatureFactory.createTownDwelling = function(tileI, tileJ, options)
{
  var feature = new Feature(
    worldManager.getUnusedFeatureId(),
    FeatureType.Dwelling,
    tileI,
    tileJ,
    2,
    2);
  
  options = options || {};
  for (var key in options)
  {
    if (options.hasOwnProperty(key))
    {
      feature[key] = options[key];
    }
  }
  
  feature.dwellingType = DwellingType.Town;
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
  
  options = options || {};
  for (var key in options)
  {
    if (options.hasOwnProperty(key))
    {
      feature[key] = options[key];
    }
  }
  
  feature.dwellingType = DwellingType.Grove;
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
  
  options = options || {};
  for (var key in options)
  {
    if (options.hasOwnProperty(key))
    {
      feature[key] = options[key];
    }
  }
  
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
  
  options = options || {};
  for (var key in options)
  {
    if (options.hasOwnProperty(key))
    {
      feature[key] = options[key];
    }
  }
  
  feature.gatheringType = GatheringType.Tavern;
  worldManager.addFeature(feature);
  return feature;
};