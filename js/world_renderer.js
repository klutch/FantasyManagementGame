// WorldRenderer constructor
var WorldRenderer = function(world)
{
  this.maxTileSpritePool = chunkSize * chunkSize;
  this.maxChunkSpritePool = 256;
  this.world = world;
  this.halfScreen = new PIXI.Point(renderer.view.width * 0.5, renderer.view.height * 0.5);
  this.tileSpritePool = [];
  this.chunkSpritePool = [];
  this.chunkTexturePool = [];
  this.activeChunkPoolIndices = []; // array of indices used (for chunkSprite and chunkTexture pools)
  this.spriteCounter = 0;
  this.camera = new PIXI.DisplayObjectContainer();
  this.camera.position.x = (this.world.playerCastleX + 4) * tileSize;
  this.camera.position.y = (this.world.playerCastleY + 4) * tileSize;
  this.chunkSprites = {};
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position.x = this.halfScreen.x;
  this.container.position.y = this.halfScreen.y;
  
  for (var i = 0; i < this.maxTileSpritePool; i++)
  {
    this.tileSpritePool[i] = new PIXI.Sprite(PIXI.Texture.fromImage(assetPathManager.textureAssetPaths.blank));
  }
  for (var i = 0; i < this.maxChunkSpritePool; i++)
  {
    this.chunkSpritePool[i] = new PIXI.Sprite(PIXI.Texture.fromImage(assetPathManager.textureAssetPaths.blank));
    this.chunkTexturePool[i] = new PIXI.RenderTexture(chunkSize * tileSize, chunkSize * tileSize);
  }
};

// Get texture given a tile
WorldRenderer.prototype.getTileTexture = function(tile)
{
  var type = tile.type;
  var assetPath;
  
  if (type == TileType.Plains)
  {
    return PIXI.Texture.fromImage(assetPathManager.textureAssetPaths.plains[Math.floor(Math.random()*assetPathManager.textureAssetPaths.plains.length)]);
  }
  else if (type == TileType.Forest)
  {
    return PIXI.Texture.fromImage(assetPathManager.textureAssetPaths.forest[Math.floor(Math.random()*assetPathManager.textureAssetPaths.forest.length)]);
  }
  else if (type == TileType.Swamp)
  {
    return PIXI.Texture.fromImage(assetPathManager.textureAssetPaths.swamp[Math.floor(Math.random()*assetPathManager.textureAssetPaths.swamp.length)]);
  }
  else if (type == TileType.Mountains)
  {
    return PIXI.Texture.fromImage(assetPathManager.textureAssetPaths.mountains[Math.floor(Math.random()*assetPathManager.textureAssetPaths.mountains.length)]);
  }
  else if (type == TileType.Hills)
  {
    return PIXI.Texture.fromImage(assetPathManager.textureAssetPaths.hills[Math.floor(Math.random()*assetPathManager.textureAssetPaths.hills.length)]);
  }
  else if (type == TileType.Snow)
  {
    return PIXI.Texture.fromImage(assetPathManager.textureAssetPaths.snow[Math.floor(Math.random()*assetPathManager.textureAssetPaths.snow.length)]);
  }
  else if (type == TileType.Desert)
  {
    return PIXI.Texture.fromImage(assetPathManager.textureAssetPaths.desert[Math.floor(Math.random()*assetPathManager.textureAssetPaths.desert.length)]);
  }
  else if (type == TileType.Water)
  {
    return PIXI.Texture.fromImage(assetPathManager.textureAssetPaths.water[Math.floor(Math.random()*assetPathManager.textureAssetPaths.water.length)]);
  }
  else if (type == TileType.PlayerCastle)
  {
    var i = tile.castleTextureI;
    var j = tile.castleTextureJ;
    var num = j * 8 + i;
    
    return PIXI.Texture.fromImage(assetPathManager.textureAssetPaths.playerCastle[num]);
  }
};

// Get number of chunks to show on the x axis
WorldRenderer.prototype.getChunkBufferX = function()
{
  return Math.ceil((containerWidth / (chunkSize * tileSize * this.camera.scale.x)) * 0.5);
};

// Get number of chunks to show on the y axis
WorldRenderer.prototype.getChunkBufferY = function()
{
  return Math.ceil((containerHeight / (chunkSize * tileSize * this.camera.scale.y)) * 0.5);
};

// Update
WorldRenderer.prototype.update = function()
{
  this.container.position.x = (-this.camera.position.x * this.camera.scale.x) + this.halfScreen.x;
  this.container.position.y = (-this.camera.position.y * this.camera.scale.y) + this.halfScreen.y;
  this.container.scale.x = this.camera.scale.x;
  this.container.scale.y = this.camera.scale.y;
};

