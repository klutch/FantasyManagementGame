// Camera class
var Camera = function(x, y)
{
  this.position = new PIXI.Point(x, y);
};

Camera.prototype.getGridI = function()
{
  return Math.floor(this.position.x / tileSize);
};

Camera.prototype.getGridJ = function()
{
  return Math.floor(this.position.y / tileSize);
};