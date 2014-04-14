var PathPreviewComponent = function(options)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.paths = [];
  this.maxPaths = 999;
  this.pathSprites = [];
  this.z = options.z;
};

PathPreviewComponent.prototype = new PIXI.DisplayObjectContainer;

PathPreviewComponent.prototype.getUnusedIndex = function()
{
  for (var i = 0; i < this.maxPaths; i++)
  {
    if (this.paths[i] == undefined)
    {
      return i;
    }
  }
  return this.maxPaths;
};

PathPreviewComponent.prototype.getPathIndex = function(path)
{
  for (var i = 0; i < this.paths.length; i++)
  {
    if (this.paths[i] == path)
    {
      return i;
    }
  }
}

PathPreviewComponent.prototype.drawPath = function(path, tint)
{
  var index = this.getUnusedIndex();
  var currentNode = path;
  var sprites = [];
  
  this.paths[index] = path;
  this.pathSprites[index] = sprites;
  tint = tint == null ? 0xFFFF00 : tint;
  
  while (currentNode != null)
  {
    var sprite = PIXI.Sprite.fromImage(game.assetManager.paths.ui.pathOverlay);
    
    sprite.position.x = currentNode.i * TILE_SIZE;
    sprite.position.y = currentNode.j * TILE_SIZE;
    sprite.tint = tint;
    sprites.push(sprite);
    this.addChild(sprite);
    currentNode = currentNode.next;
  }
};

PathPreviewComponent.prototype.clearPath = function(path)
{
  var index = this.getPathIndex(path);
  var sprites = this.pathSprites[index];
  
  for (var i = 0; i < sprites.length; i++)
  {
    this.removeChild(sprites[i]);
  }
  
  delete this.pathSprites[index];
  delete this.paths[index];
};

PathPreviewComponent.prototype.update = function()
{
};