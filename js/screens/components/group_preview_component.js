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
  
  // Create preview panel
  this.panel = new PanelComponent(options);
  this.addChild(this.panel);
};

GroupPreviewComponent.prototype = new PIXI.DisplayObjectContainer;