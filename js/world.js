// Tile type enum
var TileType = Object.freeze({
  Desert: "Desert",
  Plains: "Plains",
  Hills: "Hills",
  Mountains: "Mountains",
  Snow: "Snow",
  Forest: "Forest",
  Swamp: "Swamp",
  Water: "Water",
  Road: "Road"
});

// Tile class
var Tile = function(type, walkable, movementCost, elevation)
{
  this.type = type;
  this.walkable = walkable;
  this.movementCost = movementCost;
  this.elevation = elevation;
};

// Feature type enum
var FeatureType = Object.freeze({
  Castle: "Castle",
  Dwelling: "Dwelling",
  Dungeon: "Dungeon",
  Gathering: "Gathering"
});

// Castle type enum
var CastleType = Object.freeze({
  Player: "Player"
});

// Dwelling type enum
var DwellingType = Object.freeze({
  Town: "Town",
  Grove: "Grove"
});

// Dungeon type enum
var DungeonType = Object.freeze({
  Cave: "Cave"
});

// Gathering type enum
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
  this.playerCastleX = 0;
  this.playerCastleY = 0;
  
  this.featureGenerator.generatePlayerCastle();
};

World.prototype.getChunkI = function(i)
{
  return Math.floor(i / chunkSize);
};

World.prototype.getChunkJ = function(j)
{
  return Math.floor(j / chunkSize);
};

World.prototype.getGridI = function(x)
{
  return Math.floor(x / tileSize);
};

World.prototype.getGridJ = function(y)
{
  return Math.floor(y / tileSize);
};

World.prototype.getTile = function(i, j)
{
  if (this.tiles[i] == null)
  {
    this.tiles[i] = [];
  }
  if (this.tiles[i][j] == null)
  {
    this.tiles[i][j] = this.terrainGenerator.getTile(i, j);
    this.featureGenerator.tryGenerateAt(i, j);
  }
  
  return this.tiles[i][j];
};

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