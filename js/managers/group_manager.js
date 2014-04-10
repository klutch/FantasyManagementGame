var GroupManager = function()
{
  this.groups = [];
  this.barracksGroup;
  this.selectedGroupId = -1;
};

GroupManager.prototype.initialize = function()
{
  var startingGroup = this.createGroup({name: "Starting Group", featureId: worldManager.world.playerCastleFeatureId});
  var worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  
  // Create a special barracks group
  this.barracksGroup = new Group(-1, {name: "Barracks", featureId: 0});
  
  // Create starting group
  this.addCharacterToGroup(startingGroup.id, CharacterFactory.createArcher(10).id);
  this.addCharacterToGroup(startingGroup.id, CharacterFactory.createArcher(10).id);
  this.addCharacterToGroup(startingGroup.id, CharacterFactory.createKnight(10).id);
  this.addCharacterToGroup(startingGroup.id, CharacterFactory.createKnight(10).id);
  this.addCharacterToGroup(startingGroup.id, CharacterFactory.createHealer(10).id);
  worldMapScreen.groupMenu.addGroup(startingGroup.id);
};

GroupManager.prototype.getGroup = function(groupId)
{
  return this.groups[groupId];
};

GroupManager.prototype.getPlayerControlledGroups = function()
{
  var playerControlledGroups = [];
  
  _.each(this.groups, function(group)
    {
      if (group.playerControlled)
      {
        playerControlledGroups.push(group);
      }
    });
  
  return playerControlledGroups;
};

GroupManager.prototype.getNumPlayerAdventurers = function()
{
  var count = 0;
  var playerGroups = this.getPlayerControlledGroups();
  
  for (var i = 0; i < playerGroups.length; i++)
  {
    var group = playerGroups[i];
    
    for (var j = 0; j < group.characterIds.length; j++)
    {
      var character = characterManager.getCharacter(group.characterIds[j]);
      
      if (!character.isWorker)
      {
        count++;
      }
    }
  }
  return count;
};

GroupManager.prototype.getNumPlayerWorkers = function()
{
  var count = 0;
  var playerGroups = this.getPlayerControlledGroups();
  
  for (var i = 0; i < playerGroups.length; i++)
  {
    var group = playerGroups[i];
    
    for (var j = 0; j < group.characterIds.length; j++)
    {
      var character = characterManager.getCharacter(group.characterIds[j]);
      
      if (character.isWorker)
      {
        count++;
      }
    }
  }
  return count;
};

GroupManager.prototype.getGroupOffense = function(groupId)
{
  var total = 0;
  var group = this.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    total += characterManager.getCharacterOffense(group.characterIds[i]);
  }
  
  return total;
};

GroupManager.prototype.getGroupDefense = function(groupId)
{
  var total = 0;
  var group = this.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    total += characterManager.getCharacterDefense(group.characterIds[i]);
  }
  
  return total;
};

GroupManager.prototype.getGroupSupport = function(groupId)
{
  var total = 0;
  var group = this.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    total += characterManager.getCharacterSupport(group.characterIds[i]);
  }
  
  return total;
};

GroupManager.prototype.getUnusedGroupId = function()
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

GroupManager.prototype.createGroup = function(options)
{
  var id = this.getUnusedGroupId();
  var group = new Group(id, options);
  
  this.groups[id] = group;
  
  return group;
};

GroupManager.prototype.selectGroup = function(groupId)
{
  var worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  
  if (this.selectedGroupId != -1)
  {
    worldMapScreen.closeSelectedGroupPanel();
  }
  
  this.selectedGroupId = groupId;
  worldMapScreen.openSelectedGroupPanel(groupId);
};

GroupManager.prototype.deselectGroup = function()
{
  if (this.selectedGroupId != -1)
  {
    var worldMapScreen = screenManager.screens[ScreenType.WorldMap];
    
    worldMapScreen.closeSelectedGroupPanel();
    this.selectedGroupId = -1;
  }
}

GroupManager.prototype.getGroupTile = function(groupId)
{
  var group = this.getGroup(groupId);
  
  if (group.isInFeature())
  {
    var feature = worldManager.getFeature(group.featureId);
    
    return worldManager.getTile(feature.tileI, feature.tileJ);
  }
  else
  {
    return worldManager.getTile(group.tileI, group.tileJ);
  }
};

GroupManager.prototype.getGroupMovementAbility = function(groupId)
{
  var group = this.groups[groupId];
  var lowestMovementAbility = 999;
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    var character = characterManager.getCharacter(group.characterIds[i]);
    
    if (character.movementAbility < lowestMovementAbility)
    {
      lowestMovementAbility = character.movementAbility;
    }
  }
  return lowestMovementAbility;
};

GroupManager.prototype.getGroupDiscoveryRadius = function(groupId)
{
  var group = this.groups[groupId];
  var highestDiscoveryRadius = 0;
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    var character = characterManager.getCharacter(group.characterIds[i]);
    
    if (character.discoveryRadius > highestDiscoveryRadius)
    {
      highestDiscoveryRadius = character.discoveryRadius;
    }
  }
  return highestDiscoveryRadius;
};

GroupManager.prototype.moveGroupToTile = function(groupId, tileI, tileJ)
{
  var group = this.getGroup(groupId);
  
  // Add group to world map if currently in a feature
  if (group.isInFeature())
  {
    screenManager.screens[ScreenType.WorldMap].worldGroups.showGroup(groupId);
  }
  
  group.featureId = -1;
  group.tileI = tileI;
  group.tileJ = tileJ;
};

GroupManager.prototype.moveGroupIntoFeature = function(groupId)
{
  var group = this.getGroup(groupId);
  var tile = worldManager.getTile(group.tileI, group.tileJ);
  
  group.featureId = tile.featureId;
  
  // Remove group from world map
  screenManager.screens[ScreenType.WorldMap].worldGroups.hideGroup(groupId);
};

GroupManager.prototype.resetGroupMovement = function()
{
  _.each(this.groups, function(group)
    {
      group.movementUsed = 0;
    });
};

GroupManager.prototype.addCharacterToGroup = function(groupId, characterId)
{
  var group = this.getGroup(groupId);
  
  group.characterIds.push(characterId);
};

GroupManager.prototype.removeCharacterFromGroup = function(groupId, characterId)
{
  var group = this.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    if (group.characterIds[i] == characterId)
    {
      delete group.characterIds[i];
      break;
    }
  }
  
  group.characterIds = _.compact(group.characterIds);
};

GroupManager.prototype.update = function()
{
};