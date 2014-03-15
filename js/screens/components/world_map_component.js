var WorldMapComponent = function()
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.halfScreen = new PIXI.Point(game.containerWidth * 0.5, game.containerHeight * 0.5);
  this.camera = new PIXI.DisplayObjectContainer();
  this.camera.targetPosition = new PIXI.Point(this.camera.position.x, this.camera.position.y);
  this.camera.targetScale = 0.5;
  this.chunkSprites = {};
  this.position.x = this.halfScreen.x;
  this.position.y = this.halfScreen.y;
  this.z = 0;
  this.debugGridI = 0;
  this.debugGridJ = 0;
  this.debugSelection = new PIXI.Sprite(PIXI.Texture.fromImage(assetPathManager.assetPaths.tiles.debugTileSelection));
  this.minScale = 0.05;
  this.maxScale = 1;
  this.detectionBuffer = 1;   // Number of chunks surrounding the current chunk to check
  this.generationBuffer = 4;  // Number of chunks surrounding the current chunk to generate
  this.chunksToGenerate = []; // Array of coordinate pairs ([x, y]) that need to be generated
  this.totalChunksToGenerate = 0;
  this.tilesToDraw = [];
  this.tilePosition = new PIXI.Point(0, 0); // Reusable position. Used in drawTile()
  
  // Create terrain sprites
  this.terrainSprites = {};
  _.each(TileType, function(type)
    {
      this.terrainSprites[type] = [];
      _.each(assetPathManager.assetPaths.terrainTiles[type], function(path)
        {
          this.terrainSprites[type].push(PIXI.Sprite.fromImage(path));
        },
        this);
    },
    this);
  
  // Create transition sprites
  this.transitionSprites = {};
  _.each(TileType, function(type)
    {
      this.transitionSprites[type] = [];
      for (var i = 0; i < 32; i++)
      {
        if (i == 16) { continue; }
        this.transitionSprites[type][i] = PIXI.Sprite.fromImage(assetPathManager.assetPaths.transitionTiles[type][i]);
      }
    },
    this);
  
  // Create feature sprites
  this.featureSprites = {};
  _.each(FeatureType, function(featureType)
  {
    var subTypes = FeatureTypeList[featureType];
    
    this.featureSprites[featureType] = {};
    _.each(subTypes, function(subType)
    {
      this.featureSprites[featureType][subType] = [];
      _.each(assetPathManager.assetPaths.featureTiles[featureType][subType], function(path)
      {
        this.featureSprites[featureType][subType].push(PIXI.Sprite.fromImage(path));
      },
      this);
    },
    this);
  },
  this);
};

WorldMapComponent.prototype = new PIXI.DisplayObjectContainer;

// Get chunk, given a tile coordinate
WorldMapComponent.prototype.getChunkI = function(i) { return Math.floor(i / CHUNK_SIZE); };
WorldMapComponent.prototype.getChunkJ = function(j) { return Math.floor(j / CHUNK_SIZE); };

// Get terrain tile sprites
WorldMapComponent.prototype.getTileSprite = function(tile)
{
  var type = tile.type;
  var tilesList = this.terrainSprites[type];
  
  return tilesList[Math.floor(Math.random() * tilesList.length)];
};

// Get feature tile sprites
WorldMapComponent.prototype.getFeatureSprite = function(feature, textureI, textureJ)
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
WorldMapComponent.prototype.getBiomeTint = function(biomeType)
{
  if (biomeType == BiomeType.Tundra) return 0x00ffff; //#00ffff
  else if (biomeType == BiomeType.Taiga) return 0xff00ff; //#ff00ff
  else if (biomeType == BiomeType.Temperate) return 0x00ff00; //#00ff00
  else if (biomeType == BiomeType.Tropical) return 0x555555; //#555555
  else if (biomeType == BiomeType.Desert) return 0xffff00; //#ffff00
};

