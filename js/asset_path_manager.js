var AssetPathManager = function()
{
  this.textureAssetPaths = {};
  this.textureAssetPaths.blank = "img/blank.png";
  this.textureAssetPaths.debugTileSelection = "img/selected_tile.png";
  this.textureAssetPaths.fog = "img/fog_0.png";
  this.textureAssetPaths.plains = [
    "img/plains_0.png",
    "img/plains_1.png",
    "img/plains_2.png"
  ];
  this.textureAssetPaths.forest = [
    "img/forest_0.png",
    "img/forest_1.png"
  ];
  this.textureAssetPaths.swamp = [
    "img/swamp_0.png"
  ];
  this.textureAssetPaths.mountains = [
    "img/mountains_0.png"
  ];
  this.textureAssetPaths.hills = [
    "img/hills_0.png"
  ];
  this.textureAssetPaths.snow = [
    "img/snow_0.png"
  ];
  this.textureAssetPaths.desert = [
    "img/desert_0.png"
  ];
  this.textureAssetPaths.water = [
    "img/water_0.png"
  ];
  this.textureAssetPaths.playerCastle = [];
  for (var i = 0; i < 64; i++)
  {
    this.textureAssetPaths.playerCastle.push("img/player_castle_" + i + ".png");
  }
  this.textureAssetPaths.town = [
    "img/town_0.png",
    "img/town_1.png",
    "img/town_2.png",
    "img/town_3.png"
  ];
  this.textureAssetPaths.grove = [
    "img/grove_0.png",
    "img/grove_1.png",
    "img/grove_2.png",
    "img/grove_3.png"
  ];
  this.textureAssetPaths.cave = [];
  for (var i = 0; i < 9; i++)
  {
    this.textureAssetPaths.cave.push("img/cave_dungeon_" + i + ".png");
  }
  this.textureAssetPaths.tavern = [];
  for (var i = 0; i < 6; i++)
  {
    this.textureAssetPaths.tavern.push("img/tavern_" + i + ".png");
  }
  this.textureAssetPaths.road = [
    "img/road_0.png"
  ];
};

AssetPathManager.prototype.preload = function(onComplete)
{
  var assetsToLoad = [];
  var assetLoader;
  
  for (var key in this.textureAssetPaths)
  {
    if (this.textureAssetPaths.hasOwnProperty(key))
    {
      var value = this.textureAssetPaths[key];
      
      if (value instanceof Array)
      {
        for (var i = 0; i < value.length; i++)
        {
          assetsToLoad.push(value[i]);
        }
      }
      else
      {
        assetsToLoad.push(value);
      }
    }
  }
  assetLoader = new PIXI.AssetLoader(assetsToLoad);
  assetLoader.onComplete = onComplete;
  assetLoader.load();
};