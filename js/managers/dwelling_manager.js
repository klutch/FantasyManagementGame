var DwellingManager = function()
{
};

DwellingManager.prototype.makeLoyal = function(featureId)
{
  var feature = worldManager.world.features[featureId];
  
  feature.isLoyal = true;
};

// TODO: This function will eventually factor in morale when determining how much
// you have to pay to get someone to work for you.
DwellingManager.prototype.getWorkerCost = function(featureId, workerType)
{
  var cost = 0;
  
  if (workerType == WorkerType.Miner)
  {
    cost = 20;
  }
  else if (workerType == WorkerType.Logger)
  {
    cost = 15;
  }
  else if (workerType == WorkerType.Laborer)
  {
    cost = 30;
  }
  
  return cost;
};

DwellingManager.prototype.update = function()
{
};