// Tile class
var Tile = function(texture, i, j)
{
  this.texture = texture;
  this.i = i;
  this.j = j;
};

// World class
var World = function()
{
  this.tiles = [];
  this.chunks = [];
  this.dirtTextures = [];
  this.grassTextures = [];
  
  // Load textures
  for (var i = 0; i < 4; i++)
  {
    this.dirtTextures[i] = PIXI.Texture.fromImage("img/dirt_" + i + ".png");
    this.grassTextures[i] = PIXI.Texture.fromImage("img/grass_" + i + ".png");
  }
};

World.prototype.getChunkI = function(i)
{
  return Math.floor(i / chunkSize);
};

World.prototype.getChunkJ = function(j)
{
  return Math.floor(j / chunkSize);
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
  var isDirt = Math.random() >= 0.5;
  var index = Math.floor(Math.random() * 4);
  var texture = isDirt ? this.dirtTextures[index] : this.grassTextures[index];
  
  // Temporary check
  if (this.tiles[i][j] != null)
  {
    alert('WARNING: generating a tile, when one already exists! ('+i + ", " +j+")");
  }
  
  return new Tile(texture, i, j);
};