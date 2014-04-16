var CombatSystem = function()
{
  this.type = SystemType.Combat;
};

CombatSystem.prototype.initialize = function()
{
  this.groupSystem = game.systemManager.getSystem(SystemType.Group);
  this.characterSystem = game.systemManager.getSystem(SystemType.Character);
};

CombatSystem.prototype.getFinalOffense = function(groupId, isAttacking)
{
  var offense = this.groupSystem.getGroupOffense(groupId);
  var support = this.groupSystem.getGroupSupport(groupId);
  
  return offense + (isAttacking ? Math.floor(support * 0.66) : 0);
};

CombatSystem.prototype.getFinalDefense = function(groupId, isAttacking)
{
  var defense = this.groupSystem.getGroupDefense(groupId);
  var support = this.groupSystem.getGroupSupport(groupId);
  
  return defense + (isAttacking ? 0 : Math.floor(support * 0.66));
};

CombatSystem.prototype.getWeightedDifference = function(attackerGroupId, defenderGroupId)
{
  var finalOffense = this.getFinalOffense(attackerGroupId, true);
  var finalDefense = this.getFinalDefense(defenderGroupId, false);
  var difference = Math.abs(finalDefense - finalOffense);
  var result = difference / ((finalOffense + finalDefense) * 0.5);
  
  return Math.min(Math.max(result, 0), 1);
};

CombatSystem.prototype.getWeightedUncertainty = function(weightedDifference)
{
  var result = Math.pow(weightedDifference - 1, 12);
  
  return Math.min(Math.max(result, 0), 1);
};

CombatSystem.prototype.doesAttackerWin = function(attackerGroupId, defenderGroupId)
{
  var weightedDifference = this.getWeightedDifference(attackerGroupId, defenderGroupId);
  var weightedUncertainty = this.getWeightedUncertainty(weightedDifference);
  var attackerOffense = this.getFinalOffense(attackerGroupId, true);
  var defenderDefense = this.getFinalDefense(defenderGroupId, false);
  var roll = Math.random();
  var attackerWins;
  
  if (roll <= weightedUncertainty)
  {
    attackerWins = getRandomInt(0, 1) == 0;
  }
  else
  {
    attackerWins = attackerOffense > defenderDefense;
  }
  
  console.log("Simulating combat: " + attackerOffense + " vs. " + defenderDefense + ". Uncertainty: " + weightedUncertainty);
  
  return attackerWins;
};

CombatSystem.prototype.update = function()
{
};