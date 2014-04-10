var RaidManager = function()
{
  this.raids = [];
};

RaidManager.prototype.getUnusedId = function()
{
  var count = 0;
  
  while (this.raids[count] != null) { count++; }
  
  return count;
};

RaidManager.prototype.createRaid = function(featureId, groupId)
{
  var raid = new Raid(
    this.getUnusedId(),
    featureId,
    groupId,
    {
      turnsToComplete: 3,
      onComplete: function()
      {
        var group = groupManager.getGroup(groupId);
        var returnPath = PathfinderHelper.findPath(group.tileI, group.tileJ, worldManager.world.playerCastleI, worldManager.world.playerCastleJ);
        
        if (returnPath != null)
        {
          screenManager.screens[ScreenType.WorldMap].pathPreview.drawPath(returnPath);
          orderManager.createReturnOrder(groupId, returnPath);
        }
        else
        {
          console.error("Couldn't find a return path out of the dungeon.");
        }
      }
    });
  
  this.raids[raid.id] = raid;
};

RaidManager.prototype.processRaids = function()
{
  var completedRaids = [];
  
  // Process raids
  _.each(this.raids, function(raid)
    {
      raid.turnsPassed++;
      
      if (raid.turnsPassed >= raid.turnsToComplete)
      {
        completedRaids.push(raid);
      }
    });
  
  // Handle completed raids
  for (var i = 0; i < completedRaids.length; i++)
  {
    var raid = completedRaids[i];
    
    raid.onComplete();
    delete this.raids[raid.id];
  }
};

RaidManager.prototype.update = function()
{
};