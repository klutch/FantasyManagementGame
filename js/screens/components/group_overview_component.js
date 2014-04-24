var GroupOverviewComponent = function(screen, options)
{
  var root = this;
  
  options = options || {};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.initialized = false;
  this.contentHeight = 0;
  
  this.panel = new PanelComponent({
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    type: PanelType.Dark
  });
  this.addChild(this.panel);
  
  this.overviewContainer = new PIXI.DisplayObjectContainer();
  this.overviewContainer.position.x = 16;
  this.overviewContainer.position.y = 16;
  this.panel.addChild(this.overviewContainer);
};

GroupOverviewComponent.prototype = new PIXI.DisplayObjectContainer;

GroupOverviewComponent.prototype.selectGroup = function(groupId)
{
  this.groupId = groupId;
  this.clearOverview();
  this.buildOverview();
};

GroupOverviewComponent.prototype.clearOverview = function()
{
  if (!this.initialized)
  {
    return;
  }
  
  this.overviewContainer.removeChild(this.groupTitle);
  this.overviewContainer.removeChild(this.titleDivider);
  
  this.contentHeight = 0;
};

GroupOverviewComponent.prototype.buildOverview = function()
{
  var statTextStyle = {font: "12px big_pixelmix", tint: 0xCCCCCC};
  var statTextSpacing = 4;
  
  this.group = this.groupSystem.getGroup(this.groupId);
  
  this.groupTitle = new PIXI.BitmapText(this.group.name, {font: "20px big_pixelmix", tint: 0xFFFF00});
  this.overviewContainer.addChild(this.groupTitle);
  this.contentHeight += this.groupTitle.textHeight + 8;
  
  this.titleDivider = new PIXI.TilingSprite(PIXI.Texture.fromImage(game.assetManager.paths.ui.longDivider), this.panel.width - 32, 4);
  this.titleDivider.position.y = this.contentHeight;
  this.overviewContainer.addChild(this.titleDivider);
  this.contentHeight = this.titleDivider.position.y + this.titleDivider.height + 8;
  
  this.offenseText = new PIXI.BitmapText("Total Offense: " + this.groupSystem.getGroupOffense(this.groupId), statTextStyle);
  this.offenseText.position.y = this.contentHeight;
  this.overviewContainer.addChild(this.offenseText);
  this.contentHeight = this.offenseText.position.y + this.offenseText.textHeight + statTextSpacing;
  
  this.defenseText = new PIXI.BitmapText("Total Defense: " + this.groupSystem.getGroupDefense(this.groupId), statTextStyle);
  this.defenseText.position.y = this.contentHeight;
  this.overviewContainer.addChild(this.defenseText);
  this.contentHeight = this.defenseText.position.y + this.defenseText.textHeight + statTextSpacing;
  
  this.supportText = new PIXI.BitmapText("Total Support: " + this.groupSystem.getGroupSupport(this.groupId), statTextStyle);
  this.supportText.position.y = this.contentHeight;
  this.overviewContainer.addChild(this.supportText);
  this.contentHeight = this.supportText.position.y + this.supportText.textHeight + statTextSpacing;
  
  this.movementText = new PIXI.BitmapText("Movement Ability: " + this.groupSystem.getGroupMovementAbility(this.groupId), statTextStyle);
  this.movementText.position.y = this.contentHeight;
  this.overviewContainer.addChild(this.movementText);
  this.contentHeight = this.movementText.position.y + this.movementText.textHeight + statTextSpacing;
  
  this.initialized = true;
};

GroupOverviewComponent.prototype.update = function()
{
};