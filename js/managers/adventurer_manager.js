var PortraitType = Object.freeze({
  Archer: 0,
  Knight: 1,
  Healer: 2
});

var AdventurerManager = function()
{
  this.adventurers = [];
  this.adventurerSprites = {};
  this.groups = [];
  this.barracksGroup;
  
  // Create portrait sprites
  _.each(PortraitType, function(type)
    {
      this.adventurerSprites[type] = PIXI.Sprite.fromImage(assetPathManager.assetPaths.ui.portraits[type]);
    },
    this);
  
  // Create a barracks group
  this.barracksGroup = this.createGroup({name: "Barracks", takesOrders: false});
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
  
  this.groups[id] = new Group(id, options);
  return this.groups[id];
};

AdventurerManager.prototype.addAdventurer = function(groupId, adventurer)
{
  var group = this.groups[groupId];
  
  this.adventurers[adventurer.id] = adventurer;
  group.adventurerIds.push(adventurer.id);
};