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
  this.dirtTextures = [];
  this.grassTextures = [];
  
  // Load textures
  for (var i = 0; i < 4; i++)
  {
    this.dirtTextures[i] = PIXI.Texture.fromImage("img/dirt_" + i + ".png");
    this.grassTextures[i] = PIXI.Texture.fromImage("img/grass_" + i + ".png");
  }
};

World.prototype.getTile = function(i, j)
{
  if (this.tiles[i] == null)
  {
    this.tiles[i] = [];
  }
  if (this.tiles[i][j] == null)
  {
    this.tiles[i][j] = this.generateTile(i, j);
  }
  return this.tiles[i][j];
};

World.prototype.generateTile = function(i, j)
{
  var isDirt = Math.random() >= 0.5;
  var index = Math.floor(Math.random() * 4);
  var texture = isDirt ? this.dirtTextures[index] : this.grassTextures[index];
  
  return new Tile(texture, i, j);
};