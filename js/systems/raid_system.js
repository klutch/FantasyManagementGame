var RaidSystem = function()
{
  this.type = SystemType.Raid;
  this.raids = {};
};

RaidSystem.prototype.initialize = function()
{
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.orderSystem = game.systemManager.getSystem(SystemType.Order);
  this.worldSystem = game.systemManager.getSystem(SystemType.World);
};

RaidSystem.prototype.getUnusedId = function()
{
  var count = 0;
  
  while (this.raids[count] != null) { count++; }
  
  return count;
};

RaidSystem.prototype.createRaid = function(groupId, featureId)
{
  var root = this;
  var raid = new Raid(
    this.getUnusedId(),
    featureId,
    groupId,
    {
      turnsToComplete: 3,
      onComplete: function()
      {
        var group = root.groupSystem.getGroup(groupId);
        var returnPath = game.pathfinderManager.findPath(
          group.tileI,
          group.tileJ,
          root.worldSystem.world.playerCastleI,
          root.worldSystem.world.playerCastleJ);
        
        if (returnPath != null)
        {
          root.orderSystem.createReturnOrder(groupId, returnPath);
        }
        else
        {
          console.error("Couldn't find a return path out of the dungeon.");
        }
      }
    });
  
  this.raids[raid.id] = raid;
};

RaidSystem.prototype.updateRaidProcessingState = function()
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
  
  game.endRaidProcessing();
  game.startEventProcessing();
};

RaidSystem.prototype.update = function()
{
  if (game.state == GameState.RaidProcessing)
  {
    this.updateRaidProcessingState();
  }
};