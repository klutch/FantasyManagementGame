var AssetPathManager = function()
{
  this.assetPaths = {};
  
  // Terrain assets
  this.assetPaths.tiles = {};
  this.assetPaths.tiles.blank = "img/tiles/blank.png";
  this.assetPaths.tiles.debugTileSelection = "img/tiles/selected_tile.png";
  this.assetPaths.tiles.fog = "img/tiles/fog_0.png";
  this.assetPaths.terrainTiles = {};
  this.assetPaths.terrainTiles[TileType.Plains] = [
    "img/tiles/plains_0.png",
    "img/tiles/plains_1.png",
    "img/tiles/plains_2.png"
  ];
  this.assetPaths.terrainTiles[TileType.Forest] = [
    "img/tiles/forest_0.png",
    "img/tiles/forest_1.png"
  ];
  this.assetPaths.terrainTiles[TileType.Swamp] = [
    "img/tiles/swamp_0.png"
  ];
  this.assetPaths.terrainTiles[TileType.Mountains] = [
    "img/tiles/mountains_0.png"
  ];
  this.assetPaths.terrainTiles[TileType.Hills] = [
    "img/tiles/hills_0.png"
  ];
  this.assetPaths.terrainTiles[TileType.Snow] = [
    "img/tiles/snow_0.png"
  ];
  this.assetPaths.terrainTiles[TileType.Desert] = [
    "img/tiles/desert_0.png"
  ];
  this.assetPaths.terrainTiles[TileType.Water] = [
    "img/tiles/water_0.png"
  ];
  this.assetPaths.terrainTiles[TileType.Road] = [
    "img/tiles/road_0.png"
  ];
  
  // Player castle assets
  this.assetPaths.featureTiles = {};
  this.assetPaths.featureTiles[FeatureType.PlayerCastle] = {};
  this.assetPaths.featureTiles[FeatureType.PlayerCastle][FeatureType.PlayerCastle] = [];
  for (var i = 0; i < 64; i++)
  {
    this.assetPaths.featureTiles[FeatureType.PlayerCastle][FeatureType.PlayerCastle].push("img/tiles/player_castle_" + i + ".png");
  }
  
  // Dwelling assets
  this.assetPaths.featureTiles[FeatureType.Dwelling] = {};
  this.assetPaths.featureTiles[FeatureType.Dwelling][DwellingType.Town] = [
    "img/tiles/town_0.png",
    "img/tiles/town_1.png",
    "img/tiles/town_2.png",
    "img/tiles/town_3.png"
  ];
  this.assetPaths.featureTiles[FeatureType.Dwelling][DwellingType.Grove] = [
    "img/tiles/grove_0.png",
    "img/tiles/grove_1.png",
    "img/tiles/grove_2.png",
    "img/tiles/grove_3.png"
  ];
  
  // Dungeon assets
  this.assetPaths.featureTiles[FeatureType.Dungeon] = {};
  this.assetPaths.featureTiles[FeatureType.Dungeon][DungeonType.Cave] = [];
  for (var i = 0; i < 9; i++)
  {
    this.assetPaths.featureTiles[FeatureType.Dungeon][DungeonType.Cave].push("img/tiles/cave_dungeon_" + i + ".png");
  }
  
  // Gathering assets
  this.assetPaths.featureTiles[FeatureType.Gathering] = {};
  this.assetPaths.featureTiles[FeatureType.Gathering][GatheringType.Tavern] = [];
  for (var i = 0; i < 6; i++)
  {
    this.assetPaths.featureTiles[FeatureType.Gathering][GatheringType.Tavern].push("img/tiles/tavern_" + i + ".png");
  }
  
  // UI assets
  this.assetPaths.ui = {};
  this.assetPaths.ui.panelCorners = [
    "img/ui/panel_corner_0.png",
    "img/ui/panel_corner_1.png",
    "img/ui/panel_corner_2.png",
    "img/ui/panel_corner_3.png"
  ];
  this.assetPaths.ui.panelSides = [
    "img/ui/panel_side_0.png",
    "img/ui/panel_side_1.png",
    "img/ui/panel_side_2.png",
    "img/ui/panel_side_3.png"
  ];
  this.assetPaths.ui.panelBg = [
    "img/ui/panel_bg.png"
  ];
  this.assetPaths.ui.black = [
    "img/ui/black.png"
  ];
  this.assetPaths.ui.logo = [
    "img/ui/logo.png"
  ];
  this.assetPaths.ui.font = [
    "fonts/pixelmix.fnt"
  ];
  this.assetPaths.ui.mainMenuButtons = [
    "img/ui/button_0_normal.png",
    "img/ui/button_0_hover.png"
  ];
};

AssetPathManager.prototype.preload = function(onComplete)
{
  var assetsToLoad = this.recursiveCollectPaths(this.assetPaths);
  var assetLoader = new PIXI.AssetLoader(assetsToLoad);
  
  assetLoader.onComplete = onComplete;
  assetLoader.load();
};

AssetPathManager.prototype.recursiveCollectPaths = function(obj)
{
  var paths = [];
  var ugh = this;
  
  if (obj instanceof Array)
  {
    paths = paths.concat(obj);
  }
  else if (obj instanceof Object)
  {
    _.each(obj, function(item) { paths = paths.concat(ugh.recursiveCollectPaths(item)); });
  }
  
  return paths;
};