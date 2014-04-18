var GroupManagementScreen = function()
{
  this.type = ScreenType.GroupManagement;
  this.inputEnabled = true;
  this.z = 80;
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  
  this.container = new PIXI.DisplayObjectContainer();
  this.container.z = this.z;
  
  this.background = PIXI.Sprite.fromImage(game.assetManager.paths.ui.black);
  this.background.position.x = -16;
  this.background.position.y = -16;
  this.background.z = 0;
  this.background.width = game.containerWidth + 32;
  this.background.height = game.containerHeight + 32;
  this.background.alpha = 0.8;
  this.container.addChild(this.background);
  
  this.panel = new PanelComponent({
    x: 16,
    y: 40,
    z: 1,
    width: game.containerWidth - 32,
    height: game.containerHeight - (40 + 16)
  });
  this.container.addChild(this.panel);
  
  this.title = new PIXI.BitmapText("Group Management", {font: "20px big_pixelmix", tint: 0xFFFF00});
  this.title.position.x = 32;
  this.title.position.y = 12;
  this.title.z = 1;
  this.container.addChild(this.title);
  
  this.doneButton = new ButtonComponent(
    this,
    {
      x: this.panel.width - 178,
      y: this.panel.height - 54,
      text: "Done",
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
      onClick: function(e)
      {
        game.screenManager.removeScreen(ScreenType.GroupManagement);
        game.screenManager.screens[ScreenType.WorldMap].inputEnabled = true;
      }
    });
  this.panel.addChild(this.doneButton);
  
  this.createButton = new ButtonComponent(
    this,
    {
      x: 16,
      y: this.panel.height - 54,
      text: "Create Group",
      normalTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[0]),
      hoverTexture: PIXI.Texture.fromImage(game.assetManager.paths.ui.standardButtons[1]),
      onClick: function(e)
      {
      }
    });
  this.panel.addChild(this.createButton);
  
  this.buildGroupRows();
  
  this.buildBarracksPanel();
  
  this.container.children.sort(depthCompare);
};

GroupManagementScreen.prototype.onAddScreen = function()
{
  game.stage.addChild(this.container);
  game.stage.children.sort(depthCompare);
};

GroupManagementScreen.prototype.onRemoveScreen = function()
{
  game.stage.removeChild(this.container);
};

GroupManagementScreen.prototype.buildGroupRows = function()
{
  var containerWidth = 500;
  var groupRowHeight = 90;
  var totalGroupRowHeight = 0;
  var containerHeight = (Math.floor(this.panel.height / groupRowHeight) - 1) * groupRowHeight - 2;
  
  this.groupRows = [];
  this.groupRowsContainer = new PIXI.DisplayObjectContainer();
  this.groupRowsContainer.x = 16;
  this.groupRowsContainer.y = 16;
  this.groupRowsContainer.width = containerWidth;
  this.panel.addChild(this.groupRowsContainer);
  
  _.each(this.groupSystem.getPlayerControlledGroups(), function(group)
    {
      var groupRow = new GroupRowComponent(
        this,
        group.id,
        {
          x: 0,
          y: this.groupRows.length * groupRowHeight,
          width: containerWidth
        });
      this.groupRows.push(groupRow);
      this.groupRowsContainer.addChild(groupRow);
    },
    this);
  
  totalGroupRowHeight = this.groupRows.length * groupRowHeight;
  
  this.groupRowsContainer.minScrollY = totalGroupRowHeight < containerHeight ? 16 : -totalGroupRowHeight + containerHeight + 16;
  this.groupRowsContainer.maxScrollY = 16;
  
  this.scrollbar = new ScrollbarComponent(
    this,
    {
      x: containerWidth,
      y: 32,
      height: containerHeight,
      scrollAmount: groupRowHeight,
      maskX: 0,
      maskY: 18,
      maskWidth: containerWidth,
      maskHeight: containerHeight,
      component: this.groupRowsContainer
    });
  this.panel.addChild(this.scrollbar);
};

GroupManagementScreen.prototype.buildBarracksPanel = function()
{
  var x = this.groupRowsContainer.width + 32;
  
  this.barracksTitle = new PIXI.BitmapText("Barracks", {font: "20px big_pixelmix", tint: 0xFFFF00});
  this.barracksTitle.position.x = x;
  this.barracksTitle.position.y = 16;
  this.panel.addChild(this.barracksTitle);
  
  this.barracksGroup = new BarracksPanelComponent(
    this,
    {
      x: x,
      y: 48,
      width: this.panel.width - (x + 32),
      height: 260
    });
  this.panel.addChild(this.barracksGroup);
};

GroupManagementScreen.prototype.update = function()
{
  this.scrollbar.update();
};