// Render
WorldRenderer.prototype.render = function()
{
  var focusGridI = world.getGridI(this.camera.position.x);
  var focusGridJ = world.getGridJ(this.camera.position.y);
  var focusChunkI = world.getChunkI(focusGridI);
  var focusChunkJ = world.getChunkJ(focusGridJ);
  var chunkBufferX = this.getChunkBufferX();
  var chunkBufferY = this.getChunkBufferY();
  var startChunkI = focusChunkI - chunkBufferX;
  var endChunkI = focusChunkI + chunkBufferX;
  var startChunkJ = focusChunkJ - chunkBufferY;
  var endChunkJ = focusChunkJ + chunkBufferY;
  
  //console.log("chunkBufferX: "+ chunkBufferX + ", chunkBufferY: " + chunkBufferY);
  
  this.clearChunksOutside(startChunkI, endChunkI, startChunkJ, endChunkJ);
  
  for(var chunkI = startChunkI; chunkI <= endChunkI; chunkI++)
  {
    for(var chunkJ = startChunkJ; chunkJ <= endChunkJ; chunkJ++)
    {
      this.container.addChild(this.getChunkSprite(chunkI, chunkJ));
    }
  }
};

// Clear chunks outside a given range
WorldRenderer.prototype.clearChunksOutside = function(startChunkI, endChunkI, startChunkJ, endChunkJ)
{
  for (var chunkI in this.chunkSprites)
  {
    if (this.chunkSprites.hasOwnProperty(chunkI)) // JAVASCRIPT IS SO (&@!#%&*(@#! INTUITIVE!! D:
    {
      for (var chunkJ in this.chunkSprites[chunkI])
      {
        if (this.chunkSprites[chunkI].hasOwnProperty(chunkJ))
        {
          if (chunkI < startChunkI || chunkI > endChunkI || chunkJ < startChunkJ || chunkJ > endChunkJ)
          {
            var chunkSprite = this.chunkSprites[chunkI][chunkJ];
            
            this.container.removeChild(chunkSprite);
            delete this.chunkSprites[chunkI][chunkJ];
            delete this.activeChunkPoolIndices[this.getActiveChunkPoolIndex(chunkSprite)];
            
            if (_.size(this.chunkSprites[chunkI]) == 0)
            {
              delete this.chunkSprites[chunkI];
            }
          }
        }
      }
    }
  }
};

// Get a chunk sprite (either cached, or generate new one)
WorldRenderer.prototype.getChunkSprite = function(chunkI, chunkJ)
{
  if (this.chunkSprites[chunkI] == null)
  {
    this.chunkSprites[chunkI] = {};
  }
  if (this.chunkSprites[chunkI][chunkJ] == null)
  {
    this.chunkSprites[chunkI][chunkJ] = this.generateChunkSprite(chunkI, chunkJ);
  }
  
  return this.chunkSprites[chunkI][chunkJ];
};

// Get an unused index from the chunk pool
WorldRenderer.prototype.getUnusedChunkPoolIndex = function()
{
  var index = 0;
  
  while (this.activeChunkPoolIndices[index])
  {
    index++;
  }
  
  return index;
};

// Get a chunk pool index, given a chunk sprite
WorldRenderer.prototype.getActiveChunkPoolIndex = function(chunkSprite)
{
  for (var i = 0; i < this.activeChunkPoolIndices.length; i++)
  {
    if (this.activeChunkPoolIndices[i] == chunkSprite)
    {
      return i;
    }
  }
};

// Generate a chunk sprite by rendering tiles to it
WorldRenderer.prototype.generateChunkSprite = function(chunkI, chunkJ)
{
  var chunkPoolIndex = this.getUnusedChunkPoolIndex();
  var renderTexture = this.chunkTexturePool[chunkPoolIndex];
  var chunkSprite = this.chunkSpritePool[chunkPoolIndex];
  var numActiveTileSprites = 0;
  
  for (var i = 0; i < chunkSize; i++)
  {
    for (var j = 0; j < chunkSize; j++)
    {
      var tileI = chunkI * chunkSize + i;
      var tileJ = chunkJ * chunkSize + j;
      var tile = this.world.getTile(tileI, tileJ);
      var tileSprite = this.tileSpritePool[numActiveTileSprites];
      var c;
      
      tileSprite.setTexture(this.getTileTexture(tile));
      tileSprite.position.x = i * tileSize;
      tileSprite.position.y = j * tileSize;
      
      if (tile.type != TileType.Water)
      {
        c = Math.floor((tile.elevation + 1) * 0.5 * 255).toString(16)
        c = c.length < 2 ? ('0' + c) : c;
        tileSprite.tint = '0x' + c + c + c;
      }
      else
      {
        tileSprite.tint = 0xFFFFFF;
      }
      
      renderTexture.render(tileSprite, tileSprite.position);
      
      numActiveTileSprites++;
    }
  }
  
  chunkSprite.setTexture(renderTexture);
  chunkSprite.position.x = chunkI * chunkSize * tileSize;
  chunkSprite.position.y = chunkJ * chunkSize * tileSize;
  
  this.activeChunkPoolIndices[chunkPoolIndex] = chunkSprite;
  
  return chunkSprite;
};

// Move the camera to a given position
WorldRenderer.prototype.moveCamera = function(x, y)
{
  this.camera.position.x = x;
  this.camera.position.y = y;
}

// Zoom camera
WorldRenderer.prototype.zoomCamera = function(deltaY)
{
  var scale = Math.min(Math.max(this.camera.scale.x + deltaY, 0.5), 2);
  
  this.camera.scale.x = scale;
  this.camera.scale.y = scale;
};