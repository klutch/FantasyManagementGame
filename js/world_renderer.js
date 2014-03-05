// WorldRenderer constructor
var WorldRenderer = function()
{
  this.maxChunkSpritePool = 512;
  this.world = game.world;
  this.halfScreen = new PIXI.Point(game.containerWidth * 0.5, game.containerHeight * 0.5);
  this.tileSpritePool = [];
  this.chunkSpritePool = [];
  this.chunkTexturePool = [];
  this.activeChunkPoolIndices = []; // array of indices used (for chunkSprite and chunkTexture pools)
  this.spriteCounter = 0;
  this.camera = new PIXI.DisplayObjectContainer();
  this.camera.position.x = (this.world.playerCastleX + 4) * 16;
  this.camera.position.y = (this.world.playerCastleY + 4) * 16;
  this.chunkSprites = {};
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position.x = this.halfScreen.x;
  this.container.position.y = this.halfScreen.y;
  this.debugGridI = 0;
  this.debugGridJ = 0;
  this.debugSelection = new PIXI.Sprite(PIXI.Texture.fromImage(assetPathManager.assetPaths.tiles.debugTileSelection));
  this.minScale = 0.25;
  this.maxScale = 2;
  
  this.container.addChild(this.debugSelection);
  
  // Create reuseable sprites
  for (var i = 0; i < this.maxChunkSpritePool; i++)
  {
    this.chunkSpritePool[i] = new PIXI.Sprite(PIXI.Texture.fromImage(assetPathManager.assetPaths.tiles.blank));
    this.chunkTexturePool[i] = new PIXI.RenderTexture(chunkSize * tileSize, chunkSize * tileSize);
  }
  
  var ugh = this;
  this.terrainSprites = {};
  _.each(TileType, function(type)
    {
      ugh.terrainSprites[type] = [];
      _.each(assetPathManager.assetPaths.terrainTiles[type], function(path)
        {
          ugh.terrainSprites[type].push(PIXI.Sprite.fromImage(path));
        });
    });
};

// Get texture given a tile
WorldRenderer.prototype.getTileSprite = function(tile)
{
  var type = tile.type;
  var tilesList = this.terrainSprites[type];
  
  return tilesList[Math.floor(Math.random() * tilesList.length)];
};

// Get texture given a feature
WorldRenderer.prototype.getFeatureTexture = function(feature, textureI, textureJ)
{
  var num = textureJ * feature.width + textureI;
  
  if (feature.type == FeatureType.PlayerCastle)
  {
    return PIXI.Texture.fromImage(assetPathManager.assetPaths.featureTiles[FeatureType.PlayerCastle][num]);
  }
  else if (feature.type == FeatureType.Dwelling)
  {
    return PIXI.Texture.fromImage(assetPathManager.assetPaths.dwellingTiles[feature.dwellingType][num]);
  }
  else if (feature.type == FeatureType.Dungeon)
  {
    return PIXI.Texture.fromImage(assetPathManager.assetPaths.dungeonTiles[feature.dungeonType][num]);
  }
  else if (feature.type == FeatureType.Gathering)
  {
    return PIXI.Texture.fromImage(assetPathManager.assetPaths.gatheringTiles[feature.gatheringType][num]);
  }
};

// Get number of chunks to show on the x axis
WorldRenderer.prototype.getChunkBufferX = function()
{
  return Math.ceil((game.containerWidth / (chunkSize * tileSize * this.minScale)) * 0.5);
  //return Math.ceil((game.containerWidth / (chunkSize * tileSize * this.camera.scale.x)) * 0.5);
};

// Get number of chunks to show on the y axis
WorldRenderer.prototype.getChunkBufferY = function()
{
  return Math.ceil((game.containerHeight / (chunkSize * tileSize * this.minScale)) * 0.5);
  //return Math.ceil((game.containerHeight / (chunkSize * tileSize * this.camera.scale.y)) * 0.5);
};

// Update
WorldRenderer.prototype.update = function()
{
  this.container.position.x = (-this.camera.position.x * this.camera.scale.x) + this.halfScreen.x;
  this.container.position.y = (-this.camera.position.y * this.camera.scale.y) + this.halfScreen.y;
  this.container.scale.x = this.camera.scale.x;
  this.container.scale.y = this.camera.scale.y;
  this.debugSelection.position.x = this.debugGridI * tileSize;
  this.debugSelection.position.y = this.debugGridJ * tileSize;
};

// Prerender chunks
WorldRenderer.prototype.prerender = function()
{
  var focusGridI = this.world.getGridI(this.camera.position.x);
  var focusGridJ = this.world.getGridJ(this.camera.position.y);
  var focusChunkI = this.world.getChunkI(focusGridI);
  var focusChunkJ = this.world.getChunkJ(focusGridJ);
  var chunkBufferX = this.getChunkBufferX();
  var chunkBufferY = this.getChunkBufferY();
  var startChunkI = focusChunkI - chunkBufferX;
  var endChunkI = focusChunkI + chunkBufferX;
  var startChunkJ = focusChunkJ - chunkBufferY;
  var endChunkJ = focusChunkJ + chunkBufferY;
  
  // Clear offscreen chunks
  this.clearChunksOutside(startChunkI, endChunkI, startChunkJ, endChunkJ);
  
  // Ensure necessary chunks exist
  for(var chunkI = startChunkI; chunkI <= endChunkI; chunkI++)
  {
    for(var chunkJ = startChunkJ; chunkJ <= endChunkJ; chunkJ++)
    {
      if (this.chunkSprites[chunkI] == null)
      {
        this.chunkSprites[chunkI] = {};
      }
      if (this.chunkSprites[chunkI][chunkJ] == null)
      {
        this.chunkSprites[chunkI][chunkJ] = this.generateChunkSprite(chunkI, chunkJ);
        this.container.addChildAt(this.chunkSprites[chunkI][chunkJ], 0);
      }
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
      var tileSprite = this.getTileSprite(tile);
      var c;
      
      // Render terrain tile
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
      
      // Render feature tile
      /*if (tile.featureId != null)
      {
        var feature = this.world.features[tile.featureId];
        
        tileSprite.setTexture(this.getFeatureTexture(feature, tile.featureTextureI, tile.featureTextureJ));
        renderTexture.render(tileSprite, tileSprite.position);
      }*/
      
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
WorldRenderer.prototype.moveCamera = function(deltaX, deltaY)
{
  this.camera.position.x += deltaX;
  this.camera.position.y += deltaY;
}

// Zoom camera
WorldRenderer.prototype.zoomCamera = function(deltaY)
{
  var scale = Math.min(Math.max(this.camera.scale.x + deltaY, this.minScale), this.maxScale);
  
  this.camera.scale.x = scale;
  this.camera.scale.y = scale;
};