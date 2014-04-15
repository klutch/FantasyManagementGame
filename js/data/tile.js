var TileType = Object.freeze({
  Water: 0,
  Arid: 1,
  Sand: 2,
  Swamp: 3,
  Grassland: 4,
  Plains: 5,
  Snow: 6,
  Road: 7,
  Mountain: 8,
  Forest: 9
});

var MovementCost = Object.freeze({
  Easiest: 0,
  Easy: 10,
  Moderate: 20,
  Hard: 30,
  Hardest: 40
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