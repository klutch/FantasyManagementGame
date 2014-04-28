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
  
  this.onClick = options.onClick;
  
  this.panel = new PanelComponent({
    x: options.x,
    y: options.y,
    width: 140,
    height: 48,
    type: PanelType.Normal
  });
  this.addChild(this.panel);
  
  this.sprite = PIXI.Sprite.fromImage(game.assetManager.paths.items[this.item.spriteType]);
  this.sprite.position.x = 8;
  this.sprite.position.y = 8;
  this.panel.addChild(this.sprite);
  
  this.itemName = new PIXI.BitmapText(this.getShortenedName(this.item.name), {font: "10px big_pixelmix", tint: 0xCCCCCC});
  this.itemName.position.x = 48;
  this.itemName.position.y = 18;
  this.panel.addChild(this.itemName);
  
  this.rectangle = new PIXI.Rectangle(0, 0, this.panel.width, this.panel.height);
};

ItemComponent.prototype = new PIXI.DisplayObjectContainer;

ItemComponent.prototype.getShortenedName = function(name)
{
  return name.length > 10 ? (name.substring(0, 9) + "...") : name;
};

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