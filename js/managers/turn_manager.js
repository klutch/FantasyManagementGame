var TurnManager = function()
{
  this.state = TurnState.Ready;
};

TurnManager.prototype.startProcessing = function()
{
  this.state = TurnState.Processing;
  
  // Stop order setup if necessary
  if (orderManager.settingUpOrder)
  {
    orderManager.endOrderSetup();
  }
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
    raidManager.processRaids();
  }
};