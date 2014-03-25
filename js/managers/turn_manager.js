var TurnManager = function()
{
  this.state = TurnState.Ready;
};

TurnManager.prototype.startProcessing = function()
{
  this.state = TurnState.Processing;
};

TurnManager.prototype.endProcessing = function()
{
  this.state = TurnState.Ready;
};

TurnManager.prototype.update = function()
{
  if (this.state == TurnState.Processing)
  {
    orderManager.processQueuedOrders();
  }
};