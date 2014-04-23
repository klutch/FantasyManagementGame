var AssetManager = function()
{
  this.paths = {};
  
  // Terrain assets
  this.paths.tiles = {};
  this.paths.tiles.blank = ["img/tiles/blank.png"];
  this.paths.tiles.tileSelection = ["img/tiles/selected_tile.png"];
  this.paths.tiles.fog = ["img/tiles/fog_0.png"];
  this.paths.tiles.white = ["img/tiles/white.png"];
  this.paths.terrainTiles = {};
  this.paths.transitionTiles = {};
  this.paths.terrainTiles[TileType.Plains] = [
    "img/tiles/plains_0.png",
    "img/tiles/plains_1.png",
    "img/tiles/plains_2.png",
    "img/tiles/plains_3.png",
    "img/tiles/plains_4.png",
    "img/tiles/plains_5.png",
    "img/tiles/plains_6.png",
    "img/tiles/plains_7.png"
  ];
  this.paths.terrainTiles[TileType.Snow] = [
    "img/tiles/snow_0.png",
    "img/tiles/snow_1.png",
    "img/tiles/snow_2.png",
    "img/tiles/snow_3.png",
    "img/tiles/snow_4.png",
    "img/tiles/snow_5.png",
    "img/tiles/snow_6.png",
    "img/tiles/snow_7.png"
  ];
  this.paths.terrainTiles[TileType.Forest] = [
    "img/tiles/forest_0.png",
    "img/tiles/forest_0.png",
    "img/tiles/forest_0.png",
    "img/tiles/forest_1.png",
    "img/tiles/forest_2.png",
    "img/tiles/forest_3.png",
    "img/tiles/forest_4.png"
  ];
  this.paths.terrainTiles[TileType.Grassland] = [
    "img/tiles/grassland_0.png",
    "img/tiles/grassland_1.png",
    "img/tiles/grassland_2.png",
    "img/tiles/grassland_3.png",
    "img/tiles/grassland_4.png",
    "img/tiles/grassland_5.png",
    "img/tiles/grassland_6.png",
    "img/tiles/grassland_7.png"
  ];
  this.paths.terrainTiles[TileType.Swamp] = [
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
  this.paths.terrainTiles[TileType.Arid] = [
    "img/tiles/arid_0.png",
    "img/tiles/arid_1.png",
    "img/tiles/arid_2.png",
    "img/tiles/arid_3.png",
    "img/tiles/arid_4.png",
    "img/tiles/arid_5.png",
    "img/tiles/arid_6.png",
    "img/tiles/arid_7.png"
  ];
  this.paths.terrainTiles[TileType.Sand] = [
    "img/tiles/sand_0.png"
  ];
  this.paths.terrainTiles[TileType.Mountain] = [
    "img/tiles/mountains_0.png"
  ];
  this.paths.terrainTiles[TileType.Water] = [
    "img/tiles/water_0.png"
  ];
  this.paths.terrainTiles[TileType.Road] = [
    "img/tiles/road_0.png",
    "img/tiles/road_1.png"
  ];
  
  // Terrain transitions
  this.paths.transitionTiles[TileType.Plains] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.paths.transitionTiles[TileType.Plains][i] = "img/tiles/plains_x_" + i + ".png";
  }
  this.paths.transitionTiles[TileType.Snow] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.paths.transitionTiles[TileType.Snow][i] = "img/tiles/snow_x_" + i + ".png";
  }
  this.paths.transitionTiles[TileType.Forest] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.paths.transitionTiles[TileType.Forest][i] = "img/tiles/forest_x_" + i + ".png";
  }
  this.paths.transitionTiles[TileType.Grassland] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.paths.transitionTiles[TileType.Grassland][i] = "img/tiles/grassland_x_" + i + ".png";
  }
  this.paths.transitionTiles[TileType.Swamp] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.paths.transitionTiles[TileType.Swamp][i] = "img/tiles/swamp_x_" + i + ".png";
  }
  this.paths.transitionTiles[TileType.Arid] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.paths.transitionTiles[TileType.Arid][i] = "img/tiles/arid_x_" + i + ".png";
  }
  this.paths.transitionTiles[TileType.Sand] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.paths.transitionTiles[TileType.Sand][i] = "img/tiles/sand_x_" + i + ".png";
  }
  this.paths.transitionTiles[TileType.Mountain] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.paths.transitionTiles[TileType.Mountain][i] = "img/tiles/mountain_x_" + i + ".png";
  }
  this.paths.transitionTiles[TileType.Water] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.paths.transitionTiles[TileType.Water][i] = "img/tiles/template_x_" + i + ".png";
  }
  this.paths.transitionTiles[TileType.Road] = [];
  for (var i = 1; i < 32; i++)
  {
    if (i == 16) { continue; }
    this.paths.transitionTiles[TileType.Road][i] = "img/tiles/road_x_" + i + ".png";
  }
  
  // Player castle assets
  this.paths.featureTiles = {};
  this.paths.featureTiles[FeatureType.Castle] = {};
  this.paths.featureTiles[FeatureType.Castle][CastleType.Player] = [];
  for (var i = 0; i < 16; i++)
  {
    this.paths.featureTiles[FeatureType.Castle][CastleType.Player].push("img/tiles/castle_" + i + ".png");
  }
  
  // Dwelling assets
  this.paths.featureTiles[FeatureType.Dwelling] = {};
  this.paths.featureTiles[FeatureType.Dwelling][DwellingType.Town] = [
    "img/tiles/town_0.png",
    "img/tiles/town_1.png",
    "img/tiles/town_2.png",
    "img/tiles/town_3.png"
  ];
  this.paths.featureTiles[FeatureType.Dwelling][DwellingType.Grove] = [
    "img/tiles/grove_0.png",
    "img/tiles/grove_1.png",
    "img/tiles/grove_2.png",
    "img/tiles/grove_3.png"
  ];
  
  // Dungeon assets
  this.paths.featureTiles[FeatureType.Dungeon] = {};
  this.paths.featureTiles[FeatureType.Dungeon][DungeonType.Cave] = [
    "img/tiles/cave_dungeon_0.png",
    "img/tiles/cave_dungeon_1.png",
    "img/tiles/cave_dungeon_2.png",
    "img/tiles/cave_dungeon_3.png"
  ];
  
  // Gathering assets
  this.paths.featureTiles[FeatureType.Gathering] = {};
  this.paths.featureTiles[FeatureType.Gathering][GatheringType.Tavern] = [
    "img/tiles/tavern_0.png",
    "img/tiles/tavern_1.png",
  ];
  
  // UI assets
  this.paths.ui = {};
  this.paths.ui.panelCorners = [
    "img/ui/panel_corner_0.png",
    "img/ui/panel_corner_1.png",
    "img/ui/panel_corner_2.png",
    "img/ui/panel_corner_3.png"
  ];
  this.paths.ui.panelSides = [
    "img/ui/panel_side_0.png",
    "img/ui/panel_side_1.png",
    "img/ui/panel_side_2.png",
    "img/ui/panel_side_3.png"
  ];
  this.paths.ui.panelBg = ["img/ui/panel_bg.png"];
  this.paths.ui.darkPanelCorners = [
    "img/ui/dark_panel_corner_0.png",
    "img/ui/dark_panel_corner_1.png",
    "img/ui/dark_panel_corner_2.png",
    "img/ui/dark_panel_corner_3.png"
  ];
  this.paths.ui.darkPanelSides = [
    "img/ui/dark_panel_side_0.png",
    "img/ui/dark_panel_side_1.png",
    "img/ui/dark_panel_side_2.png",
    "img/ui/dark_panel_side_3.png"
  ];
  this.paths.ui.darkPanelBg = ["img/ui/dark_panel_bg.png"];
  this.paths.ui.resizableButtonCorners = [
    "img/ui/resizable_button_corner_0.png",
    "img/ui/resizable_button_corner_1.png",
    "img/ui/resizable_button_corner_2.png",
    "img/ui/resizable_button_corner_3.png"
  ];
  this.paths.ui.resizableButtonSides = [
    "img/ui/resizable_button_side_0.png",
    "img/ui/resizable_button_side_1.png",
    "img/ui/resizable_button_side_2.png",
    "img/ui/resizable_button_side_3.png"
  ];
  this.paths.ui.resizableButtonBg = ["img/ui/resizable_button_bg.png"];
  this.paths.ui.resizableButtonCornersOver = [
    "img/ui/resizable_button_corner_over_0.png",
    "img/ui/resizable_button_corner_over_1.png",
    "img/ui/resizable_button_corner_over_2.png",
    "img/ui/resizable_button_corner_over_3.png"
  ];
  this.paths.ui.resizableButtonSidesOver = [
    "img/ui/resizable_button_side_over_0.png",
    "img/ui/resizable_button_side_over_1.png",
    "img/ui/resizable_button_side_over_2.png",
    "img/ui/resizable_button_side_over_3.png"
  ];
  this.paths.ui.resizableButtonBgOver = ["img/ui/resizable_button_bg_over.png"];
  this.paths.ui.resizableButtonCornersDisabled = [
    "img/ui/resizable_button_corner_disabled_0.png",
    "img/ui/resizable_button_corner_disabled_1.png",
    "img/ui/resizable_button_corner_disabled_2.png",
    "img/ui/resizable_button_corner_disabled_3.png"
  ];
  this.paths.ui.resizableButtonSidesDisabled = [
    "img/ui/resizable_button_side_disabled_0.png",
    "img/ui/resizable_button_side_disabled_1.png",
    "img/ui/resizable_button_side_disabled_2.png",
    "img/ui/resizable_button_side_disabled_3.png"
  ];
  this.paths.ui.resizableButtonBgDisabled = ["img/ui/resizable_button_bg_disabled.png"];
  this.paths.ui.scrollUpButtons = [
    "img/ui/scroll_up_arrow.png",
    "img/ui/scroll_up_arrow_over.png"
  ];
  this.paths.ui.scrollDownButtons = [
    "img/ui/scroll_down_arrow.png",
    "img/ui/scroll_down_arrow_over.png"
  ];
  this.paths.ui.scrollbar = ["img/ui/scrollbar.png"];
  this.paths.ui.scrollbarDot = ["img/ui/scrollbar_dot.png"];
  this.paths.ui.black = ["img/ui/black.png"];
  this.paths.ui.logo = ["img/ui/logo.png"];
  this.paths.ui.bigFont = ["fonts/big_pixelmix.fnt"];
  this.paths.ui.smallFont = ["fonts/small_pixelmix.fnt"];
  this.paths.ui.mainMenuButtons = [
    "img/ui/button_0_normal.png",
    "img/ui/button_0_over.png"
  ];
  this.paths.ui.homeCastleButtons = [
    "img/ui/home_button.png"
  ];
  this.paths.ui.groupButtons = [
    "img/ui/group_button.png",
    "img/ui/group_button_over.png"
  ];
  this.paths.ui.endTurnButtons = [
    "img/ui/end_turn_button.png",
    "img/ui/end_turn_button_over.png"
  ];
  this.paths.ui.progressBar = [
    "img/ui/progress_bar_fill.png",
    "img/ui/progress_bar_border.png"
  ];
  this.paths.ui.standardButtons = [
    "img/ui/standard_button.png",
    "img/ui/standard_button_over.png",
    "img/ui/standard_button_disabled.png"
  ];
  this.paths.ui.transparent = ["img/ui/transparent.png"];
  this.paths.ui.divider = ["img/ui/divider.png"];
  this.paths.ui.longDivider = ["img/ui/long_divider.png"];
  this.paths.ui.groupNameButtons = [
    "img/ui/group_name.png",
    "img/ui/group_name_over.png"
  ];
  this.paths.ui.travelOrderButtons = [
    "img/ui/travel_order_button.png",
    "img/ui/travel_order_button.png",
    "img/ui/travel_order_button_disabled.png"
  ];
  this.paths.ui.cancelOrderButtons = [
    "img/ui/cancel_order_button.png",
    "img/ui/cancel_order_button.png",
    "img/ui/cancel_order_button_disabled.png"
  ];
  this.paths.ui.ordersMenuButtons = [
    "img/ui/orders_menu_button.png",
    "img/ui/orders_menu_button.png",
    "img/ui/orders_menu_button_disabled.png"
  ];
  this.paths.ui.partyIcons = ["img/ui/party_icon.png"];
  this.paths.ui.pathOverlay = ["img/ui/path_overlay.png"];
  this.paths.ui.exploreOrderButtons = [
    "img/ui/explore_order_button.png",
    "img/ui/explore_order_button.png"
  ];
  this.paths.ui.cutLogsOrderButtons = [
    "img/ui/cut_logs_order_button.png",
    "img/ui/cut_logs_order_button.png"
  ];
  this.paths.ui.visitOrderButtons = [
    "img/ui/visit_order_button.png",
    "img/ui/visit_order_button.png"
  ];
  this.paths.ui.combatOrderButtons = [
    "img/ui/combat_order_button.png",
    "img/ui/combat_order_button.png"
  ];
  this.paths.ui.mineOrderButtons = [
    "img/ui/mine_order_button.png",
    "img/ui/mine_order_button.png"
  ];
  this.paths.ui.closeButtons = [
    "img/ui/close_button.png",
    "img/ui/close_button_over.png"
  ];
  this.paths.ui.submenuIcon = ["img/ui/submenu_icon.png"];
  this.paths.ui.pathfinderDebugTile = ["img/ui/pathfinder_debug_tile.png"];
  this.paths.ui.resourceIndicatorBg = ["img/ui/resource_indicator.png"];
  this.paths.ui.resources = {};
  this.paths.ui.resources[ResourceType.Gold] = ["img/ui/resource_gold.png"];
  this.paths.ui.resources[ResourceType.Logs] = ["img/ui/resource_logs.png"];
  this.paths.ui.resources[ResourceType.Stone] = ["img/ui/resource_stone.png"];
  this.paths.ui.resources[ResourceType.IronOre] = ["img/ui/resource_iron_ore.png"];
  this.paths.ui.resources[ResourceType.ChromiteOre] = ["img/ui/resource_chromite_ore.png"];
  this.paths.ui.resources[ResourceType.PlatinumOre] = ["img/ui/resource_platinum_ore.png"];
  this.paths.ui.resources[ResourceType.RoughQuartz] = ["img/ui/resource_rough_quartz.png"];
  this.paths.ui.resources[ResourceType.RoughDiamond] = ["img/ui/resource_rough_diamond.png"];
  this.paths.ui.resources[ResourceType.RoughXenotime] = ["img/ui/resource_rough_xenotime.png"];
  this.paths.ui.resources[ResourceType.Planks] = ["img/ui/resource_planks.png"];
  this.paths.ui.resources[ResourceType.Bricks] = ["img/ui/resource_bricks.png"];
  this.paths.ui.resources[ResourceType.IronIngot] = ["img/ui/resource_iron_ingot.png"];
  this.paths.ui.resources[ResourceType.ChromiumIngot] = ["img/ui/resource_chromium_ingot.png"];
  this.paths.ui.resources[ResourceType.PlatinumIngot] = ["img/ui/resource_platinum_ingot.png"];
  this.paths.ui.resources[ResourceType.Quartz] = ["img/ui/resource_quartz.png"];
  this.paths.ui.resources[ResourceType.Diamond] = ["img/ui/resource_diamond.png"];
  this.paths.ui.resources[ResourceType.Xenotime] = ["img/ui/resource_xenotime.png"];
  this.paths.ui.portraits = {};
  this.paths.ui.portraits[CharacterType.Worker] = ["img/ui/portraits/worker.png"];
  this.paths.ui.portraits[CharacterType.Archer] = ["img/ui/portraits/archer.png"];
  this.paths.ui.portraits[CharacterType.Knight] = ["img/ui/portraits/knight.png"];
  this.paths.ui.portraits[CharacterType.Healer] = ["img/ui/portraits/healer.png"];
  this.paths.ui.portraits.empty = ["img/ui/portraits/empty.png"];
  
  // Items
  this.paths.items = {};
  this.paths.items[ItemSpriteType.Default] = ["img/items/default.png"];
};

AssetManager.prototype.preload = function(onComplete)
{
  var assetsToLoad = this.recursiveCollectPaths(this.paths);
  var assetLoader = new PIXI.AssetLoader(assetsToLoad);
  
  assetLoader.onComplete = onComplete;
  assetLoader.load();
};

AssetManager.prototype.recursiveCollectPaths = function(obj)
{
  var paths = [];
  var root = this;
  
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
    _.each(obj, function(item) { paths = paths.concat(root.recursiveCollectPaths(item)); });
  }
  
  return paths;
};