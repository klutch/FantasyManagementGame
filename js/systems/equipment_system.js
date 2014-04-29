var EquipmentSystem = function()
{
  this.type = SystemType.Equipment;
  this.items = {};
  this.equipmentSlots = {};
  this.treasuryItemIds = [];
};

EquipmentSystem.prototype.initialize = function()
{
  this.characterSystem = game.systemManager.getSystem(SystemType.Character);
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  
  // Temporarily fill treasury
  for (var i = 0; i < 50; i++)
  {
    var item = ItemFactory.createLeatherHat();
    
    this.addItem(item);
    this.addItemToTreasury(item.id);
  }
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

EquipmentSystem.prototype.getEquipmentSlotByIndex = function(characterId, slotType, slotIndex)
{
  var character = this.characterSystem.getCharacter(characterId);
  
  for (var i = 0; i < character.equipmentSlotIds.length; i++)
  {
    var equipmentSlot = this.getEquipmentSlot(character.equipmentSlotIds[i]);
    
    if (equipmentSlot.type == slotType && equipmentSlot.slotIndex == slotIndex)
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

EquipmentSystem.prototype.getEquipmentOffense = function(characterId)
{
  var offense = 0;
  var character = this.characterSystem.getCharacter(characterId);
  
  for (var i = 0; i < character.equipmentSlotIds.length; i++)
  {
    var equipmentSlot = this.getEquipmentSlot(character.equipmentSlotIds[i]);
    
    if (equipmentSlot.hasItem())
    {
      offense += this.getItem(equipmentSlot.itemId).offense;
    }
  }
  return offense;
};

EquipmentSystem.prototype.getEquipmentDefense = function(characterId)
{
  var defense = 0;
  var character = this.characterSystem.getCharacter(characterId);
  
  for (var i = 0; i < character.equipmentSlotIds.length; i++)
  {
    var equipmentSlot = this.getEquipmentSlot(character.equipmentSlotIds[i]);
    
    if (equipmentSlot.hasItem())
    {
      defense += this.getItem(equipmentSlot.itemId).defense;
    }
  }
  return defense;
};

EquipmentSystem.prototype.getEquipmentSupport = function(characterId)
{
  var support = 0;
  var character = this.characterSystem.getCharacter(characterId);
  
  for (var i = 0; i < character.equipmentSlotIds.length; i++)
  {
    var equipmentSlot = this.getEquipmentSlot(character.equipmentSlotIds[i]);
    
    if (equipmentSlot.hasItem())
    {
      support += this.getItem(equipmentSlot.itemId).support;
    }
  }
  return support;
};

EquipmentSystem.prototype.getGroupInventory = function(groupId)
{
  var itemIds = [];
  var group = this.groupSystem.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    var character = this.characterSystem.getCharacter(group.characterIds[i]);
    
    for (var j = 0; j < character.inventoryItemIds.length; j++)
    {
      itemIds.push(character.inventoryItemIds[j]);
    }
  }
  
  return itemIds;
};

EquipmentSystem.prototype.addItem = function(item)
{
  this.items[item.id] = item;
};

EquipmentSystem.prototype.removeItem = function(itemId)
{
  delete this.items[itemId];
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

EquipmentSystem.prototype.addItemToTreasury = function(itemId)
{
  this.treasuryItemIds.push(itemId);
};

EquipmentSystem.prototype.removeItemFromTreasury = function(itemId)
{
  for (var i = 0; i < this.treasuryItemIds.length; i++)
  {
    if (this.treasuryItemIds[i] == itemId)
    {
      delete this.treasuryItemIds[i];
      break;
    }
  }
  
  this.treasuryItemIds = _.compact(this.treasuryItemIds);
};

EquipmentSystem.prototype.equipItem = function(itemId, characterId, slotIndex)
{
  var character = this.characterSystem.getCharacter(itemId);
  var item = this.getItem(itemId);
  var equipmentSlot;
  
  slotIndex = slotIndex == undefined ? this.getFirstEmptySlotIndex(characterId, item.slotType) : slotIndex;
  
  equipmentSlot = this.getEquipmentSlotByIndex(characterId, item.slotType, slotIndex);
  equipmentSlot.itemId = itemId;
};

EquipmentSystem.prototype.unequipItem = function(itemId, characterId)
{
  var character = this.characterSystem.getCharacter(characterId);
  
  for (var i = 0; i < character.equipmentSlotIds.length; i++)
  {
    var equipmentSlot = this.getEquipmentSlot(character.equipmentSlotIds[i]);
    
    if (equipmentSlot.itemId == itemId)
    {
      equipmentSlot.itemId = null;
      return;
    }
  }
};

/*
EquipmentSystem.prototype.unequipItem = function(itemId, characterId, slotIndex)
{
  var character = this.characterSystem.getCharacter(itemId);
  var item = this.getItem(itemId);
  var equipmentSlot = this.getEquipmentSlotByIndex(characterId, item.slotType, slotIndex);
  
  equipmentSlot.itemId = null;
};*/

EquipmentSystem.prototype.canCharacterEquipItem = function(characterId, itemId)
{
  var item = this.getItem(itemId);
  
  return this.getFirstEmptySlotIndex(characterId, item.slotType) != undefined;
};

EquipmentSystem.prototype.update = function()
{
};