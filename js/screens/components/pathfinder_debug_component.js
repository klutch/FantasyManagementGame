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
  var tooltipScreen = screenManager.screens[ScreenType.Tooltip];
  
  sprite.position.x = node.i * TILE_SIZE;
  sprite.position.y = node.j * TILE_SIZE;
  sprite.tint = 0x00FF00;
  sprite.node = node;
  sprite.interactive = true;
  sprite.buttonMode = true;
  sprite.mouseover = function()
    {
      tooltipScreen.addTooltip("pathfinderDebug", "debugValues", "G: " + node.g + ", H: " + node.h + ", F: " + node.f);
    };
  sprite.mouseout = function()
    {
      tooltipScreen.removeTooltip("pathfinderDebug", "debugValues");
    };
  this.nodeSprites[pathfinderManager.getKey(node.i, node.j)] = sprite;
  this.addChild(sprite);
};

PathfinderDebugComponent.prototype.addClosedNode = function(node)
{
  this.nodeSprites[pathfinderManager.getKey(node.i, node.j)].tint = 0xFF0000;
};

PathfinderDebugComponent.prototype.drawPath = function(node)
{
  var currentNode = node;
  
  while (currentNode != null)
  {
    var sprite = this.nodeSprites[pathfinderManager.getKey(currentNode.i, currentNode.j)];
    
    sprite.tint = 0xFFFF00;
    currentNode = currentNode.next;
  }
};