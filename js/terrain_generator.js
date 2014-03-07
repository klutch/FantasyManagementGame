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
  
  // Tile bounds by biome
  this.tileBoundsByBiome = {};
  this.tileBoundsByBiome[BiomeType.Tundra] = {};
  this.tileBoundsByBiome[BiomeType.Tundra][TileType.Plains] = [
    new PIXI.Rectangle(0, 0, 0.1, 0.2),
    new PIXI.Rectangle(0.1, 0, 0.1, 0.1),
    new PIXI.Rectangle(0.2, 0, 0.1, 0.2)
  ];
  this.tileBoundsByBiome[BiomeType.Tundra][TileType.Snow] = [
    new PIXI.Rectangle(0, 0.2, 0.1, 0.1),
    new PIXI.Rectangle(0.1, 0.1, 0.1, 0.2),
    new PIXI.Rectangle(0.2, 0.2, 0.1, 0.1)
  ];
  this.tileBoundsByBiome[BiomeType.Taiga] = {};
  this.tileBoundsByBiome[BiomeType.Taiga][TileType.Snow] = [
    new PIXI.Rectangle(0, 0.3, 0.2, 0.3),
    new PIXI.Rectangle(0, 0.6, 0.1, 0.4)
  ];
  this.tileBoundsByBiome[BiomeType.Taiga][TileType.Forest] = [
    new PIXI.Rectangle(0.2, 0.3, 0.1, 0.3),
    new PIXI.Rectangle(0.1, 0.6, 0.2, 0.4)
  ];
  this.tileBoundsByBiome[BiomeType.Temperate] = {};
  this.tileBoundsByBiome[BiomeType.Temperate][TileType.Grassland] = [
    new PIXI.Rectangle(0.3, 0, 0.2, 0.2),
    new PIXI.Rectangle(0.3, 0.2, 0.7, 0.2)
  ];
  this.tileBoundsByBiome[BiomeType.Temperate][TileType.Forest] = [
    new PIXI.Rectangle(0.3, 0.4, 0.4, 0.3)
  ];
  this.tileBoundsByBiome[BiomeType.Tropical] = {};
  this.tileBoundsByBiome[BiomeType.Tropical][TileType.Forest] = [
    new PIXI.Rectangle(0.7, 0.4, 0.3, 0.4),
    new PIXI.Rectangle(0.3, 0.7, 0.4, 0.1)
  ];
  this.tileBoundsByBiome[BiomeType.Tropical][TileType.Swamp] = [
    new PIXI.Rectangle(0.3, 0.8, 0.7, 0.2)
  ];
  this.tileBoundsByBiome[BiomeType.Desert] = {};
  this.tileBoundsByBiome[BiomeType.Desert][TileType.Sand] = [
    new PIXI.Rectangle(0.6, 0, 0.4, 0.1),
    new PIXI.Rectangle(0.9, 0.1, 0.1, 0.1)
  ];
  this.tileBoundsByBiome[BiomeType.Desert][TileType.Arid] = [
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
  var result = this.noise.fbm(x, y, this.noise.cell, {iterations: 4, frequency: 1.2, gain: 1, lacunarity: 1.2});
    
  return Math.max(Math.min(result, 1), 0);
};

TerrainGenerator.prototype.getPrecipitation = function(x, y)
{
  var result = this.noise.fbm(x, y, this.noise.ridgedPerlin, {iterations: 4, frequency: 0.7, gain: 0.8, lacunarity: 1.8});
    
  return Math.max(Math.min(result, 1), 0)
  //var result = this.noise.fbm(x, y, this.noise.perlin, {iterations: 8, frequency: 1.2, gain: 0.8, lacunarity: 1.2});
  
  //return Math.max(Math.min(result, 1), 0);
  //return this.noise.ridgedPerlin(x * 0.5, y * 0.5);
};

TerrainGenerator.prototype.getTemperature = function(x, y)
{
  return this.noise.ridgedPerlin(x * 0.5, y * 0.5);
  /*var result = this.noise.fbm(x * 0.25, y * 0.25, this.noise.cell, {iterations: 4, frequency: 1.2, gain: 0.8, lacunarity: 1.2});
  
  return Math.max(Math.min(result, 1), 0);*/
  //return this.noise.cell(x, y);
};

TerrainGenerator.prototype.getPrecipitationModifier = function(elevation)
{
  //return Math.max(Math.min(1 - baseElevation * 0.5, 1), 0)
  return 1;
};

TerrainGenerator.prototype.getTemperatureModifier = function(elevation)
{
  return 1;
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
  finalPrecipitation = basePrecipitation;
  
  // Get base temperature
  baseTemperature = this.getTemperature(x, y);
  
  // Calculate final temperature
  finalTemperature = baseTemperature;
  
  // Get biome type
  biomeType = this.getBiomeType(finalTemperature, finalPrecipitation);
  
  // Calculate final elevation
  elevationRange = this.elevationRanges[biomeType];
  finalElevation = MathHelper.lerp(elevationRange[0], elevationRange[1], baseElevation);
  
  // Handle special elevation cases (mountains and water)
  if (finalElevation > 0.8)
  {
    tileType = TileType.Mountain;
  }
  else if (finalElevation < 0.1)
  {
    tileType = TileType.Water;
  }
  else
  {
    tileType = this.getTileType(biomeType, finalTemperature, finalPrecipitation);
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