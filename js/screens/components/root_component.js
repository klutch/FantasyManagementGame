var RootComponent = function(x, y)
{
  this.base = PIXI.DisplayObjectContainer;
  this.base();
};

RootComponent.prototype = new PIXI.DisplayObjectContainer;