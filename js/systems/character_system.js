var CharacterSystem = function()
{
  this.characters = [];
  this.type = SystemType.Character;
};

CharacterSystem.prototype.initialize = function()
{
  this.equipmentSystem = game.systemManager.getSystem(SystemType.Equipment);
};

CharacterSystem.prototype.getCharacter = function(characterId)
{
  return this.characters[characterId];
};

CharacterSystem.prototype.getCharacterOffense = function(characterId)
{
  return this.characters[characterId].baseOffense + this.equipmentSystem.getEquipmentOffense(characterId);
};

CharacterSystem.prototype.getCharacterDefense = function(characterId)
{
  return this.characters[characterId].baseDefense + this.equipmentSystem.getEquipmentDefense(characterId);
};

CharacterSystem.prototype.getCharacterSupport = function(characterId)
{
  return this.characters[characterId].baseSupport + this.equipmentSystem.getEquipmentSupport(characterId);
};

CharacterSystem.prototype.getCharacterPowerLevel = function(characterId)
{
  return this.getCharacterOffense(characterId) + this.getCharacterDefense(characterId) + this.getCharacterSupport(characterId);
};

CharacterSystem.prototype.getCharacterMovementAbility = function(characterId)
{
  return this.characters[characterId].movementAbility;
};

CharacterSystem.prototype.getUnusedCharacterId = function()
{
  for (var i = 0; i < this.characters.length; i++)
  {
    if (this.characters[i] == null)
    {
      return i;
    }
  }
  return this.characters.length;
};

CharacterSystem.prototype.createCharacter = function(options)
{
  var id = this.getUnusedCharacterId();
  var character = new Character(id, options);
  
  this.characters[id] = character;
  
  return character;
};

CharacterSystem.prototype.update = function()
{
};