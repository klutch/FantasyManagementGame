var ItemSpriteType = Object.freeze({
  Default: 0
});

var Item = function(id, options)
{
  options = options || {};
  options.offense = options.offense || 0;
  options.defense = options.defense || 0;
  options.support = options.support || 0;
  options.movementBonus = options.movementBonus || 0;
  options.isEquippable = options.isEquippable || false;
  options.spriteType = options.spriteType || ItemSpriteType.Default;
  
  for (var key in options)
  {
    if (options.hasOwnProperty(key))
    {
      this[key] = options[key];
    }
  }
  
  this.id = id;
};