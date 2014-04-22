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
  this.worldSystem = game.systemManager.getSystem(SystemType.World);
  this.group = this.groupSystem.getGroup(groupId);
  this.width = options.width;
  this.hackyCounter = 0;
  this.enabled = true;
  this.scrollbar = options.scrollbar;
  this.enabledTextStyle = {font: "14px big_pixelmix", tint: 0xFFFFFF};
  this.disabledTextStyle = {font: "14px big_pixelmix", tint: 0x999999};
  
  this.position.x = options.x;
  this.position.y = options.y;
  
  this.title = new PIXI.BitmapText(this.group.name, this.enabledTextStyle);
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
  
  this.disable();
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

GroupRowComponent.prototype.determineEnabledStatus = function()
{
  var top = this.scrollbar.maskY;
  var bottom = this.scrollbar.maskY + this.scrollbar.maskHeight;
  var isInCastle = this.group.featureId == this.worldSystem.world.playerCastleFeatureId;
  
  if (this.hackyCounter < 1)
  {
    return;
  }
  
  if (!isInCastle && this.enabled)
  {
    this.disable();
  }
  
  if (this.worldTransform.ty < top && this.enabled)
  {
    this.disable();
  }
  else if (this.worldTransform.ty > bottom && this.enabled)
  {
    this.disable();
  }
  else if (this.worldTransform.ty < bottom && this.worldTransform.ty > top && !this.enabled && isInCastle)
  {
    this.enable();
  }
};

GroupRowComponent.prototype.disable = function()
{
  this.enabled = false;
  this.title.setStyle(this.disabledTextStyle);
  for (var i = 0; i < this.portraits.length; i++)
  {
    this.portraits[i].portraitSprite.tint = 0x999999;
  }
};

GroupRowComponent.prototype.enable = function()
{
  this.enabled = true;
  this.title.setStyle(this.enabledTextStyle);
  for (var i = 0; i < this.portraits.length; i++)
  {
    this.portraits[i].portraitSprite.tint = 0xFFFFFF;
  }
};

GroupRowComponent.prototype.update = function()
{
  this.determineEnabledStatus();
  
  this.renameButton.update();
  this.disbandButton.update();
  
  this.hackyCounter++;
};