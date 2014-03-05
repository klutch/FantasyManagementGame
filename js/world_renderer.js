// WorldRenderer constructor
var WorldRenderer = function()
{
  var root = this; // Need this for _.each loops... TODO: Learn javascript.
  
  this.world = game.world;
  this.halfScreen = new PIXI.Point(game.containerWidth * 0.5, game.containerHeight * 0.5);
  this.camera = new PIXI.DisplayObjectContainer();
  this.camera.position.x = (this.world.playerCastleX + 4) * 16;
  this.camera.position.y = (this.world.playerCastleY + 4) * 16;
  this.camera.target = new PIXI.Point(this.camera.position.x, this.camera.position.y);
  this.chunkSprites = {};
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position.x = this.halfScreen.x;
  this.container.position.y = this.halfScreen.y;
  this.debugGridI = 0;
  this.debugGridJ = 0;
  this.debugSelection = new PIXI.Sprite(PIXI.Texture.fromImage(assetPathManager.assetPaths.tiles.debugTileSelection));
  this.minScale = 0.05;
  this.maxScale = 2;
  
  this.container.addChild(this.debugSelection);
  
  // Create terrain sprites
  this.terrainSprites = {};
  _.each(TileType, function(type)
    {
      root.terrainSprites[type] = [];
      _.each(assetPathManager.assetPaths.terrainTiles[type], function(path)
        {
          root.terrainSprites[type].push(PIXI.Sprite.fromImage(path));
        });
    });
  
  // Create feature sprites
  this.featureSprites = {};
  _.each(FeatureType, function(featureType)
  {
    var subTypes = FeatureTypeList[featureType];
    
    root.featureSprites[featureType] = {};
    _.each(subTypes, function(subType)
    {
      root.featureSprites[featureType][subType] = [];
      _.each(assetPathManager.assetPaths.featureTiles[featureType][subType], function(path)
      {
        root.featureSprites[featureType][subType].push(PIXI.Sprite.fromImage(path));
      });
    });
  });
};

WorldRenderer.prototype.getChunkI = function(i)
{
  return Math.floor(i / chunkSize);
};

WorldRenderer.prototype.getChunkJ = function(j)
{
  return Math.floor(j / chunkSize);
};

// Get terrain tile sprites
WorldRenderer.prototype.getTileSprite = function(tile)
{
  var type = tile.type;
  var tilesList = this.terrainSprites[type];
  
  return tilesList[Math.floor(Math.random() * tilesList.length)];
};

// Get feature tile sprites
WorldRenderer.prototype.getFeatureSprite = function(feature, textureI, textureJ)
{
  var index = textureJ * feature.width + textureI;
  
  if (feature.type == FeatureType.Castle)
  {
    return this.featureSprites[feature.type][feature.castleType][index];
  }
  else if (feature.type == FeatureType.Dwelling)
  {
    return this.featureSprites[feature.type][feature.dwellingType][index];
  }
  else if (feature.type == FeatureType.Dungeon)
  {
    return this.featureSprites[feature.type][feature.dungeonType][index];
  }
  else if (feature.type == FeatureType.Gathering)
  {
    return this.featureSprites[feature.type][feature.gatheringType][index];
  }
};

// Update
WorldRenderer.prototype.update = function()
{
  this.camera.position.x += (this.camera.target.x - this.camera.position.x) / 8;
  this.camera.position.y += (this.camera.target.y - this.camera.position.y) / 8;
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
  var focusChunkI = this.getChunkI(focusGridI);
  var focusChunkJ = this.getChunkJ(focusGridJ);
  var chunkBufferX = 1;
  var chunkBufferY = 1;
  var startChunkI = focusChunkI - chunkBufferX;
  var endChunkI = focusChunkI + chunkBufferX;
  var startChunkJ = focusChunkJ - chunkBufferY;
  var endChunkJ = focusChunkJ + chunkBufferY;
  
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

// Generate a chunk sprite by rendering tiles to it
WorldRenderer.prototype.generateChunkSprite = function(chunkI, chunkJ)
{
  var renderTexture = new PIXI.RenderTexture(chunkSize * tileSize, chunkSize * tileSize);
  var chunkSprite = new PIXI.Sprite(renderTexture);
  
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
      if (tile.featureId != null)
      {
        var feature = this.world.features[tile.featureId];
        var featureSprite = this.getFeatureSprite(feature, tile.featureTextureI, tile.featureTextureJ);
        
        renderTexture.render(featureSprite, tileSprite.position);
      }
    }
  }
  
  chunkSprite.position.x = chunkI * chunkSize * tileSize;
  chunkSprite.position.y = chunkJ * chunkSize * tileSize;
  
  return chunkSprite;
};

// Move the camera to a given position
WorldRenderer.prototype.moveCamera = function(deltaX, deltaY)
{
  this.camera.target.x += deltaX;
  this.camera.target.y += deltaY;
}

// Zoom camera
WorldRenderer.prototype.zoomCamera = function(deltaY)
{
  var scale = Math.min(Math.max(this.camera.scale.x + deltaY, this.minScale), this.maxScale);
  
  this.camera.scale.x = scale;
  this.camera.scale.y = scale;
};