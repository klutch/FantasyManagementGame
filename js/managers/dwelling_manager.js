var DwellingManager = function()
{
};

DwellingManager.prototype.initialize = function()
{
  this.worldMapScreen = screenManager.screens[ScreenType.WorldMap];
  this.worldMap = this.worldMapScreen.worldMap;
};

DwellingManager.prototype.makeLoyal = function(featureId)
{
  var feature = worldManager.world.features[featureId];
  
  feature.isLoyal = true;
};

// TODO: This function will eventually factor in morale when determining how much
// you have to pay to get someone to work for you.
DwellingManager.prototype.getWorkerCost = function(featureId, characterId)
{
  var cost = 0;
  var character = characterManager.characters[characterId];
  
  if (character.isMiner)
  {
    cost = 20;
  }
  else if (character.isLogger)
  {
    cost = 15;
  }
  else if (character.isLaborer)
  {
    cost = 30;
  }
  
  return cost;
};

DwellingManager.prototype.update = function()
{
  var mouseI = this.worldMap.tileGridI;
  var mouseJ = this.worldMap.tileGridJ;
  
  if (inputManager.leftButton && !inputManager.leftButtonLastFrame && !inputManager.leftButtonHandled)
  {
    if (worldManager.doesTileExist(mouseI, mouseJ))
    {
      var tile = worldManager.getTile(mouseI, mouseJ);
      
      if (tile.featureId != undefined)
      {
        var feature = worldManager.getFeature(tile.featureId);
        
        if (feature.type == FeatureType.Dwelling && feature.isLoyal)
        {
          this.worldMapScreen.openHirePanel(tile.featureId);
        }
      }
    }
  }
};