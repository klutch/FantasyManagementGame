var GroupSystem = function()
{
  this.type = SystemType.Group;
  this.groups = [];
  this.barracksGroup;
  this.selectedGroupId = -1;
};

GroupSystem.prototype.initialize = function()
{
  var startingGroup;
  var worldMapScreen;
  
  this.worldSystem = game.systemManager.getSystem(SystemType.World);
  this.characterSystem = game.systemManager.getSystem(SystemType.Character);
  
  startingGroup = this.createGroup({name: "Starting Group", featureId: this.worldSystem.world.playerCastleFeatureId});
  worldMapScreen = game.screenManager.screens[ScreenType.WorldMap];
  
  // Create a special barracks group
  this.barracksGroup = new Group(
    -1,
    {
      name: "Barracks",
      featureId: this.worldSystem.world.playerCastleFeatureId,
      capacity: MAX_BARRACKS_CAPACITY
    });
  
  // Create starting group
  this.addCharacterToGroup(startingGroup.id, CharacterFactory.createArcher(10).id);
  this.addCharacterToGroup(startingGroup.id, CharacterFactory.createArcher(10).id);
  this.addCharacterToGroup(startingGroup.id, CharacterFactory.createKnight(10).id);
  this.addCharacterToGroup(startingGroup.id, CharacterFactory.createKnight(10).id);
  this.addCharacterToGroup(startingGroup.id, CharacterFactory.createHealer(10).id);
  worldMapScreen.groupMenu.addGroup(startingGroup.id);
  
  // Temporary groups
  for (var i = 0; i < 15; i++)
  {
    var group = this.createGroup({playerControlled: true, featureId: this.worldSystem.world.playerCastleFeatureId});
    
    this.addCharacterToGroup(group.id, CharacterFactory.createArcher(10).id);
    this.addCharacterToGroup(group.id, CharacterFactory.createArcher(10).id);
    this.addCharacterToGroup(group.id, CharacterFactory.createKnight(10).id);
    this.addCharacterToGroup(group.id, CharacterFactory.createKnight(10).id);
    this.addCharacterToGroup(group.id, CharacterFactory.createHealer(10).id);
    worldMapScreen.groupMenu.addGroup(group.id);
  }
  
  // Temporary characters in barracks
  for (var i = 0; i < 40; i++)
  {
    var powerLevel = Math.floor(50 * Math.random());
    
    this.addCharacterToGroup(this.barracksGroup.id, CharacterFactory.createKnight(powerLevel).id); 
  }
};

GroupSystem.prototype.getGroup = function(groupId)
{
  if (groupId == -1)
  {
    return this.barracksGroup;
  }
  else
  {
    return this.groups[groupId];
  }
};

GroupSystem.prototype.getPlayerControlledGroups = function()
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

GroupSystem.prototype.getNumPlayerAdventurers = function()
{
  var count = 0;
  var playerGroups = this.getPlayerControlledGroups();
  
  for (var i = 0; i < playerGroups.length; i++)
  {
    var group = playerGroups[i];
    
    for (var j = 0; j < group.characterIds.length; j++)
    {
      var character = this.characterSystem.getCharacter(group.characterIds[j]);
      
      if (!character.isWorker)
      {
        count++;
      }
    }
  }
  return count;
};

GroupSystem.prototype.getNumPlayerWorkers = function()
{
  var count = 0;
  var playerGroups = this.getPlayerControlledGroups();
  
  for (var i = 0; i < playerGroups.length; i++)
  {
    var group = playerGroups[i];
    
    for (var j = 0; j < group.characterIds.length; j++)
    {
      var character = this.characterSystem.getCharacter(group.characterIds[j]);
      
      if (character.isWorker)
      {
        count++;
      }
    }
  }
  return count;
};

GroupSystem.prototype.getGroupOffense = function(groupId)
{
  var total = 0;
  var group = this.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    total += this.characterSystem.getCharacterOffense(group.characterIds[i]);
  }
  
  return total;
};

GroupSystem.prototype.getGroupDefense = function(groupId)
{
  var total = 0;
  var group = this.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    total += this.characterSystem.getCharacterDefense(group.characterIds[i]);
  }
  
  return total;
};

GroupSystem.prototype.getGroupSupport = function(groupId)
{
  var total = 0;
  var group = this.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    total += this.characterSystem.getCharacterSupport(group.characterIds[i]);
  }
  
  return total;
};

GroupSystem.prototype.getUnusedGroupId = function()
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

GroupSystem.prototype.createGroup = function(options)
{
  var id = this.getUnusedGroupId();
  var group = new Group(id, options);
  
  this.groups[id] = group;
  
  return group;
};

GroupSystem.prototype.deleteGroup = function(groupId)
{
  var orderSystem = game.systemManager.getSystem(SystemType.Order);
  var worldMapScreen = game.screenManager.screens[ScreenType.WorldMap];
  var group = this.getGroup(groupId);
  
  // Deselect group if selected
  if (this.selectedGroupId == groupId)
  {
    this.deselectGroup();
  }
  
  // Remove group from player's group menu
  if (group.playerControlled)
  {
    worldMapScreen.groupMenu.removeGroup(groupId);
  }
  
  // Cancel all of a group's orders
  orderSystem.cancelAllOrders(groupId);
  
  // Remove group from world map
  if (!group.isInFeature())
  {
    worldMapScreen.worldGroups.hideGroup(groupId);
  }
  
  delete this.groups[groupId];
};

