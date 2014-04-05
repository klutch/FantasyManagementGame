// Feature generator constructor
var FeatureGenerator = function(seed)
{
  this.seed = seed;
  this.dwellingGridSize = 512;
  this.dwellingGrid = [];
  this.dungeonGridSize = 512;
  this.dungeonGrid = [];
  this.gatheringGridSize = 512;
  this.gatheringGrid = [];
  this.rng = new Math.seedrandom(seed);
  this.numCoinFlips = 64;
  this.coinFlips = [];
  
  // Create coin flips
  for (var i = 0; i < this.numCoinFlips; i++)
  {
    this.coinFlips[i] = this.rng() > 0.5;
  }
  
  // Create dwelling grid
  for (var i = 0; i < this.dwellingGridSize; i++)
  {
    this.dwellingGrid[i] = [];
    for (var j = 0; j < this.dwellingGridSize; j++)
    {
      this.dwellingGrid[i][j] = (this.rng() > 0.995 ? 1 : 0);
    }
  }
  
  // Create dungeon grid
  for (var i = 0; i < this.dungeonGridSize; i++)
  {
    this.dungeonGrid[i] = [];
    for (var j = 0; j < this.dungeonGridSize; j++)
    {
      this.dungeonGrid[i][j] = (this.rng() > 0.9995 ? 1 : 0);
    }
  }
  
  // Create gathering grid
  for (var i = 0; i < this.gatheringGridSize; i++)
  {
    this.gatheringGrid[i] = [];
    for (var j = 0; j < this.gatheringGridSize; j++)
    {
      this.gatheringGrid[i][j] = (this.rng() > 0.99 ? 1 : 0);
    }
  }
};

// Generate player castle
FeatureGenerator.prototype.generatePlayerCastle = function()
{
  var found = false;
  var castleI;
  var castleJ;
  
  for (var i = -1000; i < 1000; i++)
  {
    for (var j = -1000; j < 1000; j++)
    {
      if (this.checkTerrainType(TileType.Grassland, i, j, 4, 4))
      {
        found = true;
        castleI = i;
        castleJ = j;
        break;
      }
    }
    if (found) { break; }
  }
  
  // Debug...
  if (!found)
  {
    console.error("Couldn't find a suitable spot for the player's castle.");
    return;
  }
  
  // Create feature
  feature = FeatureFactory.createPlayerCastle(castleI, castleJ);
  worldManager.world.playerCastleI = castleI;
  worldManager.world.playerCastleJ = castleJ;
  worldManager.world.playerCastleFeatureId = feature.id;
};

// Try to generate a feature at a given tile
FeatureGenerator.prototype.tryGenerateAt = function(tileI, tileJ)
{
  var tile = worldManager.getTile(tileI, tileJ);
  
  // Try dwellings
  if (this.getDwellingValue(tileI, tileJ) == 1)
  {
    if (tile.type == TileType.Grassland)
    {
      if (this.checkTerrainType(tile.type, tileI, tileJ, 2, 2))
      {
        if (worldManager.terrainGenerator.getRoadNoise(tileI, tileJ) > 0.5)   // try to build close to roads
        {
          if (this.coinFlips[(tileI * 17 + tileJ * 113) & (this.numCoinFlips - 1)])
          {
            // Create town
            FeatureFactory.createTownDwelling(tileI, tileJ);
          }
        }
      }
    }
    if (tile.type == TileType.Forest)
    {
      if (this.checkTerrainType(tile.type, tileI, tileJ, 2, 2))
      {
        // Create grove
        FeatureFactory.createGroveDwelling(tileI, tileJ);
      }
    }
  }
  // Try dungeons
  else if (this.getDungeonValue(tileI, tileJ) == 1)
  {
    if (tile.type == TileType.Grassland || tile.type == TileType.Forest)
    {
      if (this.checkTerrainType(tile.type, tileI, tileJ, 2, 2))
      {
        // Create cave dungeon
        FeatureFactory.createCaveDungeon(tileI, tilej);
      }
    }
  }
  // Try gatherings
  else if (this.getGatheringValue(tileI, tileJ) == 1)
  {
    if (tile.type == TileType.Grassland)
    {
      if (this.checkTerrainType(tile.type, tileI, tileJ, 2, 1))
      {
        if (worldManager.terrainGenerator.getRoadNoise(tileI, tileJ) > 0.5)
        {
          if (this.coinFlips[(tileI * 17 + tileJ * 113) & (this.numCoinFlips - 1)])
          {
            // Create tavern
            FeatureFactory.createTavernGathering(tileI, tileJ);
          }
        }
      }
    }
  }
}

// Get value from dwelling grid
FeatureGenerator.prototype.getDwellingValue = function(x, y)
{
  return this.dwellingGrid[x & (this.dwellingGridSize - 1)][y & (this.dwellingGridSize - 1)];
};

// Get value from dungeon grid
FeatureGenerator.prototype.getDungeonValue = function(x, y)
{
  return this.dungeonGrid[x & (this.dungeonGridSize - 1)][y & (this.dungeonGridSize - 1)];
};

// Get value from gathering grid
FeatureGenerator.prototype.getGatheringValue = function(x, y)
{
  return this.gatheringGrid[x & (this.gatheringGridSize - 1)][y & (this.gatheringGridSize - 1)];
};

// Check terrain type given a location and a grid size
FeatureGenerator.prototype.checkTerrainType = function(tileType, tileI, tileJ, width, height)
{
  for (var i = tileI, limitI = tileI + width; i < limitI; i++)
  {
    for (var j = tileJ, limitJ = tileJ + height; j < limitJ; j++)
    {
      var tile = worldManager.doesTileExist(i, j) ? worldManager.getTile(i, j) : worldManager.generateTile(i, j);
      
      if (tile.type != tileType)
      {
        return false;
      }
      if (tile.featureId != null)
      {
        return false;
      }
    }
  }
  return true;
};