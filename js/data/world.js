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
  Water: 0,
  Plains: 1,
  Snow: 2,
  Grassland: 3,
  Swamp: 4,
  Arid: 5,
  Sand: 6,
  Road: 7,
  Mountain: 8,
  Forest: 9
});

// Tile class
var Tile = function(type, biomeType, i, j, walkable, movementCost, elevation, discovered)
{
  this.type = type;
  this.biomeType = biomeType;
  this.i = i;
  this.j = j;
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
Feature.prototype.containsTile = function(i, j)
{
  return (i >= this.tileI && i < this.tileI + this.width) && (j >= this.tileJ && j < this.tileJ + this.height);
};

// World class
var World = function(seed)
{
  this.seed = seed;
  this.tiles = [];
  this.features = [];
  this.playerCastleI = 0;
  this.playerCastleJ = 0;
};