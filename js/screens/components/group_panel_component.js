var GroupPanelComponent = function(options)
{
  options = options || {};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.panel = new PanelComponent(options);
  this.addChild(this.panel);
  this.z = options.z;
};

GroupPanelComponent.prototype = new PIXI.DisplayObjectContainer;