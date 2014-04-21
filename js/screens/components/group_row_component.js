var GroupRowComponent = function(screen, groupId, options)
{
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.width = options.width || 100;
  options.height = options.height || 90;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.groupId = groupId;
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.characterSystem = game.systemManager.getSystem(SystemType.Character);
  this.group = this.groupSystem.getGroup(groupId);
  this.width = options.width;
  
  this.position.x = options.x;
  this.position.y = options.y;
  
  this.title = new PIXI.BitmapText(this.group.name, {font: "14px big_pixelmix", tint: 0xCCCCCC});
  this.title.position.x = 2;
  this.title.position.y = 0;
  this.addChild(this.title);
  
  this.statText = new PIXI.BitmapText("...", {font: "12px big_pixelmix", tint: 0x999999});
  this.statText.position.y = 2;
  this.addChild(this.statText);
  this.rebuildStatText();
  
  this.portraits = [];
  this.buildPortraits();
  
  this.renameButton = new ResizableButtonComponent(
    this.screen,
    {
      x: options.width - 150,
      y: 20,
      width: 120,
      height: 28,
      text: "Rename"
    });
  this.addChild(this.renameButton);
  
  this.disbandButton = new ResizableButtonComponent(
    this.screen,
    {
      x: options.width - 150,
      y: 50,
      width: 120,
      height: 28,
      text: "Disband"
    });
  this.addChild(this.disbandButton);
  
  this.divider = new PIXI.TilingSprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.longDivider), options.width - 32, 4);
  this.divider.position.y = options.height - 10;
  this.addChild(this.divider);
};

GroupRowComponent.prototype = new PIXI.DisplayObjectContainer;

GroupRowComponent.prototype.buildPortraits = function()
{
  for (var i = 0; i < this.group.characterIds.length; i++)
  {
    var portrait = new PortraitComponent(
      this.group.characterIds[i],
      {
        x: this.portraits.length * 40,
        y: 18
      });
    this.portraits.push(portrait);
    this.addChild(portrait);
  }
};

GroupRowComponent.prototype.rebuildStatText = function()
{
  var offense = this.groupSystem.getGroupOffense(this.groupId).toString();
  var defense = this.groupSystem.getGroupDefense(this.groupId).toString();
  var support = this.groupSystem.getGroupSupport(this.groupId).toString();
  
  this.statText.setText("( " + offense + " / " + defense + " / " + support + " )");
  this.statText.updateText();
  this.statText.position.x = this.width - (this.statText.textWidth + 32);
};

GroupRowComponent.prototype.update = function()
{
  this.renameButton.update();
  this.disbandButton.update();
};