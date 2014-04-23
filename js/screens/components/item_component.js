var ItemComponent = function(screen, itemId, options)
{
  options = options || {};
  options.x = options.x || 0;
  options.y = options.y || 0;
  options.onClick = options.onClick || function() { };
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.screen = screen;
  this.itemId = itemId;
  this.equipmentSystem = game.systemManager.getSystem(SystemType.Equipment);
  this.item = this.equipmentSystem.getItem(itemId);
  this.isMouseOver = false;
  this.enabled = true;
  
  this.position.x = options.x;
  this.position.y = options.y;
  
  this.onClick = options.onClick;
  
  this.sprite = PIXI.Sprite.fromImage(game.assetManager.paths.items[this.item.spriteType]);
  this.addChild(this.sprite);
  
  this.rectangle = new PIXI.Rectangle(0, 0, this.sprite.width, this.sprite.height);
};

ItemComponent.prototype = new PIXI.DisplayObjectContainer;

ItemComponent.prototype.onMouseOver = function()
{
  this.isMouseOver = true;
};

ItemComponent.prototype.onMouseOut = function()
{
  this.isMouseOut = false;
};

ItemComponent.prototype.update = function()
{
  var isMouseInRect = false;
  
  this.rectangle.x = this.worldTransform.tx;
  this.rectangle.y = this.worldTransform.ty;
  
  isMouseInRect = this.rectangle.contains(game.inputManager.mousePosition.x, game.inputManager.mousePosition.y);
  
  if (this.screen.inputEnabled && this.enabled)
  {
    if (!this.isMouseOver && isMouseInRect)
    {
      this.onMouseOver();
    }
    else if (this.isMouseOver && !isMouseInRect)
    {
      this.onMouseOut();
    }
    
    if (isMouseInRect && game.inputManager.singleLeftButton())
    {
      this.onClick();
    }
  }
};