// Get tile tint
WorldMapComponent.prototype.getTileTint = function(tileType)
{
  if (tileType == TileType.Plains) return 0x74565a; //#74565a
  else if (tileType == TileType.Snow) return 0xffffff; //#ffffff;
  else if (tileType == TileType.Forest) return 0x42ff00; //#42ff00
  else if (tileType == TileType.Grassland) return 0x4e7918; //#4e7918
  else if (tileType == TileType.Swamp) return 0x273909; //#273909
  else if (tileType == TileType.Arid) return 0x736357; //#736357
  else if (tileType == TileType.Sand) return 0xcaac63; //#caac63
  else if (tileType == TileType.Mountain) return 0x545454; //#545454
  else if (tileType == TileType.Water) return 0x183f6d; //#183f6d
  else if (tileType == TileType.Road) return 0x8c6239; //#8c6239
  console.error("couldn't get tile tint");
};

// Does a chunk exist?
WorldMapComponent.prototype.doesChunkExist = function(chunkI, chunkJ)
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
WorldMapComponent.prototype.generateChunkSprite = function(chunkI, chunkJ)
{
  var renderTexture = new PIXI.RenderTexture(CHUNK_SIZE * TILE_SIZE, CHUNK_SIZE * TILE_SIZE);
  var chunkSprite = new PIXI.Sprite(renderTexture);
  
  chunkSprite.position.x = chunkI * CHUNK_SIZE * TILE_SIZE;
  chunkSprite.position.y = chunkJ * CHUNK_SIZE * TILE_SIZE;
  
  if (this.chunkSprites[chunkI] == null)
  {
    this.chunkSprites[chunkI] = {};
  }
  
  this.chunkSprites[chunkI][chunkJ] = chunkSprite;
  this.addChildAt(chunkSprite, 0);
  
  return chunkSprite;
};

// Get edge transition sprite
WorldMapComponent.prototype.getEdgeTransition = function(baseTileType, tileType, tileI, tileJ)
{
  var index = 0;
  var sprite;
  
  if (worldManager.getOrCreateTile(tileI - 1, tileJ).type == tileType)
  {
    index += 1;
  }
  if (worldManager.getOrCreateTile(tileI, tileJ - 1).type == tileType)
  {
    index += 2;
  }
  if (worldManager.getOrCreateTile(tileI + 1, tileJ).type == tileType)
  {
    index += 4;
  }
  if (worldManager.getOrCreateTile(tileI, tileJ + 1).type == tileType)
  {
    index += 8;
  }
  
  if (index > 0)
  {
    sprite = this.transitionSprites[tileType][index];
    //sprite.tint = this.getTileTint(tileType);
    return sprite;
  }
  return null;
};

// Get corner transition sprite
WorldMapComponent.prototype.getCornerTransition = function(baseTileType, tileType, tileI, tileJ)
{
  var index = 0;
  var sprite;
  
  if (worldManager.getOrCreateTile(tileI - 1, tileJ - 1).type == tileType)
  {
    index += 1;
  }
  if (worldManager.getOrCreateTile(tileI + 1, tileJ - 1).type == tileType)
  {
    index += 2;
  }
  if (worldManager.getOrCreateTile(tileI + 1, tileJ + 1).type == tileType)
  {
    index += 4;
  }
  if (worldManager.getOrCreateTile(tileI - 1, tileJ + 1).type == tileType)
  {
    index += 8;
  }
  
  if (index > 0)
  {
    sprite = this.transitionSprites[tileType][index + 16];
    //sprite.tint = this.getTileTint(tileType);
    return sprite;
  }
  return null;
};

// Convert screen coordinates to world tile
WorldMapComponent.prototype.convertScreenToWorldX = function(x) { return (x - this.position.x) / this.camera.scale.x; };
WorldMapComponent.prototype.convertScreenToWorldY = function(y) { return (y - this.position.y) / this.camera.scale.y; };

// Add tiles to draw
WorldMapComponent.prototype.addTileToDraw = function(i, j)
{
  this.tilesToDraw.push([i, j]);
};

