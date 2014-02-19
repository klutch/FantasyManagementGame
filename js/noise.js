var Noise = function(seed, perlinGridWidth, perlinGridHeight, cellGridWidth, cellGridHeight)
{
  this.perlinGridWidth = perlinGridWidth;
  this.perlinGridHeight = perlinGridHeight;
  this.cellGridWidth = cellGridWidth;  // worley
  this.cellGridHeight = cellGridHeight; // worley
  this.rng = seed == null ? new Math.seedrandom() : new Math.seedrandom(seed);
  this.perlinGradients = [];
  this.cellGradients = [];
  
  // Create perlin gradients
  for (var i = 0; i < this.perlinGridWidth; i++)
  {
    this.perlinGradients[i] = [];
    
    for (var j = 0; j < this.perlinGridHeight; j++)
    {
      this.perlinGradients[i][j] = [this.rng() * 2 - 1, this.rng() * 2 - 1];
    }
  }
  
  // Create cell (worley) gradients
  for (var i = 0; i < this.cellGridWidth; i++)
  {
    this.cellGradients[i] = [];
    
    for (var j = 0; j < this.cellGridHeight; j++)
    {
      this.cellGradients[i][j] = [this.rng() * 2 - 1, this.rng() * 2 - 1];
    }
  }
};

// 2D dot product
Noise.prototype.dot = function(a, b)
{
  return a[0] * b[0] + a[1] * b[1];
};

// Perlin weight
Noise.prototype.perlinWeight = function(x)
{
  return x*x*x*(x*(x*6-15)+10);
};

// Perlin noise algorithm (slightly modified from 'Simplex Noise Demystified')
// http://webstaff.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf
Noise.prototype.perlin = function(x, y)
{
  // Modify x and y values, otherwise we'll always be dealing with whole numbers
  var noiseX = x / this.perlinGridWidth;
  var noiseY = y / this.perlinGridHeight;
  
  // Get grid cell containing this point
  var gridI = Math.floor(noiseX);
  var gridJ = Math.floor(noiseY);
  
  // Get coordinates relative to its containing grid cell
  var relX = noiseX - gridI;
  var relY = noiseY - gridJ;
  
  // Get gradients
  var g00 = this.perlinGradients[gridI & (this.perlinGridWidth-1)][gridJ & (this.perlinGridHeight-1)];
  var g10 = this.perlinGradients[(gridI + 1) & (this.perlinGridWidth-1)][gridJ & (this.perlinGridHeight-1)];
  var g01 = this.perlinGradients[gridI & (this.perlinGridWidth-1)][(gridJ + 1) & (this.perlinGridHeight-1)];
  var g11 = this.perlinGradients[(gridI + 1) & (this.perlinGridWidth-1)][(gridJ + 1) & (this.perlinGridHeight-1)];
  
  // Calculate noise contributions from each corner
  var n00 = this.dot(g00, [relX, relY]);
  var n10 = this.dot(g10, [relX - 1, relY]);
  var n01 = this.dot(g01, [relX, relY - 1]);
  var n11 = this.dot(g11, [relX - 1, relY - 1]);
  
  // Weight contributions
  var nx0 = n00 * (1 - this.perlinWeight(relX)) + n10 * this.perlinWeight(relX);
  var nx1 = n01 * (1 - this.perlinWeight(relX)) + n11 * this.perlinWeight(relX);
  var nxy = nx0 * (1 - this.perlinWeight(relY)) + nx1 * this.perlinWeight(relY);
  
  return (nxy + 1) * 0.5;
};

// Cell noise algorithm
Noise.prototype.cell = function(x, y)
{
  var result;
  
  // Scale down position
  var noiseX = x / this.cellGridWidth;
  var noiseY = y / this.cellGridHeight;
  
  // Get grid cell
  var gridI = Math.floor(noiseX);
  var gridJ = Math.floor(noiseY);
  
  // Get position inside cell
  var relX = noiseX - gridI;
  var relY = noiseY - gridJ;
  
  // Find closest point
  var closest = 9999999;
  for (var i = -2; i < 3; i++)
  {
    for (var j = -2; j < 3; j++)
    {
      var cellGridI = (gridI + i) & (this.cellGridWidth - 1);
      var cellGridJ = (gridJ + j) & (this.cellGridHeight - 1);
      var featurePointX = this.cellGradients[cellGridI][cellGridJ][0] + i;
      var featurePointY = this.cellGradients[cellGridI][cellGridJ][1] + j;
      var diff;
      var distance;
      
      diff = [featurePointX - relX, featurePointY - relY];
      distance = this.dot(diff, diff);
      
      if (distance < closest)
      {
        closest = distance;
      }
    }
  }
  
  // Take the square root, and return between [0, 1]
  result = Math.sqrt(closest);
  return Math.max(Math.min(result, 1), 0);
}

// Fractional brownian motion
Noise.prototype.fbm = function(x, y, count, frequency, gain, lacunarity, noiseMethod)
{
  var total = 0;
  var amplitude = gain;
  
  for (var i = 0; i < count; i++)
  {
    total += (noiseMethod.call(this, x * frequency, y * frequency) * 2 - 1) * amplitude;
    frequency *= lacunarity;
    amplitude *= gain;
  }
  
  total = (total + 1) * 0.5;
  
  return total;
};