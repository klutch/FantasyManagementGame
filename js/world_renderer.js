// World renderer class
var WorldRenderer = function(world)
{
  this.maxSpritePool = 4096;
  this.world = world;
  this.container = new PIXI.DisplayObjectContainer();
  this.blankTexture = PIXI.Texture.fromImage("img/blank.png");
  this.spritePool = [];
  this.spriteCounter = 0;
  
  for (var i = 0; i < this.maxSpritePool; i++)
  {
    this.spritePool[i] = new PIXI.Sprite(this.blankTexture);
  }
};

WorldRenderer.prototype.render = function(focusI, focusJ, focusHalfWidth, focusHalfHeight)
{
  this.spriteCounter = 0;
  
  while (this.container.children.length > 0)
  {
    this.container.removeChild(this.container.getChildAt(0));
  }
  
  for(var i = focusI - focusHalfWidth; i < focusI + focusHalfWidth; i++)
  {
    for (var j = focusJ - focusHalfHeight; j < focusJ + focusHalfHeight; j++)
    {
      var sprite = this.spritePool[this.spriteCounter];
      var tile = world.getTile(i, j);
      
      sprite.position.x = 32 * i;
      sprite.position.y = 32 * j;
      sprite.setTexture(tile.texture);
      
      this.container.addChild(sprite);
      
      this.spriteCounter++;
    }
  }
};