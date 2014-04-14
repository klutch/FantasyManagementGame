var DwellingSystem = function()
{
  this.type = SystemType.Dwelling;
};

DwellingSystem.prototype.initialize = function()
{
  this.worldSystem = game.systemManager.getSystem(SystemType.World);
  this.worldMapScreen = game.screenManager.screens[ScreenType.WorldMap];
  this.shopScreen = game.screenManager.screens[ScreenType.Shop];
  this.worldMap = this.worldMapScreen.worldMap;
};

DwellingSystem.prototype.makeLoyal = function(featureId)
{
  var feature = this.worldSystem.world.features[featureId];
  
  feature.isLoyal = true;
};

// TODO: This function will eventually factor in morale when determining how much
// you have to pay to get someone to work for you.
DwellingSystem.prototype.getWorkerCost = function(featureId, characterId)
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

DwellingSystem.prototype.update = function()
{
  var mouseI = this.worldMap.tileGridI;
  var mouseJ = this.worldMap.tileGridJ;
  
  if (game.state == GameState.WaitingOnPlayer)
  {
    if (game.inputManager.leftButton && !game.inputManager.leftButtonLastFrame && !game.inputManager.leftButtonHandled)
    {
      if (this.worldSystem.doesTileExist(mouseI, mouseJ))
      {
        var tile = this.worldSystem.getTile(mouseI, mouseJ);

        if (tile.featureId != undefined)
        {
          var feature = this.worldSystem.getFeature(tile.featureId);

          if (feature.type == FeatureType.Dwelling && feature.isLoyal)
          {
            game.inputManager.leftButtonHandled = true;
            this.worldMapScreen.inputEnabled = false;
            this.shopScreen.openHirePanel(feature.id);
          }
        }
      }
    }
  }
};