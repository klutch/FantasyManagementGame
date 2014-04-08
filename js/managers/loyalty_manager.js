/*
 * This manager doesn't do much right now, but will eventually handly things like
 * morale and rebellion when I get around to implementing those features.
 */
var LoyaltyManager = function()
{
  
};

LoyaltyManager.prototype.makeLoyal = function(featureId)
{
  var feature = worldManager.world.features[featureId];
  
  feature.isLoyal = true;
};