var CharacterManager = function()
{
  this.characters = [];
  this.groups = [];
  this.barracksGroup;
  this.selectedGroupId = -1;
};

CharacterManager.prototype.initialize = function()
{
  var startingGroup = this.createGroup({name: "Starting Group", featureId: worldManager.world.playerCastleFeatureId});
  var worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  
  // Create a special barracks group
  this.barracksGroup = new Group(-1, {name: "Barracks", featureId: 0});
  
  // Create starting group
  this.addCharacter(startingGroup.id, CharacterFactory.createArcher(10));
  this.addCharacter(startingGroup.id, CharacterFactory.createArcher(10));
  this.addCharacter(startingGroup.id, CharacterFactory.createKnight(10));
  this.addCharacter(startingGroup.id, CharacterFactory.createKnight(10));
  this.addCharacter(startingGroup.id, CharacterFactory.createHealer(10));
  worldMapScreen.groupMenu.addGroup(startingGroup.id);
};

CharacterManager.prototype.getNumAdventurers = function()
{
  var count = 0;
  
  for (var i = 0; i < this.characters.length; i++)
  {
    if (!this.characters[i].isWorker)
    {
      count++;
    }
  }
  return count;
};

CharacterManager.prototype.getNumWorkers = function()
{
  var count = 0;
  
  for (var i = 0; i < this.characters.length; i++)
  {
    if (this.characters[i].isWorker)
    {
      count++;
    }
  }
  return count;
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

CharacterManager.prototype.getGroupOffense = function(groupId)
{
  var total = 0;
  var group = this.groups[groupId];
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    total += this.getCharacterOffense(group.characterIds[i]);
  }
  
  return total;
};

CharacterManager.prototype.getGroupDefense = function(groupId)
{
  var total = 0;
  var group = this.groups[groupId];
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    total += this.getCharacterDefense(group.characterIds[i]);
  }
  
  return total;
};

CharacterManager.prototype.getGroupSupport = function(groupId)
{
  var total = 0;
  var group = this.groups[groupId];
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    total += this.getCharacterSupport(group.characterIds[i]);
  }
  
  return total;
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

CharacterManager.prototype.getUnusedGroupId = function()
{
  for (var i = 0; i < this.groups.length; i++)
  {
    if (this.groups[i] == null)
    {
      return i;
    }
  }
  return this.groups.length;
};

CharacterManager.prototype.createGroup = function(options)
{
  var id = this.getUnusedGroupId();
  var group = new Group(id, options);
  
  this.groups[id] = group;
  
  return group;
};

CharacterManager.prototype.addCharacter = function(groupId, character)
{
  var group = this.groups[groupId];
  
  this.characters[character.id] = character;
  group.characterIds.push(character.id);
};

CharacterManager.prototype.selectGroup = function(groupId)
{
  var worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  
  if (this.selectedGroupId != -1)
  {
    worldMapScreen.closeSelectedGroupPanel();
  }
  
  this.selectedGroupId = groupId;
  worldMapScreen.openSelectedGroupPanel(groupId);
};

CharacterManager.prototype.deselectGroup = function()
{
  if (this.selectedGroupId != -1)
  {
    var worldMapScreen = screenManager.screens[ScreenType.WorldMap];
    
    worldMapScreen.closeSelectedGroupPanel();
    this.selectedGroupId = -1;
  }
}

CharacterManager.prototype.getGroupTile = function(groupId)
{
  var group = this.groups[groupId];
  
  if (group.isInFeature())
  {
    var feature = worldManager.world.features[group.featureId];
    
    return worldManager.getTile(feature.tileI, feature.tileJ);
  }
  else
  {
    return worldManager.getTile(group.tileI, group.tileJ);
  }
};

CharacterManager.prototype.getGroupMovementAbility = function(groupId)
{
  var group = this.groups[groupId];
  var lowestMovementAbility = 999;
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    var character = this.characters[group.characterIds[i]];
    
    if (character.movementAbility < lowestMovementAbility)
    {
      lowestMovementAbility = character.movementAbility;
    }
  }
  return lowestMovementAbility;
};

CharacterManager.prototype.getGroupDiscoveryRadius = function(groupId)
{
  var group = this.groups[groupId];
  var highestDiscoveryRadius = 0;
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    var character = this.characters[group.characterIds[i]];
    
    if (character.discoveryRadius > highestDiscoveryRadius)
    {
      highestDiscoveryRadius = character.discoveryRadius;
    }
  }
  return highestDiscoveryRadius;
};

CharacterManager.prototype.moveGroupToTile = function(groupId, tileI, tileJ)
{
  var group = this.groups[groupId];
  
  // Add group to world map if currently in a feature
  if (group.isInFeature())
  {
    screenManager.screens[ScreenType.WorldMap].worldGroups.showGroup(groupId);
  }
  
  group.featureId = -1;
  group.tileI = tileI;
  group.tileJ = tileJ;
};

CharacterManager.prototype.moveGroupIntoFeature = function(groupId)
{
  var group = this.groups[groupId];
  var tile = worldManager.getTile(group.tileI, group.tileJ);
  
  group.featureId = tile.featureId;
  
  // Remove group from world map
  screenManager.screens[ScreenType.WorldMap].worldGroups.hideGroup(groupId);
};

CharacterManager.prototype.resetGroupMovement = function()
{
  _.each(this.groups, function(group)
    {
      group.movementUsed = 0;
    });
};

CharacterManager.prototype.update = function()
{
};