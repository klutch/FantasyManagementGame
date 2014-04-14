var ResourceType = Object.freeze({
  // Currency
  Gold: "Gold",
  
  // Natural (raw)
  Logs: "Logs",
  Stone: "Stone",
  
  // Metals (raw)
  IronOre: "Iron Ore",
  ChromiteOre: "Chromite Ore",
  PlatinumOre: "Platinum Ore",
  
  // Crystals (raw)
  RoughQuartz: "Rough Quartz",
  RoughDiamond: "Rough Diamond",
  RoughXenotime: "Rough Xenotime",
  
  // Natural (processed)
  Planks: "Planks",
  Bricks: "Bricks",
  
  // Metals (processed)
  IronIngot: "Iron Ingot",
  ChromiumIngot: "Chromium Ingot",
  PlatinumIngot: "Platinum Ingot",
  
  // Crystals (processed)
  Quartz: "Quartz",
  Diamond: "Diamond",
  Xenotime: "Xenotime"
});

var ResourceSystem = function()
{
  this.type = SystemType.Resource;
  this.resourceQuantities = {};
};

ResourceSystem.prototype.initialize = function()
{
  // Initialize quantities to zero
  _.each(ResourceType, function(resourceType) { this.resourceQuantities[resourceType] = 0; }, this);
  
  // Now give starting quantities
  this.resourceQuantities[ResourceType.Gold] = 300;
};

ResourceSystem.prototype.decreaseQuantity = function(type, amount)
{
  this.resourceQuantities[type] = Math.max(0, this.resourceQuantities[type] - amount);
};

ResourceSystem.prototype.increaseQuantity = function(type, amount)
{
  this.resourceQuantities[type] += amount;
};

ResourceSystem.prototype.update = function()
{
};