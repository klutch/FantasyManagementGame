var TerrainGenerator = function(seed)
{
  this.noise = new Noise(seed, 32, 32, 64, 64);
  this.plainsRects = [
    new PIXI.Rectangle(0, 0.3, 0.4, 0.3),
    new PIXI.Rectangle(0.3, 0, 0.1, 0.3)
  ];
  this.forestRects = [
    new PIXI.Rectangle(0.4, 0, 0.1, 0.6),
    new PIXI.Rectangle(0.5, 0.4, 0.5, 0.2),
    new PIXI.Rectangle(0.8, 0.6, 0.2, 0.1)
  ];
  this.swampRects = [
    new PIXI.Rectangle(0.5, 0, 0.2, 0.4),
    new PIXI.Rectangle(0.7, 0.2, 0.1, 0.2)
  ];
  this.mountainsRects = [
    new PIXI.Rectangle(0, 0.8, 0.3, 0.1),
    new PIXI.Rectangle(0, 0.9, 1, 0.1),
    new PIXI.Rectangle(0.8, 0.7, 0.2, 0.2)
  ];
  this.hillsRects = [
    new PIXI.Rectangle(0, 0.6, 0.4, 0.2),
    new PIXI.Rectangle(0.4, 0.6, 0.4, 0.1)
  ];
  this.snowRects = [
    new PIXI.Rectangle(0.3, 0.8, 0.5, 0.1),
    new PIXI.Rectangle(0.4, 0.7, 0.4, 0.1)
  ];
  this.desertRects = [
    new PIXI.Rectangle(0, 0, 0.3, 0.3)
  ];
  this.waterRects = [
    new PIXI.Rectangle(0.7, 0, 0.3, 0.2),
    new PIXI.Rectangle(0.8, 0.2, 0.2, 0.2)
  ];
};

TerrainGenerator.prototype.getTile = function(x, y)
{
  var moisture;
  var elevation;
  var tileType;
  
  // Calculate moisture
  moisture = this.noise.fbm(x, y, this.noise.perlin, {iterations: 8, frequency: 1.2, gain: 0.8, lacunarity: 1.2});
  moisture = Math.max(Math.min(moisture, 1), 0);
  
  // Calculate elevation
  elevation = this.noise.fbm(x, y, this.noise.cell, {iterations: 4, frequency: 1.4, gain: 1, lacunarity: 1.2});
  elevation = Math.max(Math.min(elevation, 1), 0);
  
  // Get tile type
  tileType = this.getTileType(moisture, elevation);
  
  return new Tile(tileType, true, 10, elevation);
};

TerrainGenerator.prototype.getTileType = function(moisture, elevation)
{
  for (var i = 0; i < this.plainsRects.length; i++)
  {
    if (this.plainsRects[i].contains(moisture, elevation))
    {
      return TileType.Plains;
    }
  }
  for (var i = 0; i < this.forestRects.length; i++)
  {
    if (this.forestRects[i].contains(moisture, elevation))
    {
      return TileType.Forest;
    }
  }
  for (var i = 0; i < this.swampRects.length; i++)
  {
    if (this.swampRects[i].contains(moisture, elevation))
    {
      return TileType.Swamp;
    }
  }
  for (var i = 0; i < this.mountainsRects.length; i++)
  {
    if (this.mountainsRects[i].contains(moisture, elevation))
    {
      return TileType.Mountains;
    }
  }
  for (var i = 0; i < this.hillsRects.length; i++)
  {
    if (this.hillsRects[i].contains(moisture, elevation))
    {
      return TileType.Hills;
    }
  }
  for (var i = 0; i < this.snowRects.length; i++)
  {
    if (this.snowRects[i].contains(moisture, elevation))
    {
      return TileType.Snow;
    }
  }
  for (var i = 0; i < this.desertRects.length; i++)
  {
    if (this.desertRects[i].contains(moisture, elevation))
    {
      return TileType.Desert;
    }
  }
  for (var i = 0; i < this.waterRects.length; i++)
  {
    if (this.waterRects[i].contains(moisture, elevation))
    {
      return TileType.Water;
    }
  }
};