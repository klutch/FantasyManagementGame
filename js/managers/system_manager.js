var SystemType = Object.freeze({
  Character: 0,
  Shop: 1,
  Group: 2,
  Order: 3,
  Raid: 4,
  Resource: 5,
  World: 6,
  GameEvent: 7,
  Loyalty: 8,
  Combat: 9
});

var SystemManager = function()
{
  this.systems = {};
};

SystemManager.prototype.getSystem = function(systemType)
{
  return this.systems[systemType];
};

SystemManager.prototype.addSystem = function(system)
{
  this.systems[system.type] = system;
};

SystemManager.prototype.removeSystem = function(systemType)
{
  delete this.systems[systemType];
};

SystemManager.prototype.update = function()
{
  _.each(this.systems, function(system)
    {
      system.update();
    });
};