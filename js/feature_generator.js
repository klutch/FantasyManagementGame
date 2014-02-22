// Feature generator constructor
var FeatureGenerator = function(world, seed)
{
  this.world = world;
  this.seed = seed;
  this.dwellingGridSize = 512;
  this.dwellingGrid = [];
  this.rng = seed == null ? new Math.seedrandom() : new Math.seedrandom(seed);
  
  // Create dwelling grid
  for (var i = 0; i < this.dwellingGridSize; i++)
  {
    this.dwellingGrid[i] = [];
    
    for (var j = 0; j < this.dwellingGridSize; j++)
    {
      this.dwellingGrid[i][j] = (this.rng() > 0.998 ? 1 : 0);
    }
  }
};

// Generate player castle
FeatureGenerator.prototype.generatePlayerCastle = function()
{
  var found = false;
  var feature;
  
  while (!found)
  {
    var randRadius = getRandomInt(1800, 2200);
    var randAngle = Math.random() * Math.PI * 2;
    var randX = Math.floor(Math.cos(randAngle) * randRadius);
    var randY = Math.floor(Math.sin(randAngle) * randRadius);
    var giveUp = false;
    
    for (var i = randX; i < randX + 8; i++)
    {
      for (var j = randY; j < randY + 8; j++)
      {
        var tile = this.world.getTile(i, j);
        
        if (tile.type != TileType.Plains)
        {
          giveUp = true;
          break;
        }
      }
      if (giveUp)
      {
        break;
      }
    }
    
    if (!giveUp)
    {
      found = true;
      this.world.playerCastleX = randX;
      this.world.playerCastleY = randY;
    }
  }
  
  // Create feature
  feature = this.world.createFeature(FeatureType.PlayerCastle, this.world.playerCastleX, this.world.playerCastleY, 8, 8);
  
  // Hook feature up to tiles
  /*for (var i = 0; i < 8; i++)
  {
    for (var j = 0; j < 8; j++)
    {
      var tile = this.world.getTile(this.world.playerCastleX + i, this.world.playerCastleY + j);
      
      tile.featureId = feature.id;
      tile.featureTextureI = i;
      tile.featureTextureJ = j;
    }
  }*/
};

// Try to generate a feature at a given tile
FeatureGenerator.prototype.tryGenerateAt = function(tileI, tileJ)
{
  var tile = this.world.getTile(tileI, tileJ);
  
  // Try dwellings
  if (this.getDwellingValue(tileI, tileJ) == 1)
  {
    if (tile.type == TileType.Plains)
    {
      if (this.checkTerrainType(tile.type, tileI, tileJ, 2, 2))
      {
        // Create town
        var feature = this.world.createFeature(FeatureType.Dwelling, tileI, tileJ, 2, 2);
        
        feature.dwellingType = DwellingType.Town;
      }
    }
  }
}

// Get value from dwelling grid
FeatureGenerator.prototype.getDwellingValue = function(x, y)
{
  return this.dwellingGrid[x & (this.dwellingGridSize - 1)][y & (this.dwellingGridSize - 1)];
};

// Check terrain type given a location and a grid size
FeatureGenerator.prototype.checkTerrainType = function(tileType, tileI, tileJ, width, height)
{
  for (var i = 0; i < width; i++)
  {
    for (var j = 0; j < height; j++)
    {
      var tile = this.world.getTile(tileI + i, tileI + j);
      
      if (tile.type != tileType)
      {
        return false;
      }
    }
  }
  return true;
};