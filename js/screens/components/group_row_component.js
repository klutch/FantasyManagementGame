var GroupRowComponent = function(screen, groupId, options)
{
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.width = options.width || 100;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.groupId = groupId;
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.characterSystem = game.systemManager.getSystem(SystemType.Character);
  this.group = this.groupSystem.getGroup(groupId);
  
  this.position.x = options.x;
  this.position.y = options.y;
  
  this.title = new PIXI.BitmapText(this.group.name, {font: "14px big_pixelmix", tint: 0xCCCCCC});
  this.title.position.x = 2;
  this.title.position.y = 0;
  this.addChild(this.title);
  
  this.portraits = [];
  this.buildPortraits();
  
  this.divider = new PIXI.TilingSprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.longDivider), options.width, 4);
  this.divider.position.y = 80;
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