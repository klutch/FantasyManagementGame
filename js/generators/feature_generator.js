// Feature generator constructor
var FeatureGenerator = function(worldSystem, seed)
{
  this.worldSystem = worldSystem;
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
  this.worldSystem.world.playerCastleI = castleI;
  this.worldSystem.world.playerCastleJ = castleJ;
  this.worldSystem.world.playerCastleFeatureId = feature.id;
};

// Get a coin flip based on 
FeatureGenerator.prototype.getCoinFlip = function(tileI, tileJ, iMultiplier, jMultiplier)
{
  iMultiplier = iMultiplier == undefined ? 1 : iMultiplier;
  jMultiplier = jMultiplier == undefined ? 1 : jMultiplier;
  
  return this.coinFlips[(tileI * iMultiplier + tileJ * jMultiplier) & (this.numCoinFlips - 1)];
};

// Try to generate a feature at a given tile
FeatureGenerator.prototype.tryGenerateAt = function(tileI, tileJ)
{
  var tile = this.worldSystem.getTile(tileI, tileJ);
  
  // Try dwellings
  if (this.getDwellingValue(tileI, tileJ) == 1)
  {
    if (tile.type == TileType.Grassland)
    {
      if (this.checkTerrainType(tile.type, tileI, tileJ, 2, 2))
      {
        if (this.worldSystem.terrainGenerator.getRoadNoise(tileI, tileJ) > 0.5)   // try to build close to roads
        {
          if (this.getCoinFlip(tileI, tileJ, 7, 133))
          {
            // Create town
            var options = {};
            
            // TODO: These are mostly temporary values
            options.isLoyaltyFree = this.getCoinFlip(tileI, tileJ, 13, 29);
            options.requiresGift = options.isLoyaltyFree ? false : this.getCoinFlip(tileI, tileJ, 19, 23);
            options.isLoyal = false;
            options.numWorkersAvailable = 2;
            options.workerCost = 50;
            
            if (options.requiresGift)
            {
              options.giftResourceType = ResourceType.Gold;
              options.giftAmountRequired = 10;
              options.giftAmountGiven = 0;
            }
            
            FeatureFactory.createTownDwelling(tileI, tileJ, options);
          }
        }
      }
    }
    if (tile.type == TileType.Forest)
    {
      if (this.checkTerrainType(tile.type, tileI, tileJ, 2, 2))
      {
        // Create grove
        var options = {};
            
        // TODO: These are mostly temporary values
        options.isLoyaltyFree = this.getCoinFlip(tileI, tileJ, 17, 29);
        options.requiresGift = options.isLoyaltyFree ? false : this.getCoinFlip(tileI, tileJ, 17, 23);
        options.isLoyal = false;
        options.numWorkersAvailable = 2;
        options.workerCost = 50;

        if (options.requiresGift)
        {
          options.giftResourceType = ResourceType.Gold;
          options.giftAmountRequired = 10;
          options.giftAmountGiven = 0;
        }
        
        FeatureFactory.createGroveDwelling(tileI, tileJ, options);
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
        FeatureFactory.createCaveDungeon(tileI, tileJ);
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
        if (this.worldSystem.terrainGenerator.getRoadNoise(tileI, tileJ) > 0.5)
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
  var worldSystem = game.systemManager.getSystem(SystemType.World);
  
  for (var i = tileI, limitI = tileI + width; i < limitI; i++)
  {
    for (var j = tileJ, limitJ = tileJ + height; j < limitJ; j++)
    {
      var tile = this.worldSystem.doesTileExist(i, j) ? this.worldSystem.getTile(i, j) : this.worldSystem.generateTile(i, j);
      
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