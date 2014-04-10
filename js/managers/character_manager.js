var CharacterManager = function()
{
  this.characters = [];
};

CharacterManager.prototype.initialize = function()
{
};

CharacterManager.prototype.getCharacter = function(characterId)
{
  return this.characters[characterId];
};

CharacterManager.prototype.getCharacterOffense = function(characterId)
{
  return this.characters[characterId].baseOffense;
};

CharacterManager.prototype.getCharacterDefense = function(characterId)
{
  return this.characters[characterId].baseDefense;
};

CharacterManager.prototype.getCharacterSupport = function(characterId)
{
  return this.characters[characterId].baseSupport;
};

CharacterManager.prototype.getUnusedCharacterId = function()
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

/*CharacterManager.prototype.addCharacter = function(groupId, character)
{
  var group = this.groups[groupId];
  
  this.characters[character.id] = character;
  group.characterIds.push(character.id);
};*/
CharacterManager.prototype.createCharacter = function(options)
{
  var id = this.getUnusedCharacterId();
  var character = new Character(id, options);
  
  this.characters[id] = character;
  
  return character;
};

CharacterManager.prototype.update = function()
{
};