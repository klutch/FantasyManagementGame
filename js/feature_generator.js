var FeatureGenerator = function(world, seed)
{
  this.world = world;
  this.seed = seed;
};

FeatureGenerator.prototype.generatePlayerCastle = function()
{
  var found = false;
  var feature;
  
  while (!found)
  {
    var randRadius = getRandomInt(1800, 2200);
    var randAngle = Math.random() * Math.PI * 2;
    var randX = Math.floor(Math.cos(randAngle) * randRadius);
    var randY = Math.floor(Math.sin(randAngle) * randRadius);
    var giveUp = false;
    
    for (var i = randX; i < randX + 8; i++)
    {
      for (var j = randY; j < randY + 8; j++)
      {
        var tile = this.world.getTile(i, j);
        
        if (tile.type != TileType.Plains)
        {
          giveUp = true;
          break;
        }
      }
      if (giveUp)
      {
        break;
      }
    }
    
    if (!giveUp)
    {
      found = true;
      this.world.playerCastleX = randX;
      this.world.playerCastleY = randY;
    }
  }
  
  // Create feature
  feature = this.world.createFeature(FeatureType.PlayerCastle, this.world.playerCastleX, this.world.playerCastleY, 8, 8);
  
  // Hook feature up to tiles
  for (var i = 0; i < 8; i++)
  {
    for (var j = 0; j < 8; j++)
    {
      var tile = this.world.getTile(this.world.playerCastleX + i, this.world.playerCastleY + j);
      
      tile.featureId = feature.id;
      tile.featureTextureI = i;
      tile.featureTextureJ = j;
    }
  }
};