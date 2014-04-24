var GroupOverviewComponent = function(screen, options)
{
  var root = this;
  
  options = options || {};
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  
  this.panel = new PanelComponent({
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
    type: PanelType.Dark
  });
  this.addChild(this.panel);
};

GroupOverviewComponent.prototype = new PIXI.DisplayObjectContainer;

GroupOverviewComponent.prototype.update = function()
{
};