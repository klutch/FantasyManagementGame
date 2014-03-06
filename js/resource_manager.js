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

var ResourceManager = function()
{
  this.resourceQuantities = {};
  
  _.each(ResourceType, function(resourceType) { this.resourceQuantities[resourceType] = 0; }, this);
};