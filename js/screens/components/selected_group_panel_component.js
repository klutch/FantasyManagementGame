var SelectedGroupPanelComponent = function(groupId, options)
{
  options = options || {};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.groupId = groupId;
  this.group = adventurerManager.groups[groupId];
  this.position.x = game.containerWidth - 416;
  this.position.y = 50;
  this.z = options.z;
  
  // Panel
  this.panel = new PanelComponent({
    x: 0,
    y: 0,
    width: 400,
    height: 136
  });
  this.addChild(this.panel);
  
  // Group name
  this.titleText = new PIXI.BitmapText(this.group.name, {font: "16px big_pixelmix", tint: 0xFFFF00});
  this.titleText.position.x = 16;
  this.titleText.position.y = 16;
  this.panel.addChild(this.titleText);
  
  // Group stats
  this.groupStats = new PIXI.BitmapText(
    adventurerManager.getGroupOffense(this.groupId).toString() + " / " +
    adventurerManager.getGroupDefense(this.groupId).toString() + " / " +
    adventurerManager.getGroupSupport(this.groupId).toString(),
    {font: "14px big_pixelmix", tint: 0xCCCCCC});
  this.groupStats.position.x = 16;
  this.groupStats.position.y = 40;
  this.panel.addChild(this.groupStats);
  
  // Portraits
  for (var i = 0; i < this.group.adventurerIds.length; i++)
  {
    var portrait = new PortraitComponent(this.group.adventurerIds[i], {x: 16 + 48 * i, y: 64});
    
    this.panel.addChild(portrait);
  }
};

SelectedGroupPanelComponent.prototype = new PIXI.DisplayObjectContainer;