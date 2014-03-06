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
  this.assetPaths.featureTiles[FeatureType.Castle] = {};
  this.assetPaths.featureTiles[FeatureType.Castle][CastleType.Player] = [];
  for (var i = 0; i < 64; i++)
  {
    this.assetPaths.featureTiles[FeatureType.Castle][CastleType.Player].push("img/tiles/player_castle_" + i + ".png");
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
  this.assetPaths.ui.black = ["img/ui/black.png"];
  this.assetPaths.ui.logo = ["img/ui/logo.png"];
  this.assetPaths.ui.font = ["fonts/pixelmix.fnt"];
  this.assetPaths.ui.smallFont = ["fonts/small_pixelmix.fnt"];
  this.assetPaths.ui.mainMenuButtons = [
    "img/ui/button_0_normal.png",
    "img/ui/button_0_hover.png"
  ];
  this.assetPaths.ui.homeCastleButtons = [
    "img/ui/home_button.png"
  ];
  this.assetPaths.ui.progressBar = [
    "img/ui/progress_bar_fill.png",
    "img/ui/progress_bar_border.png"
  ];
  this.assetPaths.ui.resourceIndicatorBg = ["img/ui/resource_indicator.png"];
  this.assetPaths.ui.resources = {};
  this.assetPaths.ui.resources[ResourceType.Gold] = ["img/ui/resource_gold.png"];
  this.assetPaths.ui.resources[ResourceType.Logs] = ["img/ui/resource_logs.png"];
  this.assetPaths.ui.resources[ResourceType.Stone] = ["img/ui/resource_stone.png"];
  this.assetPaths.ui.resources[ResourceType.IronOre] = ["img/ui/resource_iron_ore.png"];
  this.assetPaths.ui.resources[ResourceType.ChromiteOre] = ["img/ui/resource_chromite_ore.png"];
  this.assetPaths.ui.resources[ResourceType.PlatinumOre] = ["img/ui/resource_platinum_ore.png"];
  this.assetPaths.ui.resources[ResourceType.RoughQuartz] = ["img/ui/resource_rough_quartz.png"];
  this.assetPaths.ui.resources[ResourceType.RoughDiamond] = ["img/ui/resource_rough_diamond.png"];
  this.assetPaths.ui.resources[ResourceType.RoughXenotime] = ["img/ui/resource_rough_xenotime.png"];
  this.assetPaths.ui.resources[ResourceType.Planks] = ["img/ui/resource_planks.png"];
  this.assetPaths.ui.resources[ResourceType.Bricks] = ["img/ui/resource_bricks.png"];
  this.assetPaths.ui.resources[ResourceType.IronIngot] = ["img/ui/resource_iron_ingot.png"];
  this.assetPaths.ui.resources[ResourceType.ChromiumIngot] = ["img/ui/resource_chromium_ingot.png"];
  this.assetPaths.ui.resources[ResourceType.PlatinumIngot] = ["img/ui/resource_platinum_ingot.png"];
  this.assetPaths.ui.resources[ResourceType.Quartz] = ["img/ui/resource_quartz.png"];
  this.assetPaths.ui.resources[ResourceType.Diamond] = ["img/ui/resource_diamond.png"];
  this.assetPaths.ui.resources[ResourceType.Xenotime] = ["img/ui/resource_xenotime.png"];
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