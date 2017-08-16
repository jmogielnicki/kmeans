var points = [];
var centroids = []
var centroidsTwo = []
var colors = ['red', 'blue', 'green', 'purple', 'yellow']

function setup() {
  createCanvas(400, 400)

  for (var i = 0; i < 100; i++) {
    points.push(new Point( dimensions=[random(width), random(height)] ));
  }
  for (var i = 0; i < 3; i++) {
    var color = colors[i]
    centroids.push(new Centroid(
      id=i,
      dimensions=[ random(width), random(height) ],
      color=color
    ));
  }
}

function draw() {
  background(0);
  for (point of points) {
    if (point.closestCentroid) {
      fill(point.closestCentroid.color)
    }
    ellipse(point.dimensions[0], point.dimensions[1], 5, 5);
  }
  for (var i = 0; i < centroids.length; i++) {
    var centroid = centroids[i]
    fill(centroid.color);
    ellipse(centroid.dimensions[0], centroid.dimensions[1], 10, 10);
  }
}

function findEuclideanDistance(pointDimensions, centroidDimensions) {
  var squaredErrorTotal = 0;
  for (var i = 0; i < pointDimensions.length; i++) {
    squaredErrorTotal += Math.pow(pointDimensions[i] - centroidDimensions[i], 2);
  }
  var euclideanDistance = Math.sqrt(squaredErrorTotal);
  return euclideanDistance;
}

function kmeans(points, centroids) {
  for (point of points) {
    point.closestCentroid = {};
    point.closestCentroidDistance = undefined;
    for (centroid of centroids) {
      var euclideanDistance = findEuclideanDistance(centroid.dimensions, point.dimensions);
      if (!point.closestCentroid || !point.closestCentroidDistance || euclideanDistance < point.closestCentroidDistance) {
        point.closestCentroidDistance = euclideanDistance;
        point.closestCentroid = centroid;
      }
    }
  }
  findAverageLocation()
}

function findAverageLocation() {
  for (centroid of centroids) {
    centroid.pointDimensionTotals = [];
    centroid.pointCount = 0;
    for (point of points) {
      // For each point, add up the total for each dimension (e.g [0] is x, [1] is y)
      if (point.closestCentroid == centroid) {
        for (var i = 0; i < point.dimensions.length; i++) {
          if (!centroid.pointDimensionTotals[i]) {
            centroid.pointDimensionTotals[i] = point.dimensions[i];
          } else {
            centroid.pointDimensionTotals[i] += point.dimensions[i];
          }
        }
        centroid.pointCount += 1;
      }
    }
    for (var i = 0; i < centroid.dimensions.length; i++) {
      centroid.dimensions[i] = centroid.pointDimensionTotals[i] / centroid.pointCount;
    }
  }
}

function mousePressed() {
  kmeans(points, centroids)
}
