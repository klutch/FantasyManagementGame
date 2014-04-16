var EquipmentSystem = function()
{
  this.type = SystemType.Equipment;
  this.items = {};
  this.equipmentSlots = {};
};

EquipmentSystem.prototype.initialize = function()
{
  this.characterSystem = game.systemManager.getSystem(SystemType.Character);
};

EquipmentSystem.prototype.getUnusedItemId = function()
{
  var index = 0;
  
  while(this.items[index] != undefined) { index++; }
  
  return index;
};

EquipmentSystem.prototype.getUnusedEquipmentSlotId = function()
{
  var index = 0;
  
  while(this.equipmentSlots[index] != undefined) { index++; }
  
  return index;
};

EquipmentSystem.prototype.getItem = function(itemId)
{
  return this.items[itemId];
};

EquipmentSystem.prototype.getEquipmentSlot = function(equipmentSlotId)
{
  return this.equipmentSlots[equipmentSlotId];
};

EquipmentSystem.prototype.getEquipmentSlotByIndex = function(characterId, slotIndex)
{
  var character = this.characterSystem.getCharacter(characterId);
  
  for (var i = 0; i < character.equipmentSlotIds.length; i++)
  {
    var equipmentSlot = this.getEquipmentSlot(character.equipmentSlotIds[i]);
    
    if (equipmentSlot.slotIndex == slotIndex)
    {
      return equipmentSlot;
    }
  }
};

EquipmentSystem.prototype.getFirstEmptySlotIndex = function(characterId, slotType)
{
  var character = this.characterSystem.getCharacter(characterId);
  
  for (var i = 0; i < character.equipmentSlotIds.length; i++)
  {
    var equipmentSlot = this.getEquipmentSlot(character.equipmentSlotIds[i]);
    
    if (equipmentSlot.itemId == null)
    {
      return equipmentSlot.slotIndex;
    }
  }
};

EquipmentSystem.prototype.addItem = function(item)
{
  this.items[item.id] = item;
};

EquipmentSystem.prototype.removeItem = function(itemId)
{
  delete this.items[itemId];
};

EquipmentSystem.prototype.createInventory = function()
{
  var inventory = new Inventory(this.getUnusedInventoryId());
  
  this.inventories[inventory.id] = inventory;
  return inventory;
};

EquipmentSystem.prototype.createEquipmentSlot = function(characterId, type)
{
  var character = this.characterSystem.getCharacter(characterId);
  var equipmentSlot = new EquipmentSlot(this.getUnusedEquipmentSlotId(), type);
  var numSlotsOfThisType = 0;
  
  for (var i = 0; i < character.equipmentSlotIds.length; i++)
  {
    var existingSlot = this.getEquipmentSlot(character.equipmentSlotIds[i]);
    
    if (existingSlot.type == equipmentSlot.type)
    {
      numSlotsOfThisType++;
    }
  }
  
  equipmentSlot.slotIndex = numSlotsOfThisType;
  character.equipmentSlotIds.push(equipmentSlot.id);
  this.equipmentSlots[equipmentSlot.id] = equipmentSlot;
  return equipmentSlot;
};

EquipmentSystem.prototype.addItemToInventory = function(itemId, characterId)
{
  var character = this.characterSystem.getCharacter(characterId);
  
  character.inventoryItemIds.push(itemId);
};

EquipmentSystem.prototype.removeItemFromInventory = function(itemId, characterId)
{
  var character = this.characterSystem.getCharacter(characterId);
  
  for (var i = 0; i < character.inventoryItemIds.length; i++)
  {
    if (character.inventoryItemIds[i] == itemId)
    {
      delete character.inventoryItemIds[i];
      character.inventoryItemIds = _.compact(character.inventoryItemIds);
      break;
    }
  }
};

EquipmentSystem.prototype.equipItem = function(itemId, characterId, slotIndex)
{
  var character = this.characterSystem.getCharacter(itemId);
  var item = this.getItem(itemId);
  var equipmentSlot;
  
  slotIndex = slotIndex == undefined ? this.getFirstEmptySlotIndex(characterId, item.slotType) : slotIndex;
  
  equipmentSlot = this.getEquipmentSlotByIndex(characterId, slotIndex);
  equipmentSlot.itemId = itemId;
};

EquipmentSystem.prototype.unequipItem = function(itemId, characterId, slotIndex)
{
  var character = this.characterSystem.getCharacter(itemId);
  var item = this.getItem(itemId);
  var equipmentSlot = this.getEquipmentSlotByIndex(characterId, slotIndex);
  
  equipmentSlot.itemId = null;
};

EquipmentSystem.prototype.canCharacterEquipItem = function(characterId, itemId)
{
  var item = this.getItem(itemId);
  
  return this.getFirstEmptySlotIndex(characterId, item.slotType) != undefined;
};

EquipmentSystem.prototype.update = function()
{
};