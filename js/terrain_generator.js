var TerrainGenerator = function(world, seed)
{
  this.world = world;
  this.noise = new Noise(seed, {perlinGridWidth: 32, perlinGridHeight: 32, cellGridWidth: 64, cellGridHeight: 64});
  this.plainsRects = [
    new PIXI.Rectangle(0, 0.3, 0.5, 0.3),
    new PIXI.Rectangle(0.3, 0, 0.2, 0.3)
  ];
  this.forestRects = [
    new PIXI.Rectangle(0.5, 0, 0.1, 0.6),
    new PIXI.Rectangle(0.6, 0.3, 0.4, 0.3),
    new PIXI.Rectangle(0.8, 0.6, 0.2, 0.1)
  ];
  this.swampRects = [
    new PIXI.Rectangle(0.6, 0.1, 0.1, 0.2),
    new PIXI.Rectangle(0.7, 0.2, 0.1, 0.1)
  ];
  this.mountainsRects = [
    new PIXI.Rectangle(0.2, 0.8, 0.1, 0.1),
    new PIXI.Rectangle(0, 0.9, 1, 0.1),
    new PIXI.Rectangle(0.8, 0.8, 0.2, 0.1)
  ];
  this.hillsRects = [
    new PIXI.Rectangle(0, 0.6, 0.4, 0.2),
    new PIXI.Rectangle(0.4, 0.6, 0.4, 0.1),
    new PIXI.Rectangle(0.7, 0.7, 0.3, 0.1),
    new PIXI.Rectangle(0, 0.8, 0.2, 0.1)
  ];
  this.snowRects = [
    new PIXI.Rectangle(0.3, 0.8, 0.5, 0.1),
    new PIXI.Rectangle(0.4, 0.7, 0.3, 0.1)
  ];
  this.desertRects = [
    new PIXI.Rectangle(0, 0, 0.3, 0.3)
  ];
  this.waterRects = [
    new PIXI.Rectangle(0.7, 0, 0.3, 0.2),
    new PIXI.Rectangle(0.8, 0.2, 0.2, 0.1),
    new PIXI.Rectangle(0.6, 0, 0.1, 0.1)
  ];
};

TerrainGenerator.prototype.getElevation = function(x, y)
{
  var result = this.noise.fbm(x, y, this.noise.cell, {iterations: 4, frequency: 1.4, gain: 1, lacunarity: 1.2});
    
  return Math.max(Math.min(result, 1), 0);
};

TerrainGenerator.prototype.getRoad = function(x, y)
{
  return false;
};

TerrainGenerator.prototype.getTile = function(x, y)
{
  var moisture;
  var elevation;
  var tileType;
  var movementCost = 10;
  var walkable = true;
  var isRoad = false;
  
  // Calculate moisture
  moisture = this.noise.fbm(x, y, this.noise.perlin, {iterations: 8, frequency: 1.2, gain: 0.8, lacunarity: 1.2});
  moisture = Math.max(Math.min(moisture, 1), 0);
  
  // Calculate elevation
  elevation = this.getElevation(x, y);
  
  // Calculate roads
  if (this.getRoad(x, y))
  {
    movementCost = 5;
    isRoad = true;
  }
  
  // Determine tile type
  tileType = isRoad ? TileType.Road : this.getTileType(moisture, elevation);
  
  return new Tile(tileType, walkable, movementCost, elevation);
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