var GameEventNode = function(options)
{
  options.doWork = options.doWork || function() {};
  options.onComplete = options.onComplete || function() {};
  
  this.next = null;
  this.previous = null;
  
  for (var key in options)
  {
    if (options.hasOwnProperty(key))
    {
      this[key] = options[key];
    }
  }
};

GameEventNode.prototype.getHead = function()
{
  var current = this;
  
  while(current.previous != null) { current = current.previous; }
  
  return current;
};

GameEventNode.prototype.getTail = function()
{
  var current = this;
  
  while(current.next != null) { current = current.next; }
  
  return current;
};

GameEventNode.prototype.getIndex = function()
{
  var current = this.getHead();
  var count = 0;
  
  while (current != this)
  {
    count++;
    current = current.next;
  }
  
  return count;
};