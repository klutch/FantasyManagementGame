// WorldRenderer constructor
var WorldRenderer = function()
{
  var root = this; // Need this for _.each loops... TODO: Learn javascript.
  
  this.world = game.world;
  this.halfScreen = new PIXI.Point(game.containerWidth * 0.5, game.containerHeight * 0.5);
  this.camera = new PIXI.DisplayObjectContainer();
  this.camera.position.x = (this.world.playerCastleI + 4) * 16;
  this.camera.position.y = (this.world.playerCastleJ + 4) * 16;
  this.camera.targetPosition = new PIXI.Point(this.camera.position.x, this.camera.position.y);
  this.camera.targetScale = 1;
  this.chunkSprites = {};
  this.container = new PIXI.DisplayObjectContainer();
  this.container.position.x = this.halfScreen.x;
  this.container.position.y = this.halfScreen.y;
  this.debugGridI = 0;
  this.debugGridJ = 0;
  this.debugSelection = new PIXI.Sprite(PIXI.Texture.fromImage(assetPathManager.assetPaths.tiles.debugTileSelection));
  this.minScale = 0.05;
  this.maxScale = 2;
  this.detectionBuffer = 1;   // Number of chunks surrounding the current chunk to check
  this.generationBuffer = 4;  // Number of chunks surrounding the current chunk to generate
  this.chunksToGenerate = []; // Array of coordinate pairs ([x, y]) that need to be generated
  this.totalChunksToGenerate = 0;
  this.tilesToDraw = [];
  this.tilePosition = new PIXI.Point(0, 0); // Reusable position. Used in drawTile()
  
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

// Get biome tint
WorldRenderer.prototype.getBiomeTint = function(biomeType)
{
  if (biomeType == BiomeType.Tundra)
  {
    return 0x00ffff;
    // return '#00ffff';
  }
  else if (biomeType == BiomeType.Taiga)
  {
    return 0xff00ff;
    // return '#ff00ff';
  }
  else if (biomeType == BiomeType.Temperate)
  {
    return 0x00ff00;
    // return '#00ff00';
  }
  else if (biomeType == BiomeType.Tropical)
  {
    return 0x555555;
    // return '#555555';
  }
  else if (biomeType == BiomeType.Desert)
  {
    return 0xffff00;
    // return '#ffff00';
  }
};

// Does a chunk exist?
WorldRenderer.prototype.doesChunkExist = function(chunkI, chunkJ)
{
  if (this.chunkSprites[chunkI] == null)
  {
    return false;
  }
  if (this.chunkSprites[chunkI][chunkJ] == null)
  {
    return false;
  }
  
  return true;
};

// Generate a chunk sprite
WorldRenderer.prototype.generateChunkSprite = function(chunkI, chunkJ)
{
  var renderTexture = new PIXI.RenderTexture(chunkSize * tileSize, chunkSize * tileSize);
  var chunkSprite = new PIXI.Sprite(renderTexture);
  
  chunkSprite.position.x = chunkI * chunkSize * tileSize;
  chunkSprite.position.y = chunkJ * chunkSize * tileSize;
  
  if (this.chunkSprites[chunkI] == null)
  {
    this.chunkSprites[chunkI] = {};
  }
  
  this.chunkSprites[chunkI][chunkJ] = chunkSprite;
  this.container.addChildAt(chunkSprite, 0);
  
  return chunkSprite;
};

// Add tiles to draw
WorldRenderer.prototype.addTileToDraw = function(i, j)
{
  this.tilesToDraw.push([i, j]);
};

// Draw tiles
WorldRenderer.prototype.drawTile = function(i, j)
{
  var chunkI = this.getChunkI(i);
  var chunkJ = this.getChunkJ(j);
  var tile = this.world.getTile(i, j);
  var tileSprite = this.getTileSprite(tile);
  var chunkSprite = this.doesChunkExist(chunkI, chunkJ) ? this.chunkSprites[chunkI][chunkJ] : this.generateChunkSprite(chunkI, chunkJ);
  var color;
  
  // Calculate position
  this.tilePosition.x = (i - chunkI * chunkSize) * tileSize;
  this.tilePosition.y = (j - chunkJ * chunkSize) * tileSize;

  // Calculate tint
  //tileSprite.tint = this.getBiomeTint(tile.biomeType);
  if (tile.type == TileType.Mountain)
  {
    color = Math.floor(tile.elevation * tile.elevation * tile.elevation * 255).toString(16)
    color = color.length < 2 ? ('0' + color) : color;
    tileSprite.tint = '0x' + color + color + color;
  }

  chunkSprite.texture.render(tileSprite, this.tilePosition);

  // Render feature tile
  if (tile.featureId != null)
  {
    var feature = this.world.features[tile.featureId];
    var featureSprite = this.getFeatureSprite(feature, tile.featureTextureI, tile.featureTextureJ);
    
    chunkSprite.texture.render(featureSprite, this.tilePosition);
  }
};

// Move the camera to a new position
WorldRenderer.prototype.moveCamera = function(deltaX, deltaY)
{
  this.camera.targetPosition.x += deltaX;
  this.camera.targetPosition.y += deltaY;
}

// Move the camera to the home castle
WorldRenderer.prototype.moveCameraToHome = function()
{
  this.camera.targetPosition.x = (this.world.playerCastleI + 4) * tileSize;
  this.camera.targetPosition.y = (this.world.playerCastleJ + 4) * tileSize;
};

// Set camera position
WorldRenderer.prototype.setCamera = function(x, y)
{
  this.camera.position.x = x;
  this.camera.position.y = y;
  this.camera.targetPosition.x = x;
  this.camera.targetPosition.y = y;
};

// Zoom camera
WorldRenderer.prototype.zoomCamera = function(deltaY)
{
  var scale = Math.min(Math.max(this.camera.targetScale + deltaY, this.minScale), this.maxScale);
  
  this.camera.targetScale = scale;
};

// Draw tiles
WorldRenderer.prototype.drawTiles = function()
{
  if (this.tilesToDraw.length > 0)
  {
    for (var n = 0; n < this.tilesToDraw.length; n++)
    {
      var coords = this.tilesToDraw[n];

      this.drawTile(coords[0], coords[1]);
    }

    this.tilesToDraw.length = 0;
  }
};

// Update
WorldRenderer.prototype.update = function()
{
  // Ease position towards target position
  this.camera.position.x += (this.camera.targetPosition.x - this.camera.position.x) / 8;
  this.camera.position.y += (this.camera.targetPosition.y - this.camera.position.y) / 8;

  // Ease scale towards target scale
  this.camera.scale.x += (this.camera.targetScale - this.camera.scale.x) / 8;
  this.camera.scale.y = this.camera.scale.x;

  // Update container position and scale
  this.container.position.x = (-this.camera.position.x * this.camera.scale.x) + this.halfScreen.x;
  this.container.position.y = (-this.camera.position.y * this.camera.scale.y) + this.halfScreen.y;
  this.container.scale.x = this.camera.scale.x;
  this.container.scale.y = this.camera.scale.y;

  // Debug...
  this.debugSelection.position.x = this.debugGridI * tileSize;
  this.debugSelection.position.y = this.debugGridJ * tileSize;
  
  // Draw tiles
  this.drawTiles();
};