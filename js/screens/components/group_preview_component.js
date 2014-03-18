var GroupPreviewComponent = function(groupId, options)
{
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.width = options.width || 400;
  options.height = options.height || 300;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.groupId = groupId;
  this.group = adventurerManager.groups[groupId];
  this.position.x = options.x;
  this.position.y = options.y;
  this.z = options.z;
  delete options.x;
  delete options.y;
  delete options.z;
  
  // Create preview panel
  this.panel = new PanelComponent(options);
  this.addChild(this.panel);
  
  // Create adventurer portraits and labels
  for (var i = 0; i < this.group.adventurerIds.length; i++)
  {
    var adventurer = adventurerManager.adventurers[this.group.adventurerIds[i]];
    var sprite = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.portraits[adventurer.type]);
    var text = new PIXI.BitmapText(adventurer.type, {font: "14px big_pixelmix"});
    
    sprite.position.x = 16;
    sprite.position.y = 16 + 64 * i;
    text.position.x = 64;
    text.position.y = sprite.position.y + 22;
    this.addChild(sprite);
    this.addChild(text);
  }
};

GroupPreviewComponent.prototype = new PIXI.DisplayObjectContainer;