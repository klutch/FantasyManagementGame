var AdventurerManager = function()
{
  this.adventurers = [];
  this.groups = [];
  this.barracksGroup;
  this.selectedGroupId = -1;
  
  // Create a special barracks group
  this.barracksGroup = new Group(-1, {name: "Barracks", featureId: 0});
};

AdventurerManager.prototype.getNumAdventurers = function()
{
  var count = 0;
  
  for (var i = 0; i < this.adventurers.length; i++)
  {
    if (!this.adventurers[i].isWorker)
    {
      count++;
    }
  }
  return count;
};

AdventurerManager.prototype.getNumWorkers = function()
{
  var count = 0;
  
  for (var i = 0; i < this.adventurers.length; i++)
  {
    if (this.adventurers[i].isWorker)
    {
      count++;
    }
  }
  return count;
};

AdventurerManager.prototype.getAdventurerOffense = function(adventurerId)
{
  return this.adventurers[adventurerId].baseOffense;
};

AdventurerManager.prototype.getAdventurerDefense = function(adventurerId)
{
  return this.adventurers[adventurerId].baseDefense;
};

AdventurerManager.prototype.getAdventurerSupport = function(adventurerId)
{
  return this.adventurers[adventurerId].baseSupport;
};

AdventurerManager.prototype.getGroupOffense = function(groupId)
{
  var total = 0;
  var group = this.groups[groupId];
  
  for (var i = 0; i < group.adventurerIds.length; i++)
  {
    total += this.getAdventurerOffense(group.adventurerIds[i]);
  }
  
  return total;
};

AdventurerManager.prototype.getGroupDefense = function(groupId)
{
  var total = 0;
  var group = this.groups[groupId];
  
  for (var i = 0; i < group.adventurerIds.length; i++)
  {
    total += this.getAdventurerDefense(group.adventurerIds[i]);
  }
  
  return total;
};

AdventurerManager.prototype.getGroupSupport = function(groupId)
{
  var total = 0;
  var group = this.groups[groupId];
  
  for (var i = 0; i < group.adventurerIds.length; i++)
  {
    total += this.getAdventurerSupport(group.adventurerIds[i]);
  }
  
  return total;
};

AdventurerManager.prototype.getUnusedAdventurerId = function()
{
  for (var i = 0; i < this.adventurers.length; i++)
  {
    if (this.adventurers[i] == null)
    {
      return i;
    }
  }
  return this.adventurers.length;
};

AdventurerManager.prototype.getUnusedGroupId = function()
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

AdventurerManager.prototype.createGroup = function(options)
{
  var id = this.getUnusedGroupId();
  var group = new Group(id, options);
  
  this.groups[id] = group;
  
  return group;
};

AdventurerManager.prototype.addAdventurer = function(groupId, adventurer)
{
  var group = this.groups[groupId];
  
  this.adventurers[adventurer.id] = adventurer;
  group.adventurerIds.push(adventurer.id);
};

AdventurerManager.prototype.selectGroup = function(groupId)
{
  var worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  
  if (this.selectedGroupId != -1)
  {
    worldMapScreen.closeSelectedGroupPanel();
  }
  
  this.selectedGroupId = groupId;
  worldMapScreen.openSelectedGroupPanel(groupId);
};

AdventurerManager.prototype.getGroupTile = function(groupId)
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

AdventurerManager.prototype.getGroupMovementAbility = function(groupId)
{
  var group = this.groups[groupId];
  var lowestMovementAbility = 999;
  
  for (var i = 0; i < group.adventurerIds.length; i++)
  {
    var adventurer = this.adventurers[group.adventurerIds[i]];
    
    if (adventurer.movementAbility < lowestMovementAbility)
    {
      lowestMovementAbility = adventurer.movementAbility;
    }
  }
  return lowestMovementAbility;
};

AdventurerManager.prototype.getGroupDiscoveryRadius = function(groupId)
{
  var group = this.groups[groupId];
  var highestDiscoveryRadius = 0;
  
  for (var i = 0; i < group.adventurerIds.length; i++)
  {
    var adventurer = this.adventurers[group.adventurerIds[i]];
    
    if (adventurer.discoveryRadius > highestDiscoveryRadius)
    {
      highestDiscoveryRadius = adventurer.discoveryRadius;
    }
  }
  return highestDiscoveryRadius;
};

AdventurerManager.prototype.moveGroupToTile = function(groupId, tileI, tileJ)
{
  var tile = worldManager.getTile(tileI, tileJ);
  var group = this.groups[groupId];
  
  // Add group to world map if currently in a feature
  if (group.isInFeature())
  {
    screenManager.screens[ScreenType.WorldMap].adventurerGroups.showGroup(groupId);
  }
  
  group.featureId = -1;
  group.tileI = tileI;
  group.tileJ = tileJ;
  group.movementUsed += tile.movementCost;
};

AdventurerManager.prototype.resetGroupMovement = function()
{
  _.each(this.groups, function(group)
    {
      group.movementUsed = 0;
    });
};