// Draw a tile
WorldMapComponent.prototype.drawTile = function(i, j)
{
  var chunkI = this.getChunkI(i);
  var chunkJ = this.getChunkJ(j);
  var tile = worldManager.getTile(i, j);
  var tileSprite = this.getTileSprite(tile);
  var chunkSprite = this.doesChunkExist(chunkI, chunkJ) ? this.chunkSprites[chunkI][chunkJ] : this.generateChunkSprite(chunkI, chunkJ);
  var color;
  
  // Calculate position
  this.tilePosition.x = (i - chunkI * CHUNK_SIZE) * TILE_SIZE;
  this.tilePosition.y = (j - chunkJ * CHUNK_SIZE) * TILE_SIZE;
  
  // Draw base sprite
  chunkSprite.texture.render(tileSprite, this.tilePosition);
  
  // Draw transitions
  for (var height = Number(tile.type) + 1; height < NUM_TERRAIN_TYPES + 1; height++)
  {
    var edgeTransition;
    var cornerTransition;
    
    // BUG: Corner transitions are drawn in situations where they shouldn't be. A temporary fix is to draw it under the sides.
    if ((cornerTransition = this.getCornerTransition(tile.type, height, i, j)) != null)
    {
      chunkSprite.texture.render(cornerTransition, this.tilePosition);
    }
    if ((edgeTransition = this.getEdgeTransition(tile.type, height, i, j)) != null)
    {
      chunkSprite.texture.render(edgeTransition, this.tilePosition);
    }
  }

  // Render feature tile
  if (tile.featureId != null)
  {
    var feature = worldManager.world.features[tile.featureId];
    var featureSprite = this.getFeatureSprite(feature, tile.featureTextureI, tile.featureTextureJ);
    
    chunkSprite.texture.render(featureSprite, this.tilePosition);
  }
};

// Move the camera to a new position
WorldMapComponent.prototype.moveCamera = function(deltaX, deltaY)
{
  this.camera.targetPosition.x += deltaX;
  this.camera.targetPosition.y += deltaY;
}

// Move the camera to the home castle
WorldMapComponent.prototype.moveCameraToHome = function()
{
  this.camera.targetPosition.x = (worldManager.world.playerCastleI + 2) * TILE_SIZE;
  this.camera.targetPosition.y = (worldManager.world.playerCastleJ + 2) * TILE_SIZE;
};

// Set camera position
WorldMapComponent.prototype.setCamera = function(x, y)
{
  this.camera.position.x = x;
  this.camera.position.y = y;
  this.camera.targetPosition.x = x;
  this.camera.targetPosition.y = y;
};

// Zoom camera
WorldMapComponent.prototype.zoomCamera = function(deltaY)
{
  var scale = Math.min(Math.max(this.camera.targetScale + deltaY, this.minScale), this.maxScale);
  
  this.camera.targetScale = scale;
};

// Draw tiles
WorldMapComponent.prototype.drawTiles = function()
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

WorldMapComponent.prototype.update = function()
{
  // Ease position towards target position
  this.camera.position.x += (this.camera.targetPosition.x - this.camera.position.x) / 8;
  this.camera.position.y += (this.camera.targetPosition.y - this.camera.position.y) / 8;

  // Ease scale towards target scale
  this.camera.scale.x += (this.camera.targetScale - this.camera.scale.x) / 8;
  this.camera.scale.y = this.camera.scale.x;

  // Update position and scale
  this.position.x = (-this.camera.position.x * this.camera.scale.x) + this.halfScreen.x;
  this.position.y = (-this.camera.position.y * this.camera.scale.y) + this.halfScreen.y;
  this.scale.x = this.camera.scale.x;
  this.scale.y = this.camera.scale.y;

  // Debug...
  this.debugGridI = worldManager.getGridI(this.convertScreenToWorldX(inputManager.mousePosition.x));
  this.debugGridJ = worldManager.getGridJ(this.convertScreenToWorldY(inputManager.mousePosition.y));
  this.debugSelection.position.x = this.debugGridI * TILE_SIZE;
  this.debugSelection.position.y = this.debugGridJ * TILE_SIZE;
  
  // Draw tiles
  this.drawTiles();
};