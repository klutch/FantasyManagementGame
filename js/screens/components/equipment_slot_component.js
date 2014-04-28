var EquipmentSlotComponent = function(screen, equipmentSlotId, options)
{
  options = options || {};
  options.width = options.width || 100;
  options.height = options.height || 40;
  
  this.base = PIXI.DisplayObjectContainer;
  this.base();
  this.equipmentSystem = game.systemManager.getSystem(SystemType.Equipment);
  this.slot = this.equipmentSystem.getEquipmentSlot(equipmentSlotId);
  this.width = options.width;
  this.height = options.height;
  this.enabled = true;
  
  this.position.x = options.x;
  this.position.y = options.y;
  
  this.slotText = new PIXI.BitmapText(this.slot.type, {font: "12px big_pixelmix", tint: 0xCCCCCC});
  this.slotText.position.x = 40;
  this.slotText.position.y = 10;
  this.addChild(this.slotText);
  
  this.rectangle = new PIXI.Rectangle(0, 0, options.width, options.height);
  
  this.build();
};

EquipmentSlotComponent.prototype = new PIXI.DisplayObjectContainer;

EquipmentSlotComponent.prototype.rebuild = function()
{
  this.clear();
  this.build();
};

EquipmentSlotComponent.prototype.clear = function()
{
  this.item = null;
  if (this.itemBg != null)
  {
    this.removeChild(this.itemBg);
    this.itemBg = null;
  }
  if (this.slotBg != null)
  {
    this.removeChild(this.slotBg);
    this.slotBg = null;
  }
};

EquipmentSlotComponent.prototype.build = function()
{
  if (this.slot.itemId != null)
  {
    this.item = this.equipmentSystem.getItem(this.slot.itemId);
    this.itemBg = PIXI.Sprite.fromImage(game.assetManager.paths.items[this.item.spriteType]);
    this.addChild(this.itemBg);
  }
  else
  {
    this.slotBg = PIXI.Sprite.fromImage(game.assetManager.paths.ui.equipmentSlotBg);
    this.addChild(this.slotBg);
  }
};

EquipmentSlotComponent.prototype.update = function()
{
  this.rectangle.x = this.worldTransform.tx;
  this.rectangle.y = this.worldTransform.ty;
};