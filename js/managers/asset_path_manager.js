var AssetPathManager = function()
{
  this.assetPaths = {};
  
  // Terrain assets
  this.assetPaths.tiles = {};
  this.assetPaths.tiles.blank = ["img/tiles/blank.png"];
  this.assetPaths.tiles.tileSelection = ["img/tiles/selected_tile.png"];
  this.assetPaths.tiles.fog = ["img/tiles/fog_0.png"];
  this.assetPaths.tiles.white = ["img/tiles/white.png"];
  this.assetPaths.terrainTiles = {};
  this.assetPaths.transitionTiles = {};
  this.assetPaths.terrainTiles[TileType.Plains] = [
    "img/tiles/plains_0.png",
    "img/tiles/plains_1.png",
    "img/tiles/plains_2.png",
    "img/tiles/plains_3.png",
    "img/tiles/plains_4.png",
    "img/tiles/plains_5.png",
    "img/tiles/plains_6.png",
    "img/tiles/plains_7.png"
  ];
  this.assetPaths.terrainTiles[TileType.Snow] = [
    "img/tiles/snow_0.png",
    "img/tiles/snow_1.png",
    "img/tiles/snow_2.png",
    "img/tiles/snow_3.png",
    "img/tiles/snow_4.png",
    "img/tiles/snow_5.png",
    "img/tiles/snow_6.png",
    "img/tiles/snow_7.png"
  ];
  this.assetPaths.terrainTiles[TileType.Forest] = [
    "img/tiles/forest_0.png",
    "img/tiles/forest_0.png",
    "img/tiles/forest_0.png",
    "img/tiles/forest_1.png",
    "img/tiles/forest_2.png",
    "img/tiles/forest_3.png",
    "img/tiles/forest_4.png"
  ];
  this.assetPaths.terrainTiles[TileType.Grassland] = [
    "img/tiles/grassland_0.png",
    "img/tiles/grassland_1.png",
    "img/tiles/grassland_2.png",
    "img/tiles/grassland_3.png",
    "img/tiles/grassland_4.png",
    "img/tiles/grassland_5.png",
    "img/tiles/grassland_6.png",
    "img/tiles/grassland_7.png"
  ];
  this.assetPaths.terrainTiles[TileType.Swamp] = [
    "img/tiles/swamp_0.png",
    "img/tiles/swamp_0.png",
    "img/tiles/swamp_0.png",
    "img/tiles/swamp_0.png",
    "img/tiles/swamp_1.png",
    "img/tiles/swamp_2.png",
    "img/tiles/swamp_3.png",
    "img/tiles/swamp_4.png",
    "img/tiles/swamp_5.png",
    "img/tiles/swamp_6.png"
  ];
  this.assetPaths.terrainTiles[TileType.Arid] = [
    "img/tiles/arid_0.png",
    "img/tiles/arid_1.png",
    "img/tiles/arid_2.png",
    "img/tiles/arid_3.png",
    "img/tiles/arid_4.png",
    "img/tiles/arid_5.png",
    "img/tiles/arid_6.png",
    "img/tiles/arid_7.png"
  ];
  this.assetPaths.terrainTiles[TileType.Sand] = [
    "img/tiles/sand_0.png"
  ];
  this.assetPaths.terrainTiles[TileType.Mountain] = [
    "img/tiles/mountains_0.png"
  ];
  this.assetPaths.terrainTiles[TileType.Water] = [
    "img/tiles/water_0.png"
  ];
  this.assetPaths.terrainTiles[TileType.Road] = [
    "img/tiles/road_0.png",
    "img/tiles/road_1.png"
  ];
  
  // Terrain transitions
  this.assetPaths.transitionTiles[TileType.Plains] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.assetPaths.transitionTiles[TileType.Plains][i] = "img/tiles/plains_x_" + i + ".png";
  }
  this.assetPaths.transitionTiles[TileType.Snow] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.assetPaths.transitionTiles[TileType.Snow][i] = "img/tiles/snow_x_" + i + ".png";
  }
  this.assetPaths.transitionTiles[TileType.Forest] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.assetPaths.transitionTiles[TileType.Forest][i] = "img/tiles/forest_x_" + i + ".png";
  }
  this.assetPaths.transitionTiles[TileType.Grassland] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.assetPaths.transitionTiles[TileType.Grassland][i] = "img/tiles/grassland_x_" + i + ".png";
  }
  this.assetPaths.transitionTiles[TileType.Swamp] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.assetPaths.transitionTiles[TileType.Swamp][i] = "img/tiles/swamp_x_" + i + ".png";
  }
  this.assetPaths.transitionTiles[TileType.Arid] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.assetPaths.transitionTiles[TileType.Arid][i] = "img/tiles/arid_x_" + i + ".png";
  }
  this.assetPaths.transitionTiles[TileType.Sand] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.assetPaths.transitionTiles[TileType.Sand][i] = "img/tiles/sand_x_" + i + ".png";
  }
  this.assetPaths.transitionTiles[TileType.Mountain] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.assetPaths.transitionTiles[TileType.Mountain][i] = "img/tiles/mountain_x_" + i + ".png";
  }
  this.assetPaths.transitionTiles[TileType.Water] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.assetPaths.transitionTiles[TileType.Water][i] = "img/tiles/template_x_" + i + ".png";
  }
  this.assetPaths.transitionTiles[TileType.Road] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.assetPaths.transitionTiles[TileType.Road][i] = "img/tiles/road_x_" + i + ".png";
  }
  
  // Player castle assets
  this.assetPaths.featureTiles = {};
  this.assetPaths.featureTiles[FeatureType.Castle] = {};
  this.assetPaths.featureTiles[FeatureType.Castle][CastleType.Player] = [];
  for (var i = 0; i < 16; i++)
  {
    this.assetPaths.featureTiles[FeatureType.Castle][CastleType.Player].push("img/tiles/castle_" + i + ".png");
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
  this.assetPaths.featureTiles[FeatureType.Dungeon][DungeonType.Cave] = [
    "img/tiles/cave_dungeon_0.png",
    "img/tiles/cave_dungeon_1.png",
    "img/tiles/cave_dungeon_2.png",
    "img/tiles/cave_dungeon_3.png"
  ];
  
  // Gathering assets
  this.assetPaths.featureTiles[FeatureType.Gathering] = {};
  this.assetPaths.featureTiles[FeatureType.Gathering][GatheringType.Tavern] = [
    "img/tiles/tavern_0.png",
    "img/tiles/tavern_1.png",
  ];
  
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
  this.assetPaths.ui.panelBg = ["img/ui/panel_bg.png"];
  this.assetPaths.ui.black = ["img/ui/black.png"];
  this.assetPaths.ui.logo = ["img/ui/logo.png"];
  this.assetPaths.ui.bigFont = ["fonts/big_pixelmix.fnt"];
  this.assetPaths.ui.smallFont = ["fonts/small_pixelmix.fnt"];
  this.assetPaths.ui.mainMenuButtons = [
    "img/ui/button_0_normal.png",
    "img/ui/button_0_over.png"
  ];
  this.assetPaths.ui.homeCastleButtons = [
    "img/ui/home_button.png"
  ];
  this.assetPaths.ui.groupButtons = [
    "img/ui/group_button.png",
    "img/ui/group_button_over.png"
  ];
  this.assetPaths.ui.endTurnButtons = [
    "img/ui/end_turn_button.png",
    "img/ui/end_turn_button_over.png"
  ];
  this.assetPaths.ui.progressBar = [
    "img/ui/progress_bar_fill.png",
    "img/ui/progress_bar_border.png"
  ];
  this.assetPaths.ui.standardButtons = [
    "img/ui/standard_button.png",
    "img/ui/standard_button_over.png",
    "img/ui/standard_button_disabled.png"
  ];
  this.assetPaths.ui.transparent = ["img/ui/transparent.png"];
  this.assetPaths.ui.divider = ["img/ui/divider.png"];
  this.assetPaths.ui.groupNameButtons = [
    "img/ui/group_name.png",
    "img/ui/group_name_over.png"
  ];
  this.assetPaths.ui.travelOrderButtons = [
    "img/ui/travel_order_button.png",
    "img/ui/travel_order_button.png",
    "img/ui/travel_order_button_disabled.png"
  ];
  this.assetPaths.ui.cancelOrderButtons = [
    "img/ui/cancel_order_button.png",
    "img/ui/cancel_order_button.png",
    "img/ui/cancel_order_button_disabled.png"
  ];
  this.assetPaths.ui.ordersMenuButtons = [
    "img/ui/orders_menu_button.png",
    "img/ui/orders_menu_button.png",
    "img/ui/orders_menu_button_disabled.png"
  ];
  this.assetPaths.ui.partyIcons = ["img/ui/party_icon.png"];
  this.assetPaths.ui.pathOverlay = ["img/ui/path_overlay.png"];
  this.assetPaths.ui.exploreOrderButtons = [
    "img/ui/explore_order_button.png",
    "img/ui/explore_order_button.png"
  ];
  this.assetPaths.ui.cutLogsOrderButtons = [
    "img/ui/cut_logs_order_button.png",
    "img/ui/cut_logs_order_button.png"
  ];
  this.assetPaths.ui.visitOrderButtons = [
    "img/ui/visit_order_button.png",
    "img/ui/visit_order_button.png"
  ];
  this.assetPaths.ui.combatOrderButtons = [
    "img/ui/combat_order_button.png",
    "img/ui/combat_order_button.png"
  ];
  this.assetPaths.ui.mineOrderButtons = [
    "img/ui/mine_order_button.png",
    "img/ui/mine_order_button.png"
  ];
  this.assetPaths.ui.closeButtons = [
    "img/ui/close_button.png",
    "img/ui/close_button_over.png"
  ];
  this.assetPaths.ui.submenuIcon = ["img/ui/submenu_icon.png"];
  this.assetPaths.ui.pathfinderDebugTile = ["img/ui/pathfinder_debug_tile.png"];
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
  this.assetPaths.ui.portraits = {};
  this.assetPaths.ui.portraits[AdventurerType.Worker] = ["img/ui/portraits/worker.png"];
  this.assetPaths.ui.portraits[AdventurerType.Archer] = ["img/ui/portraits/archer.png"];
  this.assetPaths.ui.portraits[AdventurerType.Knight] = ["img/ui/portraits/knight.png"];
  this.assetPaths.ui.portraits[AdventurerType.Healer] = ["img/ui/portraits/healer.png"];
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
    for (var i = 0; i < obj.length; i++)
    {
      if (obj[i] != undefined)
      {
        paths.push(obj[i]);
      }
    }
  }
  else if (obj instanceof Object)
  {
    _.each(obj, function(item) { paths = paths.concat(ugh.recursiveCollectPaths(item)); });
  }
  
  return paths;
};