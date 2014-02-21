// Tile type enum
var TileType = Object.freeze({
  Desert: 0,
  Plains: 1,
  Hills: 2,
  Mountains: 3,
  Snow: 4,
  Forest: 5,
  Swamp: 6,
  Water: 7,
  PlayerCastle: 8,
  TownDwelling: 9
});

// Tile class
var Tile = function(type, walkable, movementCost, elevation)
{
  this.type = type;
  this.walkable = walkable;
  this.movementCost = movementCost;
  this.elevation = elevation;
};

// World class
var World = function(seed)
{
  this.seed = seed;
  this.tiles = [];
  this.chunks = [];
  this.terrainGenerator = new TerrainGenerator(seed);
  this.playerCastleX = 0;
  this.playerCastleY = 0;
  
  this.generatePlayerCastle();
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

World.prototype.generatePlayerCastle = function()
{
  var found = false;
  
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
        var tile = this.getTile(i, j);
        
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
      this.playerCastleX = randX;
      this.playerCastleY = randY;
    }
  }
  
  for (var i = 0; i < 8; i++)
  {
    for (var j = 0; j < 8; j++)
    {
      var tile = this.getTile(this.playerCastleX + i, this.playerCastleY + j);
      
      tile.type = TileType.PlayerCastle;
      tile.castleTextureI = i;
      tile.castleTextureJ = j;
    }
  }
};