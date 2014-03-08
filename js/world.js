// Biome types
var BiomeType = Object.freeze({
  Tundra: "Tundra",
  Taiga: "Taiga",
  Temperate: "Temperate",
  Tropical: "Tropical",
  Desert: "Desert"
});

// Tile types
var TileType = Object.freeze({
  Plains: "Plains",
  Snow: "Snow",
  Forest: "Forest",
  Grassland: "Grassland",
  Swamp: "Swamp",
  Arid: "Arid",
  Sand: "Sand",
  Mountain: "Mountain",
  Water: "Water",
  Road: "Road"
});

// Tile class
var Tile = function(type, biomeType, walkable, movementCost, elevation, discovered)
{
  this.type = type;
  this.biomeType = biomeType;
  this.walkable = walkable;
  this.movementCost = movementCost;
  this.elevation = elevation;
  this.discovered = discovered;
};

// Feature types
var FeatureType = Object.freeze({
  Castle: "Castle",
  Dwelling: "Dwelling",
  Dungeon: "Dungeon",
  Gathering: "Gathering"
});

// Castle types
var CastleType = Object.freeze({
  Player: "Player"
});

// Dwelling types
var DwellingType = Object.freeze({
  Town: "Town",
  Grove: "Grove"
});

// Dungeon types
var DungeonType = Object.freeze({
  Cave: "Cave"
});

// Gathering types
var GatheringType = Object.freeze({
  Tavern: "Tavern"
});

// Feature type lists (purely for convenience)
var FeatureTypeList = Object.freeze({
  Castle: CastleType,
  Dwelling: DwellingType,
  Dungeon: DungeonType,
  Gathering: GatheringType
});

// Feature class
var Feature = function(id, type, tileI, tileJ, width, height)
{
  this.id = id;
  this.type = type;
  this.tileI = tileI;
  this.tileJ = tileJ;
  this.width = width;
  this.height = height;
};

// World class
var World = function(seed)
{
  this.seed = seed;
  this.tiles = [];
  this.features = [];
  this.terrainGenerator = new TerrainGenerator(this, seed);
  this.featureGenerator = new FeatureGenerator(this, seed);
  this.playerCastleI = 0;
  this.playerCastleJ = 0;
  
  //this.featureGenerator.generatePlayerCastle();
};

World.prototype.getGridI = function(x) { return Math.floor(x / tileSize); };
World.prototype.getGridJ = function(y) { return Math.floor(y / tileSize); };

// Does tile exist
World.prototype.doesTileExist = function(i, j)
{
  if (this.tiles[i] == null)
  {
    return false;
  }
  if (this.tiles[i][j] == null)
  {
    return false;
  }
  return true;
};

// Get a tile
World.prototype.getTile = function(i, j)
{
  return this.tiles[i][j];
};

// Generate a tile
World.prototype.generateTile = function(i, j)
{
  if (this.tiles[i] == null)
  {
    this.tiles[i] = [];
  }
  this.tiles[i][j] = this.terrainGenerator.generateTile(i, j);
  
  return this.tiles[i][j];
};

// Create feature
World.prototype.createFeature = function(featureType, x, y, width, height)
{
  var id = this.features.length;
  var feature = new Feature(id, featureType, x, y, width, height);
  
  this.features[id] = feature;
  
  for (var i = 0; i < width; i++)
  {
    for (var j = 0; j < height; j++)
    {
      var tile = this.getTile(x + i, y + j);
      
      tile.featureId = id;
      tile.featureTextureI = i;
      tile.featureTextureJ = j;
    }
  }
  
  return feature;
};

// Discover tiles in a radius around a given tile
World.prototype.discoverRadius = function(tileI, tileJ, radius)
{
  var radiusSq = radius * radius;
  var worldRenderer = screenManager.screens[ScreenType.WorldMap].worldRenderer;
  
  for (var i = tileI - radius, limitI = tileI + radius + 1; i < limitI; i++)
  {
    for (var j = tileJ - radius, limitJ = tileJ + radius + 1; j < limitJ; j++)
    {
      var relI = i - tileI;
      var relJ = j - tileJ;
      var distanceSq = relI * relI + relJ * relJ;
      var tile;
      
      if (distanceSq > radiusSq)
      {
        continue;
      }
      
      tile = this.doesTileExist(i, j) ? this.getTile(i, j) : this.generateTile(i, j);
      tile.discovered = true;
      worldRenderer.addTileToDraw(i, j);
    }
  }
};