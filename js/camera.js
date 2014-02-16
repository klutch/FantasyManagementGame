// Camera class
var Camera = function(x, y)
{
  this.cellSize = 32;
  this.position = new PIXI.Point(x, y);
};

Camera.prototype.getGridI = function()
{
  return Math.floor(this.position.x / this.cellSize);
};

Camera.prototype.getGridJ = function()
{
  return Math.floor(this.position.y / this.cellSize);
};