var PathfinderDebugComponent = function()
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.nodeSprites = {};
};

PathfinderDebugComponent.prototype = new PIXI.DisplayObjectContainer;

PathfinderDebugComponent.prototype.clearNodes = function()
{
  _.each(this.nodeSprites, function(sprite)
    {
      this.removeChild(sprite);
    },
    this);
  
  this.nodeSprites = {};
};

PathfinderDebugComponent.prototype.addOpenNode = function(node)
{
  var sprite = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.pathfinderDebugTile);
  
  sprite.position.x = node.i * TILE_SIZE;
  sprite.position.y = node.j * TILE_SIZE;
  sprite.tint = 0x00FF00;
  sprite.node = node;
  this.nodeSprites[node.toString()] = sprite;
  this.addChild(sprite);
};

PathfinderDebugComponent.prototype.addClosedNode = function(node)
{
  this.nodeSprites[node.toString()].tint = 0xFF0000;
};