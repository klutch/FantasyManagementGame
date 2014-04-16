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
  this.combatSystem = game.systemManager.getSystem(SystemType.Combat);
  this.gameEventSystem = game.systemManager.getSystem(SystemType.GameEvent);
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
        var feature = root.worldSystem.getFeature(featureId);
        var group = root.groupSystem.getGroup(groupId);
        var victory = root.combatSystem.doesAttackerWin(groupId, feature.enemyGroupId);
        
        // Victory/defeat event
        if (victory)
        {
          root.gameEventSystem.appendGameEvent(GameEventFactory.createRaidVictoryEvent(groupId, featureId));
        }
        else
        {
          root.gameEventSystem.appendGameEvent(GameEventFactory.createRaidDefeatEvent(groupId, featureId));
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
  
  game.switchToNextState();
};

RaidSystem.prototype.update = function()
{
  if (game.state == GameState.RaidProcessing)
  {
    this.updateRaidProcessingState();
  }
};