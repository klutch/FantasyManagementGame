var ResourceType = Object.freeze({
  // Currency
  Gold: 0,
  
  // Natural (raw)
  Logs: 1,
  Stone: 2,
  
  // Metals (raw)
  IronOre: 3,
  ChromiteOre: 4,
  PlatinumOre: 5,
  
  // Crystals (raw)
  RoughQuartz: 6,
  RoughDiamond: 7,
  RoughXenotime: 8,
  
  // Natural (processed)
  Planks: 9,
  Bricks: 10,
  
  // Metals (processed)
  IronIngot: 11,
  ChromiumIngot: 12,
  PlatinumIngot: 13,
  
  // Crystals (processed)
  Quartz: 14,
  Diamond: 15,
  Xenotime: 16
});

var ResourceManager = function()
{
  this.resourceQuantities = {};
  
  _.each(ResourceType, function(resourceType) { this.resourceQuantities[resourceType] = 0; }, this);
};