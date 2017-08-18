var points = [];
var centroids = []
var centroidsTwo = []
var colors = ['red', 'blue', 'green', 'purple', 'yellow']

function setup() {
  createCanvas(400, 400)

  for (var i = 0; i < 100; i++) {
    points.push(new Point( dimensions=[random(width), random(height)] ));
  }
  for (var i = 0; i < 5; i++) {
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
  for (centroid of centroids) {
    centroid.display()
  }
  for (var i = 0; i < centroids.length; i++) {
    var centroid = centroids[i]
  }
}

function findEuclideanDistance(pointDimensions, centroidDimensions) {
  // Euclidian distance - a squared + b squared = c squared
  var squaredErrorTotal = 0;
  for (var i = 0; i < pointDimensions.length; i++) {
    squaredErrorTotal += Math.pow(pointDimensions[i] - centroidDimensions[i], 2);
  }
  var euclideanDistance = Math.sqrt(squaredErrorTotal);
  return euclideanDistance;
}

function kmeans(points, centroids) {
  for (point of points) {
    point.reset();
    for (centroid of centroids) {
      centroid.points = [];
      var euclideanDistance = findEuclideanDistance(centroid.dimensions, point.dimensions);
      // If we don't yet have a closest Centroid or if distance to this centroid is less than others,
      // assign it as closest
      if (!point.closestCentroidDistance || euclideanDistance < point.closestCentroidDistance) {
        point.assignClosest(centroid, euclideanDistance);
        centroid.add(point);
      }
    }
  }
  findAverageLocation()
}

function findAverageLocation() {
  for (centroid of centroids) {
    centroid.reset();
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
    // For each dimension, take total and divide by count to get average
    for (var i = 0; i < centroid.dimensions.length; i++) {
      centroid.dimensions[i] = centroid.pointDimensionTotals[i] / centroid.pointCount;
    }
  }
}

function mousePressed() {
  kmeans(points, centroids)
}
