// Tile type enum
var TileType = Object.freeze({
  Desert: 0,
  Plains: 1,
  Hills: 2,
  Mountains: 3,
  Snow: 4,
  Forest: 5,
  Swamp: 6,
  Water: 7
});

// Tile class
var Tile = function(type, walkable, movementCost, elevation)
{
  this.type = type;
  this.walkable = walkable;
  this.movementCost = movementCost;
  this.elevation = elevation;
};

// Feature type enum
var FeatureType = Object.freeze({
  PlayerCastle: 0,
  Dwelling: 1
});

// Dwelling type enum
var DwellingType = Object.freeze({
  Town: 0
});

// Feature class
var Feature = function(id, type, tileI, tileJ, width, height)
{
  this.id = id;
  this.type = type;
  this.tileI = tileI;
  this.tileJ = tileJ;
  this.width = width;
  this.height = height;
};

// World class
var World = function(seed)
{
  this.seed = seed;
  this.tiles = [];
  this.chunks = [];
  this.features = [];
  this.terrainGenerator = new TerrainGenerator(this, seed);
  this.featureGenerator = new FeatureGenerator(this, seed);
  this.playerCastleX = 0;
  this.playerCastleY = 0;
  
  this.featureGenerator.generatePlayerCastle();
};

World.prototype.getChunkI = function(i)
{
  return Math.floor(i / chunkSize);
};

World.prototype.getChunkJ = function(j)
{
  return Math.floor(j / chunkSize);
};

World.prototype.getGridI = function(x)
{
  return Math.floor(x / tileSize);
};

World.prototype.getGridJ = function(y)
{
  return Math.floor(y / tileSize);
};

World.prototype.getTile = function(i, j)
{
  var chunkI = this.getChunkI(i);
  var chunkJ = this.getChunkJ(j);
  
  // Check for chunk existance
  if (this.chunks[chunkI] == null)
  {
    this.chunks[chunkI] = [];
  }
  if (this.chunks[chunkI][chunkJ] == null)
  {
    this.chunks[chunkI][chunkJ] = this.generateChunk(chunkI, chunkJ);
  }
  
  return this.tiles[i][j];
};

World.prototype.generateChunk = function(chunkI, chunkJ)
{
  for (var i = 0; i < chunkSize; i++)
  {
    for (var j = 0; j < chunkSize; j++)
    {
      var realI = chunkSize * chunkI + i;
      var realJ = chunkSize * chunkJ + j;
      var feature;
      
      if (this.tiles[realI] == null)
      {
        this.tiles[realI] = [];
      }
      
      // Temporary check
      if (this.tiles[realI][realJ] != null)
      {
        alert('WARNING: generating a tile, when one already exists! ('+ realI + ", " + realJ +")");
      }
      
      // Generate tile
      this.tiles[realI][realJ] = this.terrainGenerator.getTile(realI, realJ);
    }
  }
  
  return true;
};

World.prototype.createFeature = function(featureType, x, y, width, height)
{
  var id = this.features.length;
  var feature = new Feature(id, featureType, x, y, width, height);
  
  this.features[id] = feature;
  return feature;
};