// Feature generator constructor
var FeatureGenerator = function(world, seed)
{
  this.world = world;
  this.seed = seed;
  this.dwellingGridSize = 512;
  this.dwellingGrid = [];
  this.dungeonGridSize = 512;
  this.dungeonGrid = [];
  this.gatheringGridSize = 512;
  this.gatheringGrid = [];
  this.rng = seed == null ? new Math.seedrandom() : new Math.seedrandom(seed);
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
  
  for (var i = -1000; i < 1000; i++)
  {
    for (var j = -1000; j < 1000; j++)
    {
      if (this.checkTerrainType(TileType.Grassland, i, j, 4, 4))
      {
        found = true;
        this.world.playerCastleI = i;
        this.world.playerCastleJ = j;
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
  feature = this.world.createFeature(FeatureType.Castle, this.world.playerCastleI, this.world.playerCastleJ, 4, 4);
  feature.castleType = CastleType.Player;
};

// Try to generate a feature at a given tile
FeatureGenerator.prototype.tryGenerateAt = function(tileI, tileJ)
{
  var tile = this.world.getTile(tileI, tileJ);
  
  // Try dwellings
  if (this.getDwellingValue(tileI, tileJ) == 1)
  {
    if (tile.type == TileType.Grassland)
    {
      if (this.checkTerrainType(tile.type, tileI, tileJ, 2, 2))
      {
        if (this.world.terrainGenerator.getRoadNoise(tileI, tileJ) > 0.5)
        {
          if (this.coinFlips[(tileI * 17 + tileJ * 113) & (this.numCoinFlips - 1)])
          {
            // Create town
            var feature = this.world.createFeature(FeatureType.Dwelling, tileI, tileJ, 2, 2);

            feature.dwellingType = DwellingType.Town;
          }
        }
      }
    }
    if (tile.type == TileType.Forest)
    {
      if (this.checkTerrainType(tile.type, tileI, tileJ, 2, 2))
      {
        // Create grove
        var feature = this.world.createFeature(FeatureType.Dwelling, tileI, tileJ, 2, 2);
        
        feature.dwellingType = DwellingType.Grove;
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
        var feature = this.world.createFeature(FeatureType.Dungeon, tileI, tileJ, 2, 2);
        
        feature.dungeonType = DungeonType.Cave;
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
        if (this.world.terrainGenerator.getRoadNoise(tileI, tileJ) > 0.5)
        {
          if (this.coinFlips[(tileI * 17 + tileJ * 113) & (this.numCoinFlips - 1)])
          {
            // Create tavern
            var feature = this.world.createFeature(FeatureType.Gathering, tileI, tileJ, 2, 1);

            feature.gatheringType = GatheringType.Tavern;
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
      var tile = this.world.doesTileExist(i, j) ? this.world.getTile(i, j) : this.world.generateTile(i, j);
      
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