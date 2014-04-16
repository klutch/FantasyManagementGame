var GameEventSystem = function()
{
  this.type = SystemType.GameEvent;
  this.currentGameEvent = null;
};

GameEventSystem.prototype.initialize = function()
{
};

GameEventSystem.prototype.getGameEvent = function(index)
{
  var count = 0;
  var current = this.currentGameEvent;
  
  while (count != index)
  {
    count++;
    current = current.next;
  }
  
  return current;
};

GameEventSystem.prototype.appendGameEvent = function(event)
{
  if (this.currentGameEvent == null)
  {
    this.currentGameEvent = event;
  }
  else
  {
    var index = this.currentGameEvent.getTail().getIndex();
    
    this.insertGameEventAfter(index, event);
  }
};

GameEventSystem.prototype.insertGameEventAfter = function(index, event)
{
  if (this.currentGameEvent == null)
  {
    this.currentGameEvent = event;
  }
  else
  {
    var targetNode = this.getGameEvent(index);
    
    if (targetNode.next != null)
    {
      targetNode.next.previous = event;
    }
    event.previous = targetNode;
    event.next = targetNode.next;
    targetNode.next = event;
  }
};

GameEventSystem.prototype.removeGameEvent = function(event)
{
  if (event.previous != null)
  {
    event.previous.next = event.next;
  }
  if (event.next != null)
  {
    event.next.previous = event.previous;
  }
  if (this.currentGameEvent == event)
  {
    this.currentGameEvent = event.next;
  }
};

GameEventSystem.prototype.updateEventProcessingState = function()
{
  if (this.currentGameEvent == null)
  {
    game.switchToNextState();
  }
  else
  {
    if (!this.currentGameEvent.isInitialized)
    {
      this.currentGameEvent.initialize();
      this.currentGameEvent.isInitialized = true;
    }
    
    this.currentGameEvent.doWork();
    
    if (this.currentGameEvent.isComplete())
    {
      this.currentGameEvent.onComplete();
      this.removeGameEvent(this.currentGameEvent);
    }
  }
};

GameEventSystem.prototype.update = function()
{
  if (game.state == GameState.EventProcessing)
  {
    this.updateEventProcessingState();
  }
};