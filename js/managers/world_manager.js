var WorldManager = function(seed)
{
  seed = seed || Math.random() * 11377;
  this.world = new World(seed);
  this.terrainGenerator = new TerrainGenerator(seed);
  this.featureGenerator = new FeatureGenerator(seed);
};

WorldManager.prototype.initialize = function()
{
  this.worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  
  this.featureGenerator.generatePlayerCastle();
  this.discoverRadius(this.world.playerCastleI + 2, this.world.playerCastleJ + 2, 32);
  this.worldMapScreen.worldMap.setCamera((this.world.playerCastleI + 2) * TILE_SIZE, (this.world.playerCastleJ + 2) * TILE_SIZE);
};

WorldManager.prototype.getGridI = function(x) { return Math.floor(x / TILE_SIZE); };
WorldManager.prototype.getGridJ = function(y) { return Math.floor(y / TILE_SIZE); };

// Get unused feature id
WorldManager.prototype.getUnusedFeatureId = function()
{
  return this.world.features.length;
};

// Does tile exist
WorldManager.prototype.doesTileExist = function(i, j)
{
  if (this.world.tiles[i] == null)
  {
    return false;
  }
  if (this.world.tiles[i][j] == null)
  {
    return false;
  }
  return true;
};

// Get a tile
WorldManager.prototype.getTile = function(i, j)
{
  return this.world.tiles[i][j];
};

// Get or create a tile
WorldManager.prototype.getOrCreateTile = function(i, j)
{
  return this.doesTileExist(i, j) ? this.getTile(i, j) : this.generateTile(i, j);
};

// Generate a tile
WorldManager.prototype.generateTile = function(i, j)
{
  if (this.world.tiles[i] == null)
  {
    this.world.tiles[i] = [];
  }
  this.world.tiles[i][j] = this.terrainGenerator.generateTile(i, j);
  this.featureGenerator.tryGenerateAt(i, j);
  
  return this.world.tiles[i][j];
};

// Get feature
WorldManager.prototype.getFeature = function(featureId)
{
  return this.world.features[featureId];
};

// Add feature
WorldManager.prototype.addFeature = function(feature)
{
  this.world.features[feature.id] = feature;
  
  for (var i = 0; i < feature.width; i++)
  {
    for (var j = 0; j < feature.height; j++)
    {
      var tile = this.getTile(feature.tileI + i, feature.tileJ + j);
      
      tile.featureId = feature.id;
      tile.featureTextureI = i;
      tile.featureTextureJ = j;
    }
  }
};

// Discover tiles in a radius around a given tile
WorldManager.prototype.discoverRadius = function(tileI, tileJ, radius)
{
  var radiusSq = radius * radius;
  var worldMap = screenManager.screens[ScreenType.WorldMap].worldMap;
  
  for (var i = tileI - radius, limitI = tileI + radius + 1; i < limitI; i++)
  {
    for (var j = tileJ - radius, limitJ = tileJ + radius + 1; j < limitJ; j++)
    {
      var relI = i - tileI;
      var relJ = j - tileJ;
      var distanceSq = relI * relI + relJ * relJ;
      var tile;
      
      if (distanceSq > radiusSq)
      {
        continue;
      }
      
      tile = this.doesTileExist(i, j) ? this.getTile(i, j) : this.generateTile(i, j);
      tile.discovered = true;
      worldMap.addTileToDraw(i, j);
    }
  }
};