var OrderManager = function()
{
  this.queuedOrders = [];
};

OrderManager.prototype.getUnusedId = function()
{
  var count = 0;
  
  while (this.queuedOrders[count] != null) { count++; }
  
  return count;
};

OrderManager.prototype.addOrder = function(order)
{
  this.queuedOrders[order.id] = order;
};

OrderManager.prototype.cancelOrder = function(orderId)
{
  delete this.queuedOrders[order.id];
};

OrderManager.prototype.processOrder = function(order)
{
};

OrderManager.prototype.update = function()
{
  var completedOrders = [];
  
  // Process orders
  _.each(this.queuedOrders, function(order)
    {
      this.processOrder(order);
      if (order.isComplete())
      {
        completedOrders.push(order);
      }
    },
    this);
  
  // Handle completed orders
  for (var i = 0; i < completedOrders.length; i++)
  {
    var order = completedOrders[i];
    
    if (order.onComplete != null)
    {
      order.onComplete();
    }
    delete this.queuedOrders[order.id];
  }
};