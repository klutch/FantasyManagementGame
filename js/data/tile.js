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