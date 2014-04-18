var GroupManagementScreen = function()
{
  this.type = ScreenType.GroupManagement;
  this.inputEnabled = true;
  this.z = 80;
  
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

GroupManagementScreen.prototype.update = function()
{
  
};