// World renderer class
var WorldRenderer = function(world)
{
  this.maxTileSpritePool = chunkSize * chunkSize;
  this.maxChunkSpritePool = 16;
  this.world = world;
  this.halfScreen = new PIXI.Point(renderer.view.width * 0.5, renderer.view.height * 0.5);
  this.blankTexture = PIXI.Texture.fromImage("img/blank.png");
  this.tileSpritePool = [];
  this.chunkSpritePool = [];
  this.chunkTexturePool = [];
  this.numActiveChunks = 0;
  this.spriteCounter = 0;
  this.camera = new Camera(0, 0);
  this.chunkSprites = [];
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position.x = this.halfScreen.x;
  this.container.position.y = this.halfScreen.y;
  
  for (var i = 0; i < this.maxTileSpritePool; i++)
  {
    this.tileSpritePool[i] = new PIXI.Sprite(this.blankTexture);
  }
  for (var i = 0; i < this.maxChunkSpritePool; i++)
  {
    this.chunkSpritePool[i] = new PIXI.Sprite(this.blankTexture);
    this.chunkTexturePool[i] = new PIXI.RenderTexture(chunkSize * tileSize, chunkSize * tileSize);
  }
};

WorldRenderer.prototype.render = function()
{
  var focusGridI = world.getGridI(this.camera.position.x);
  var focusGridJ = world.getGridJ(this.camera.position.y);
  var focusChunkI = world.getChunkI(focusGridI);
  var focusChunkJ = world.getChunkJ(focusGridJ);
  var chunkRadius = 1;
  
  // TODO: Clear chunks that aren't needed anymore
  
  for(var chunkI = focusChunkI - chunkRadius; chunkI <= focusChunkI + chunkRadius; chunkI++)
  {
    for(var chunkJ = focusChunkJ - chunkRadius; chunkJ <= focusChunkJ + chunkRadius; chunkJ++)
    {
      this.container.addChild(this.getChunkSprite(chunkI, chunkJ));
    }
  }
};

WorldRenderer.prototype.clearContainer = function()
{
  while (this.container.children.length > 0)
  {
    this.container.removeChild(this.container.getChildAt(0));
  }
};

WorldRenderer.prototype.getChunkSprite = function(chunkI, chunkJ)
{
  if (this.chunkSprites[chunkI] == null)
  {
    this.chunkSprites[chunkI] = [];
  }
  if (this.chunkSprites[chunkI][chunkJ] == null)
  {
    this.chunkSprites[chunkI][chunkJ] = this.generateChunkSprite(chunkI, chunkJ);
  }
  
  return this.chunkSprites[chunkI][chunkJ];
};

WorldRenderer.prototype.generateChunkSprite = function(chunkI, chunkJ)
{
  var renderTexture = this.chunkTexturePool[this.numActiveChunks];
  var chunkSprite = this.chunkSpritePool[this.numActiveChunks];
  var numActiveTileSprites = 0;
  
  for (var i = 0; i < chunkSize; i++)
  {
    for (var j = 0; j < chunkSize; j++)
    {
      var tileI = chunkI * chunkSize + i;
      var tileJ = chunkJ * chunkSize + j;
      var tile = this.world.getTile(tileI, tileJ);
      var tileSprite = this.tileSpritePool[numActiveTileSprites];
      
      tileSprite.setTexture(tile.texture);
      tileSprite.position.x = i * tileSize;
      tileSprite.position.y = j * tileSize;
      
      renderTexture.render(tileSprite, tileSprite.position);
      
      numActiveTileSprites++;
    }
  }
  
  chunkSprite.setTexture(renderTexture);
  chunkSprite.position.x = chunkI * chunkSize * tileSize;
  chunkSprite.position.y = chunkJ * chunkSize * tileSize;
  
  this.numActiveChunks++;
  
  return chunkSprite;
};

WorldRenderer.prototype.moveCamera = function(x, y)
{
  this.camera.position.x = x;
  this.camera.position.y = y;
  this.container.position.x = -x + this.halfScreen.x;
  this.container.position.y = -y + this.halfScreen.y;
}