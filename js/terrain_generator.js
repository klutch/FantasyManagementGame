var TerrainGenerator = function(seed)
{
  this.noise = new Noise(seed, 32, 32, 32, 32);
  this.tundraRects = [
    new PIXI.Rectangle(0, 0, 0.3, 0.3),
    new PIXI.Rectangle(0, 0.3, 0.1, 0.1),
    new PIXI.Rectangle(0.3, 0, 0.2, 0.2)
  ];
  this.plainsRects = [
    new PIXI.Rectangle(0, 0.4, 0.1, 0.1),
    new PIXI.Rectangle(0.1, 0.3, 0.5, 0.3),
    new PIXI.Rectangle(0.3, 0.2, 0.3, 0.1),
    new PIXI.Rectangle(0.3, 0.6, 0.2, 0.2),
    new PIXI.Rectangle(0.5, 0.6, 0.1, 0.1)
  ];
  this.desertRects = [
    new PIXI.Rectangle(0, 0.5, 0.1, 0.1),
    new PIXI.Rectangle(0, 0.6, 0.3, 0.4),
    new PIXI.Rectangle(0.3, 0.8, 0.1, 0.2)
  ];
  this.snowRects = [
    new PIXI.Rectangle(0.5, 0, 0.1, 0.2),
    new PIXI.Rectangle(0.6, 0, 0.4, 0.3)
  ];
  this.forestRects = [
    new PIXI.Rectangle(0.6, 0.3, 0.4, 0.3),
    new PIXI.Rectangle(0.6, 0.6, 0.3, 0.1),
    new PIXI.Rectangle(0.6, 0.7, 0.1, 0.2),
    new PIXI.Rectangle(0.5, 0.7, 0.1, 0.3),
    new PIXI.Rectangle(0.4, 0.8, 0.1, 0.2)
  ];
  this.swampRects = [
    new PIXI.Rectangle(0.6, 0.9, 0.1, 0.1),
    new PIXI.Rectangle(0.7, 0.7, 0.3, 0.3),
    new PIXI.Rectangle(0.9, 0.6, 0.1, 0.1)
  ];
};

TerrainGenerator.prototype.getTile = function(x, y)
{
  var moisture;
  var temperature;
  var tileType;
  
  // Calculate moisture
  moisture = this.noise.fbm(x, y, 8, 1.2, 0.6, 1.2, this.noise.perlin);
  //moisture = this.noise.fbm((x + moisture) * 1.2, (y + moisture) * -1.2, 2, 1.4, 0.6, 1.8, this.noise.cell);
  moisture = Math.max(Math.min(moisture, 1), 0);
  
  // Calculate temperature
  temperature = this.noise.fbm(x, y, 2, 1.4, 0.8, 1.2, this.noise.cell);
  temperature = Math.max(Math.min(temperature, 1), 0);
  
  // Get tile type
  tileType = this.getTileType(moisture, temperature);
  
  return new Tile(tileType, true, 10);
};

TerrainGenerator.prototype.getTileType = function(moisture, temperature)
{
  for (var i = 0; i < this.tundraRects.length; i++)
  {
    if (this.tundraRects[i].contains(moisture, temperature))
    {
      return TileType.Tundra;
    }
  }
  for (var i = 0; i < this.plainsRects.length; i++)
  {
    if (this.plainsRects[i].contains(moisture, temperature))
    {
      return TileType.Plains;
    }
  }
  for (var i = 0; i < this.desertRects.length; i++)
  {
    if (this.desertRects[i].contains(moisture, temperature))
    {
      return TileType.Desert;
    }
  }
  for (var i = 0; i < this.snowRects.length; i++)
  {
    if (this.snowRects[i].contains(moisture, temperature))
    {
      return TileType.Snow;
    }
  }
  for (var i = 0; i < this.forestRects.length; i++)
  {
    if (this.forestRects[i].contains(moisture, temperature))
    {
      return TileType.Forest;
    }
  }
  for (var i = 0; i < this.swampRects.length; i++)
  {
    if (this.swampRects[i].contains(moisture, temperature))
    {
      return TileType.Swamp;
    }
  }
};