var LoyaltySystem = function()
{
  this.type = SystemType.Loyalty;
};

LoyaltySystem.prototype.initialize = function()
{
  this.worldSystem = game.systemManager.getSystem(SystemType.World);
};

LoyaltySystem.prototype.makeLoyal = function(featureId)
{
  var feature = this.worldSystem.world.features[featureId];
  
  feature.isLoyal = true;
};

LoyaltySystem.prototype.update = function()
{
};