// World renderer class
var WorldRenderer = function(world)
{
  this.maxSpritePool = 4096;
  this.world = world;
  this.container = new PIXI.DisplayObjectContainer();
  this.halfScreen = new PIXI.Point(renderer.view.width * 0.5, renderer.view.height * 0.5);
  this.container.position.x = this.halfScreen.x;
  this.container.position.y = this.halfScreen.y;
  this.blankTexture = PIXI.Texture.fromImage("img/blank.png");
  this.spritePool = [];
  this.spriteCounter = 0;
  this.camera = new Camera(0, 0);
  
  for (var i = 0; i < this.maxSpritePool; i++)
  {
    this.spritePool[i] = new PIXI.Sprite(this.blankTexture);
  }
};

WorldRenderer.prototype.render = function(focusHalfWidth, focusHalfHeight)
{
  var gridI = this.camera.getGridI();
  var gridJ = this.camera.getGridJ();
  
  this.spriteCounter = 0;
  
  while (this.container.children.length > 0)
  {
    this.container.removeChild(this.container.getChildAt(0));
  }
  
  for(var i = gridI - focusHalfWidth; i < gridI + focusHalfWidth; i++)
  {
    for (var j = gridJ - focusHalfHeight; j < gridJ + focusHalfHeight; j++)
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

WorldRenderer.prototype.moveCamera = function(x, y)
{
  this.camera.position.x = x;
  this.camera.position.y = y;
  this.container.position.x = -x + this.halfScreen.x;
  this.container.position.y = -y + this.halfScreen.y;
}