GroupSystem.prototype.selectGroup = function(groupId)
{
  var worldMapScreen = game.screenManager.screens[ScreenType.WorldMap];
  
  if (this.selectedGroupId != -1)
  {
    worldMapScreen.closeSelectedGroupPanel();
  }
  
  this.selectedGroupId = groupId;
  worldMapScreen.openSelectedGroupPanel(groupId);
};

GroupSystem.prototype.deselectGroup = function()
{
  if (this.selectedGroupId != -1)
  {
    var worldMapScreen = game.screenManager.screens[ScreenType.WorldMap];
    
    worldMapScreen.closeSelectedGroupPanel();
    this.selectedGroupId = -1;
  }
}

GroupSystem.prototype.getGroupTile = function(groupId)
{
  var group = this.getGroup(groupId);
  
  if (group.isInFeature())
  {
    var feature = this.worldSystem.getFeature(group.featureId);
    
    return this.worldSystem.getTile(feature.tileI, feature.tileJ);
  }
  else
  {
    return this.worldSystem.getTile(group.tileI, group.tileJ);
  }
};

GroupSystem.prototype.getGroupMovementAbility = function(groupId)
{
  var group = this.groups[groupId];
  var lowestMovementAbility = 999;
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    var character = this.characterSystem.getCharacter(group.characterIds[i]);
    
    if (character.movementAbility < lowestMovementAbility)
    {
      lowestMovementAbility = character.movementAbility;
    }
  }
  return lowestMovementAbility;
};

GroupSystem.prototype.getGroupDiscoveryRadius = function(groupId)
{
  var group = this.getGroup(groupId);
  var highestDiscoveryRadius = 0;
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    var character = this.characterSystem.getCharacter(group.characterIds[i]);
    
    if (character.discoveryRadius > highestDiscoveryRadius)
    {
      highestDiscoveryRadius = character.discoveryRadius;
    }
  }
  return highestDiscoveryRadius;
};

GroupSystem.prototype.canGroupExplore = function(groupId)
{
  var group = this.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    var character = this.characterSystem.getCharacter(group.characterIds[i]);
    
    if (character.isExplorer)
    {
      return true;
    }
  }
  return false;
};

GroupSystem.prototype.canGroupMine = function(groupId)
{
  var group = this.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    var character = this.characterSystem.getCharacter(group.characterIds[i]);
    
    if (character.isMiner)
    {
      return true;
    }
  }
  return false;
};

GroupSystem.prototype.canGroupLog = function(groupId)
{
  var group = this.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    var character = this.characterSystem.getCharacter(group.characterIds[i]);
    
    if (character.isLogger)
    {
      return true;
    }
  }
  return false;
};

GroupSystem.prototype.canGroupVisitDwelling = function(groupId)
{
  var group = this.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    var character = this.characterSystem.getCharacter(group.characterIds[i]);
    
    if (!character.isWorker)
    {
      return true;
    }
  }
  return false;
};

GroupSystem.prototype.canGroupVisitGathering = function(groupId)
{
  var group = this.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    var character = this.characterSystem.getCharacter(group.characterIds[i]);
    
    if (!character.isWorker)
    {
      return true;
    }
  }
  return false;
};

GroupSystem.prototype.canGroupRaid = function(groupId)
{
  var group = this.getGroup(groupId);
  
  for (var i = 0; i < group.characterIds.length; i++)
  {
    var character = this.characterSystem.getCharacter(group.characterIds[i]);
    
    if (!character.isWorker)
    {
      return true;
    }
  }
  return false;
};

GroupSystem.prototype.moveGroupToTile = function(groupId, tileI, tileJ)
{
  var group = this.getGroup(groupId);
  
  // Add group to world map if currently in a feature
  if (group.isInFeature())
  {
    game.screenManager.screens[ScreenType.WorldMap].worldGroups.showGroup(groupId);
  }
  
  group.featureId = -1;
  group.tileI = tileI;
  group.tileJ = tileJ;
};

GroupSystem.prototype.moveGroupIntoFeature = function(groupId)
{
  var group = this.getGroup(groupId);
  var tile = this.worldSystem.getTile(group.tileI, group.tileJ);
  
  group.featureId = tile.featureId;
  
  // Remove group from world map
  game.screenManager.screens[ScreenType.WorldMap].worldGroups.hideGroup(groupId);
};

GroupSystem.prototype.resetGroupMovement = function()
{
  _.each(this.groups, function(group)
    {
      group.movementUsed = 0;
    });
};

GroupSystem.prototype.addCharacterToGroup = function(groupId, characterId)
{
  var group = this.getGroup(groupId);
  
  group.characterIds.push(characterId);
};

GroupSystem.prototype.removeCharacterFromGroup = function(groupId, characterId)
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

GroupSystem.prototype.update = function()
{
};