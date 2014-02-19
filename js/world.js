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
var Tile = function(type, walkable, movementCost)
{
  this.type = type;
  this.walkable = walkable;
  this.movementCost = movementCost;
};

// World class
var World = function(seed)
{
  this.seed = seed;
  this.tiles = [];
  this.chunks = [];
  this.terrainGenerator = new TerrainGenerator(seed);
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
      
      if (this.tiles[realI] == null)
      {
        this.tiles[realI] = [];
      }
      
      this.tiles[realI][realJ] = this.generateTile(realI, realJ);
    }
  }
  
  return true;
};

World.prototype.generateTile = function(i, j)
{
  // Temporary check
  if (this.tiles[i][j] != null)
  {
    alert('WARNING: generating a tile, when one already exists! ('+i + ", " +j+")");
  }
  
  return this.terrainGenerator.getTile(i, j);
};