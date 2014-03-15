var WorldManager = function(seed)
{
  seed = seed || Math.random() * 11377;
  this.world = new World(seed);
  this.terrainGenerator = new TerrainGenerator(seed);
  this.featureGenerator = new FeatureGenerator(seed);
};

WorldManager.prototype.getGridI = function(x) { return Math.floor(x / TILE_SIZE); };
WorldManager.prototype.getGridJ = function(y) { return Math.floor(y / TILE_SIZE); };

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

// Create feature
WorldManager.prototype.createFeature = function(featureType, x, y, width, height)
{
  var id = this.world.features.length;
  var feature = new Feature(id, featureType, x, y, width, height);
  
  this.world.features[id] = feature;
  
  for (var i = 0; i < width; i++)
  {
    for (var j = 0; j < height; j++)
    {
      var tile = this.getTile(x + i, y + j);
      
      tile.featureId = id;
      tile.featureTextureI = i;
      tile.featureTextureJ = j;
    }
  }
  
  return feature;
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