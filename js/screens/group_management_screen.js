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
  var containerHeight = 360;
  
  this.groupRows = [];
  this.groupRowsContainer = new PIXI.DisplayObjectContainer();
  this.groupRowsContainer.x = 16;
  this.groupRowsContainer.y = 16;
  this.panel.addChild(this.groupRowsContainer);
  
  _.each(this.groupSystem.getPlayerControlledGroups(), function(group)
    {
      var groupRow = new GroupRowComponent(
        this,
        group.id,
        {
          x: 0,
          y: this.groupRows.length * 90,
          width: this.panel.width - 76
        });
      this.groupRows.push(groupRow);
      this.groupRowsContainer.addChild(groupRow);
    },
    this);
  
  this.groupRowsContainer.minScrollY = -this.groupRows.length * 90 + containerHeight;
  this.groupRowsContainer.maxScrollY = 16;
  
  this.scrollbar = new ScrollbarComponent(
    this,
    {
      x: this.panel.width - 32,
      y: 32,
      height: containerHeight,
      scrollAmount: 90,
      maskX: 0,
      maskY: 16,
      maskWidth: this.panel.width - 76,
      maskHeight: containerHeight,
      component: this.groupRowsContainer
    });
  this.panel.addChild(this.scrollbar);
};

GroupManagementScreen.prototype.update = function()
{
  this.scrollbar.update();
};