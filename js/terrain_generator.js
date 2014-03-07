var TerrainGenerator = function(world, seed)
{
  this.world = world;
  this.noise = new Noise(seed, {perlinGridWidth: 32, perlinGridHeight: 32, cellGridWidth: 64, cellGridHeight: 64});
  
  // Biome bounds
  this.biomeBounds = {};
  this.biomeBounds[BiomeType.Tundra] = [
    new PIXI.Rectangle(0, 0, 0.4, 0.4)
  ];
  this.biomeBounds[BiomeType.Taiga] = [
    new PIXI.Rectangle(0, 0.4, 0.3, 0.6)
  ];
  this.biomeBounds[BiomeType.Temperate] = [
    new PIXI.Rectangle(0.4, 0, 0.2, 0.4),
    new PIXI.Rectangle(0.3, 0.4, 0.7, 0.2)
  ];
  this.biomeBounds[BiomeType.Tropical] = [
    new PIXI.Rectangle(0.3, 0.6, 0.7, 0.4)
  ];
  this.biomeBounds[BiomeType.Desert] = [
    new PIXI.Rectangle(0.6, 0, 0.4, 0.4)
  ];
  
  // Tile bounds by biome
  this.tileBoundsByBiome = {};
  this.tileBoundsByBiome[BiomeType.Tundra] = {};
  this.tileBoundsByBiome[BiomeType.Tundra][TileType.Plains] = [
    new PIXI.Rectangle(0.2, 0, 0.2, 0.4)
  ];
  this.tileBoundsByBiome[BiomeType.Tundra][TileType.Snow] = [
    new PIXI.Rectangle(0, 0, 0.2, 0.4)
  ];
  this.tileBoundsByBiome[BiomeType.Taiga] = {};
  this.tileBoundsByBiome[BiomeType.Taiga][TileType.Snow] = [
    new PIXI.Rectangle(0, 0.4, 0.2, 0.6)
  ];
  this.tileBoundsByBiome[BiomeType.Taiga][TileType.Forest] = [
    new PIXI.Rectangle(0.2, 0.4, 0.1, 0.6)
  ];
  this.tileBoundsByBiome[BiomeType.Temperate] = {};
  this.tileBoundsByBiome[BiomeType.Temperate][TileType.Grassland] = [
    new PIXI.Rectangle(0.4, 0, 0.2, 0.4),
    new PIXI.Rectangle(0.3, 0.4, 0.7, 0.2)
  ];
  this.tileBoundsByBiome[BiomeType.Tropical] = {};
  this.tileBoundsByBiome[BiomeType.Tropical][TileType.Forest] = [
    new PIXI.Rectangle(0.3, 0.6, 0.7, 0.2)
  ];
  this.tileBoundsByBiome[BiomeType.Tropical][TileType.Swamp] = [
    new PIXI.Rectangle(0.3, 0.8, 0.7, 0.2)
  ];
  this.tileBoundsByBiome[BiomeType.Desert] = {};
  this.tileBoundsByBiome[BiomeType.Desert][TileType.Sand] = [
    new PIXI.Rectangle(0.7, 0, 0.3, 0.2)
  ];
  this.tileBoundsByBiome[BiomeType.Desert][TileType.Arid] = [
    new PIXI.Rectangle(0.6, 0, 0.1, 0.2),
    new PIXI.Rectangle(0.6, 0.2, 0.4, 0.2)
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
  var result = this.noise.fbm(x * 0.1, y * 0.1, this.noise.ridgedPerlin, {iterations: 4, frequency: 2, gain: 0.8, lacunarity: 2});
  
  return Math.max(Math.min(result * result, 1), 0);
};

TerrainGenerator.prototype.getPrecipitation = function(x, y)
{
  var result = this.noise.fbm(x * 0.5, y * 0.5, this.noise.ridgedPerlin, {iterations: 4, frequency: 0.7, gain: 0.8, lacunarity: 1.8});
    
  return Math.max(Math.min(result, 1), 0)
};

TerrainGenerator.prototype.getTemperature = function(x, y)
{
  return this.noise.ridgedPerlin(x * 0.5, y * 0.5);
};

TerrainGenerator.prototype.getPrecipitationModifier = function(elevation)
{
  var a = elevation * elevation;
  var b = a * a;
  var c = b * b;
  var d = c * c;
  
  return 1 - d;
};

TerrainGenerator.prototype.getTemperatureModifier = function(elevation)
{
  var a = elevation * elevation;
  var b = a * a;
  var c = b * b;
  
  return 1 - c;
};

TerrainGenerator.prototype.isRiver = function(x, y)
{
  return this.noise.ridgedPerlin(x * 0.5, y * 0.5) > 0.9;
};

TerrainGenerator.prototype.roadMethod = function(x, y)
{
  return this.noise.ridgedPerlin((x + 113) * 0.4, (y - 107) * 0.4) > 0.96;
};

TerrainGenerator.prototype.isRoad = function(x, y)
{
  var accumulator = 0;
  
  if (this.roadMethod(x, y))
  {
    accumulator = 1;
    
    for (var i = x - 1, limitX = x + 2; i < limitX; i++)
    {
      for (var j = y - 1, limitY = y + 2; j < limitY; j++)
      {
        if (i == x && j == y)
        {
          continue;
        }
        
        if (this.roadMethod(i, j))
        {
          accumulator += 1;
        }
        
        if (accumulator > 8)
        {
          return false;
        }
      }
    }
  }
  
  return accumulator > 1;
};

TerrainGenerator.prototype.getTile = function(x, y)
{
  var baseElevation;
  var basePrecipitation;
  var baseTemperature;
  var finalElevation;
  var finalPrecipitation;
  var finalTemperature;
  var elevationRange;
  var biomeType;
  var tileType;
  var movementCost = 10;
  var walkable = true;
  
  // Get base elevation
  baseElevation = this.getElevation(x, y);
  
  // Get base precipitation
  basePrecipitation = this.getPrecipitation(x, y);
  
  // Calculate final precipitation
  finalPrecipitation = basePrecipitation * this.getPrecipitationModifier(baseElevation);
  
  // Get base temperature
  baseTemperature = this.getTemperature(x, y);
  
  // Calculate final temperature
  finalTemperature = baseTemperature * this.getTemperatureModifier(baseElevation);
  
  // Get biome type
  biomeType = this.getBiomeType(finalTemperature, finalPrecipitation);
  
  // Calculate final elevation
  elevationRange = this.elevationRanges[biomeType];
  finalElevation = MathHelper.lerp(elevationRange[0], elevationRange[1], baseElevation);
  
  // Determine tile type
  if (this.isRoad(x, y))
  {
    tileType = TileType.Road;
  }
  else
  {
    if (finalElevation > 0.9)
    {
      // Mountains
      tileType = TileType.Mountain;
    }
    else if (finalElevation < 0.05)
    {
      // Water
      tileType = TileType.Water;
    }
    else
    {
      if (biomeType != BiomeType.Desert && this.isRiver(x, y))
      {
        tileType = TileType.Water;
      }
      else
      {
        tileType = this.getTileType(biomeType, finalTemperature, finalPrecipitation);
      }
    }
  }
  
  return new Tile(tileType, biomeType, walkable, movementCost, finalElevation);
};

TerrainGenerator.prototype.getBiomeType = function(temperature, precipitation)
{
  for (var key in this.biomeBounds)
  {
    if (this.biomeBounds.hasOwnProperty(key))
    {
      var bounds = this.biomeBounds[key];
      
      for (var i = 0; i < bounds.length; i++)
      {
        if (bounds[i].contains(temperature, precipitation))
        {
          return key;
        }
      }
    }
  }
  
  alert("Couldn't find a biome type... this should never happen!");
  console.error("Couldn't find a biome type");
};

TerrainGenerator.prototype.getTileType = function(biomeType, temperature, precipitation)
{
  var tileBounds = this.tileBoundsByBiome[biomeType];
  
  for (var key in tileBounds)
  {
    if (tileBounds.hasOwnProperty(key))
    {
      var bounds = tileBounds[key];
      
      for (var i = 0; i < bounds.length; i++)
      {
        if (bounds[i].contains(temperature, precipitation))
        {
          return key;
        }
      }
    }
  }
  
  alert("Couldn't find a tile type... this should never happen!");
  console.error("Couldn't find a tile type");
};