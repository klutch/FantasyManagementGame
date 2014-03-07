var TerrainGenerator = function(world, seed)
{
  this.world = world;
  this.noise = new Noise(seed, {perlinGridWidth: 32, perlinGridHeight: 32, cellGridWidth: 64, cellGridHeight: 64});
  
  // Biome bounds
  this.biomeBounds = {};
  this.biomeBounds[BiomeType.Tundra] = [
    new PIXI.Rectangle(0, 0, 0.3, 0.3)
  ];
  this.biomeBounds[BiomeType.Taiga] = [
    new PIXI.Rectangle(0, 0.3, 0.3, 0.7)
  ];
  this.biomeBounds[BiomeType.Temperate] = [
    new PIXI.Rectangle(0.3, 0, 0.2, 0.2),
    new PIXI.Rectangle(0.3, 0.2, 0.7, 0.2),
    new PIXI.Rectangle(0.3, 0.4, 0.4, 0.3)
  ];
  this.biomeBounds[BiomeType.Tropical] = [
    new PIXI.Rectangle(0.7, 0.4, 0.3, 0.3),
    new PIXI.Rectangle(0.3, 0.7, 0.7, 0.3)
  ];
  this.biomeBounds[BiomeType.Desert] = [
    new PIXI.Rectangle(0.5, 0, 0.5, 0.2)
  ];
  
  // Tile bounds
  this.tileBounds = {};
  this.tileBounds[BiomeType.Tundra] = {};
  this.tileBounds[BiomeType.Tundra][TileType.Plains] = [
    new PIXI.Rectangle(0, 0, 0.1, 0.2),
    new PIXI.Rectangle(0.1, 0, 0.1, 0.1),
    new PIXI.Rectangle(0.2, 0, 0.1, 0.2)
  ];
  this.tileBounds[BiomeType.Tundra][TileType.Snow] = [
    new PIXI.Rectangle(0, 0.2, 0.1, 0.1),
    new PIXI.Rectangle(0.1, 0.1, 0.1, 0.2),
    new PIXI.Rectangle(0.2, 0.2, 0.1, 0.1)
  ];
  this.tileBounds[BiomeType.Taiga] = {};
  this.tileBounds[BiomeType.Taiga][TileType.Snow] = [
    new PIXI.Rectangle(0, 0.3, 0.2, 0.3),
    new PIXI.Rectangle(0, 0.6, 0.1, 0.4)
  ];
  this.tileBounds[BiomeType.Taiga][TileType.Forest] = [
    new PIXI.Rectangle(0.2, 0.3, 0.1, 0.3),
    new PIXI.Rectangle(0.1, 0.6, 0.2, 0.4)
  ];
  this.tileBounds[BiomeType.Temperate] = {};
  this.tileBounds[BiomeType.Temperate][TileType.Grassland] = [
    new PIXI.Rectangle(0.3, 0, 0.2, 0.2),
    new PIXI.Rectangle(0.3, 0.2, 0.7, 0.2)
  ];
  this.tileBounds[BiomeType.Temperate][TileType.Forest] = [
    new PIXI.Rectangle(0.3, 0.4, 0.4, 0.3)
  ];
  this.tileBounds[BiomeType.Tropical] = {};
  this.tileBounds[BiomeType.Tropical][TileType.Forest] = [
    new PIXI.Rectangle(0.7, 0.4, 0.3, 0.4),
    new PIXI.Rectangle(0.3, 0.7, 0.4, 0.1)
  ];
  this.tileBounds[BiomeType.Tropical][TileType.Swamp] = [
    new PIXI.Rectangle(0.3, 0.8, 0.7, 0.2)
  ];
  this.tileBounds[BiomeType.Desert] = {};
  this.tileBounds[BiomeType.Desert][TileType.Sand] = [
    new PIXI.Rectangle(0.6, 0, 0.4, 0.1),
    new PIXI.Rectangle(0.9, 0.1, 0.1, 0.1)
  ];
  this.tileBounds[BiomeType.Desert][TileType.Arid] = [
    new PIXI.Rectangle(0.5, 0, 0.1, 0.1),
    new PIXI.Rectangle(0.5, 0.1, 0.4, 0.1)
  ];
  
  // Elevation ranges by biome
  this.elevationRanges = {};
  this.elevationRanges[BiomeType.Tundra] = [0.2, 1];
  this.elevationRanges[BiomeType.Taiga] = [0, 1];
  this.elevationRanges[BiomeType.Temperate] = [0.1, 0.9];
  this.elevationRanges[BiomeType.Tropical] = [0, 1];
  this.elevationRanges[BiomeType.Desert] = [0.2, 0.9];
};

TerrainGenerator.prototype.getElevation = function(x, y)
{
  var result = this.noise.fbm(x, y, this.noise.cell, {iterations: 4, frequency: 1.4, gain: 1, lacunarity: 1.2});
    
  return Math.max(Math.min(result, 1), 0);
};

TerrainGenerator.prototype.getRoadNoise = function(x, y)
{
  return this.noise.ridgedPerlin(x * 0.25, y * 0.25);
};

TerrainGenerator.prototype.isRoad = function(x, y)
{
  var local = this.getRoadNoise(x, y) > 0.98 ? 1 : 0;
  var neighbors = 0;
  
  if (local > 0)
  {
    for (var i = -1; i < 2; i++)
    {
      for (var j = -1; j < 2; j++)
      {
        if (i == 0 && j == 0)
        {
          continue;
        }
        else
        {
          neighbors += this.getRoadNoise(x + i, y + j) > 0.98 ? 1 : 0;
          
          if (neighbors > 7)
          {
            return false;
          }
        }
      }
    }
    
    return true;
  }
  
  return false;
};

TerrainGenerator.prototype.getTile = function(x, y)
{
  var moisture;
  var elevation;
  var tileType;
  var movementCost = 10;
  var walkable = true;
  var isRoad = this.isRoad(x, y);
  
  // Calculate moisture
  if (!isRoad)
  {
    moisture = this.noise.fbm(x, y, this.noise.perlin, {iterations: 8, frequency: 1.2, gain: 0.8, lacunarity: 1.2});
    moisture = Math.max(Math.min(moisture, 1), 0);
  }
  
  // Calculate elevation
  elevation = this.getElevation(x, y);
  
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