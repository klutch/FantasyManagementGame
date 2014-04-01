/*
 *  "A* Pathfinding for Beginners", Patrick Lester - http://www.policyalmanac.org/games/aStarTutorial.htm
 */

var PathNode = function(i, j)
{
  this.i = i;
  this.j = j;
  this.previous = null;
  this.next = null;
  
  // Temporary pathfinding values
  this.f = 0;
  this.g = 0;
  this.h = 0;
};

PathNode.prototype.getHead = function()
{
  var head = this;
  
  while (head.previous != null)
  {
    head = head.previous;
  }
  return head;
};

PathNode.prototype.getTail = function()
{
  var tail = this;
  
  while(tail.next != null)
  {
    tail = tail.next;
  }
  return tail;
}

PathNode.prototype.toString = function()
{
  return this.i + ", " + this.j;
};

var PathfinderManager = function()
{
  this.endI = 0;
  this.endJ = 0;
  this.targetKey = null;
  this.upperBoundI = 0;
  this.upperBoundJ = 0;
  this.lowerBoundI = 0;
  this.lowerBoundJ = 0;
  this.openList = {};
  this.closedList = {};
  this.result = null;
};

PathfinderManager.prototype.findPath = function(startI, startJ, endI, endJ)
{
  var diffI = endI - startI;
  var diffJ = endJ - startJ;
  var sideHalfLength = Math.min(Math.max(Math.floor(Math.sqrt(diffI * diffI + diffJ * diffJ)), 128), 1024);
  var middlePointI = Math.floor((startI + endI) * 0.5);
  var middlePointJ = Math.floor((startJ + endJ) * 0.5);
  var initialNode = new PathNode(startI, startJ);
  
  // Setup bounds
  this.upperBoundI = middlePointI - sideHalfLength;
  this.upperBoundJ = middlePointJ - sideHalfLength;
  this.lowerBoundI = middlePointI + sideHalfLength;
  this.lowerBoundJ = middlePointJ + sideHalfLength;
  
  // Setup initial conditions
  this.endI = endI;
  this.endJ = endJ;
  this.targetKey = endI + ", " + endJ;
  this.openList = {};
  this.closedList = {};
  this.openList[initialNode.toString()] = initialNode;
  
  // Find path
  while (true)
  {
    var status = this.step();
    
    if (status == 1)
    {
      return this.result;
    }
    else if (status == -1)
    {
      return null;
    }
  }
};

PathfinderManager.prototype.findLowestF = function()
{
  var result = null;
  
  // Get first result
  for (var key in this.openList)
  {
    if (this.openList.hasOwnProperty(key))
    {
      result = this.openList[key];
      break;
    }
  }
  
  // Compare f scores
  _.each(this.openList, function(node)
    {
      if (node.f < result.f)
      {
        result = node;
      }
    });
  
  return result;
};

// Performs a pathfinding step -- 
//    Returns 0 if more work needs to be done.
//    Returns 1 if path is found.
//    Returns -1 if no path is found.
PathfinderManager.prototype.step = function()
{
  var selectedNode = this.findLowestF();
  var selectedKey = selectedNode.toString();

  // Move selected node to the closed list
  this.closedList[selectedKey] = selectedNode;
  delete this.openList[selectedKey];

  // Process neighbors
  for (var i = selectedNode.i - 1; i < selectedNode.i + 2; i++)
  {
    for (var j = selectedNode.j - 1; j < selectedNode.j + 2; j++)
    {
      var neighborTile;
      var neighborNode;
      var neighborKey;
      var isDiagonal;

      // Skip selected tile
      if (i == selectedNode.i && j == selectedNode.j)
      {
        continue;
      }

      // Skip out of range neighbor tiles
      if (i < this.upperBoundI || j < this.upperBoundJ || i > this.lowerBoundI || j > this.lowerBoundJ)
      {
        continue;
      }

      // Check if neighbor tile exists (create/store node if it does)
      if (worldManager.doesTileExist(i, j))
      {
        neighborTile = worldManager.getTile(i, j);
        neighborNode = new PathNode(i, j);
        neighborKey = neighborNode.toString();
      }
      else
      {
        continue;
      }

      // Check to make sure tile is discovered
      if (!neighborTile.discovered)
      {
        continue;
      }

      // Check if neighbor tile is walkable
      if (!neighborTile.walkable)
      {
        continue;
      }

      // Check if neighbor tile is in closed list
      if (this.closedList[neighborKey] != null)
      {
        continue;
      }

      // Determine whether neighbor is diagonally adjacent
      isDiagonal = (selectedNode.i - i != 0 && selectedNode.j - j != 0);

      // Check if neighbor node is in the open list
      if (this.openList[neighborKey] == null)
      {
        // Calculate F, G, H, and parent values and add to open list
        this.openList[neighborKey] = neighborNode;
        neighborNode.previous = selectedNode;
        neighborNode.g = selectedNode.g + (isDiagonal ? 14 : 10);
        neighborNode.h = Math.abs(i - this.endI) + Math.abs(j - this.endJ);
        neighborNode.f = neighborNode.g + neighborNode.h;
      }
      else
      {
        // See if G value to neighbor tile from the selected tile is shorter than its current path
        var newG = selectedNode.g + (isDiagonal ? 14 : 10);

        if (newG < neighborNode.g)
        {
          neighborNode.previous = selectedNode;
          neighborNode.g = newG;
          neighborNode.f = neighborNode.g + neighborNode.h;
        }
      }
    }
  }

  // Check if open list is empty (failure)
  if (_.size(this.openList) == 0)
  {
    return -1;
  }

  // Check if target is in closed list (success)
  if (this.closedList[this.targetKey] != null)
  {
    var currentNode = this.closedList[this.targetKey];

    // Build doubly-linked list
    while (currentNode.previous != null)
    {
      currentNode.previous.next = currentNode;
      currentNode = currentNode.previous;
    }
    
    this.result = currentNode;
    return 1;
  }
  
  return 0;
};

PathfinderManager.prototype.update = function()
{
};