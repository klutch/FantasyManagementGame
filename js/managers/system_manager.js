var SystemType = Object.freeze({
  Character: 0,
  Dwelling: 1,
  Group: 2,
  Notification: 3,
  Order: 4,
  Raid: 5,
  Resource: 6,
  World: 7
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