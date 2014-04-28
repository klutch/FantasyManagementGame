var ItemFactory = {};

ItemFactory.createLeatherHat = function()
{
  var equipmentSystem = game.systemManager.getSystem(SystemType.Equipment);
  var item = new Item(
    equipmentSystem.getUnusedItemId(),
    {
      name: "Leather Hat",
      defense: 2,
      isEquippable: true,
      slotType: EquipmentSlotType.Head
    });
  
  return item;
};