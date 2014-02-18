var PerlinNoise = function(seed)
{
  this.gridWidth = 64;
  this.gridHeight = 64;
  this.rng = seed == null ? new Math.seedrandom() : new Math.seedrandom(seed);
  this.gradients = [];
  
  // Create gradient grid
  for (var i = 0; i < this.gridWidth; i++)
  {
    this.gradients[i] = [];
    
    for (var j = 0; j < this.gridHeight; j++)
    {
      this.gradients[i][j] = [this.rng() * 2 - 1, this.rng() * 2 - 1];
    }
  }
};

// 2D dot product
PerlinNoise.prototype.dot = function(a, b)
{
  return a[0] * b[0] + a[1] * b[1];
};

// Weight
PerlinNoise.prototype.weight = function(x)
{
  return x*x*x*(x*(x*6-15)+10);
};

// Perlin noise algorithm (slightly modified from 'Simplex Noise Demystified')
// http://webstaff.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
// returns a number between [-1, 1]
PerlinNoise.prototype.get = function(x, y)
{
  // Modify x and y values, otherwise we'll always be dealing with whole numbers
  var noiseX = x / this.gridWidth;
  var noiseY = y / this.gridHeight;
  
  // Get grid cell containing this point
  var gridI = Math.floor(noiseX);
  var gridJ = Math.floor(noiseY);
  
  // Get coordinates relative to its containing grid cell
  var relX = noiseX - gridI;
  var relY = noiseY - gridJ;
  
  // Get gradients
  var g00 = this.gradients[gridI][gridJ];
  var g10 = this.gradients[(gridI + 1) % this.gridWidth][gridJ];
  var g01 = this.gradients[gridI][(gridJ + 1) % this.gridHeight];
  var g11 = this.gradients[(gridI + 1) % this.gridWidth][(gridJ + 1) % this.gridHeight];
  
  // Calculate noise contributions from each corner
  var n00 = this.dot(g00, [relX, relY]);
  var n10 = this.dot(g10, [relX - 1, relY]);
  var n01 = this.dot(g01, [relX, relY - 1]);
  var n11 = this.dot(g11, [relX - 1, relY - 1]);
  
  // Weight contributions
  var nx0 = n00 * (1 - this.weight(relX)) + n10 * this.weight(relX);
  var nx1 = n01 * (1 - this.weight(relX)) + n11 * this.weight(relX);
  var nxy = nx0 * (1 - this.weight(relY)) + nx1 * this.weight(relY);
  
  return nxy;
};