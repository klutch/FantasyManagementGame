var CastleType = Object.freeze({
  Player: "Player"
});

var DwellingType = Object.freeze({
  Town: "Town",
  Grove: "Grove"
});

var DungeonType = Object.freeze({
  Cave: "Cave"
});

var GatheringType = Object.freeze({
  Tavern: "Tavern"
});

var FeatureType = Object.freeze({
  Castle: "Castle",
  Dwelling: "Dwelling",
  Dungeon: "Dungeon",
  Gathering: "Gathering"
});

// Feature type lists (purely for convenience)
var FeatureTypeList = Object.freeze({
  Castle: CastleType,
  Dwelling: DwellingType,
  Dungeon: DungeonType,
  Gathering: GatheringType
});

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