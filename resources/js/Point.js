class Point {
  constructor(dimensions) {
    this.dimensions = dimensions;
    this.closestCentroid;
    this.closestCentroidDistance;
  }
}

Point.prototype.reset = function() {
  this.closestCentroid = undefined;
  this.closestCentroidDistance = undefined;
}

Point.prototype.assignClosest = function(centroid, euclideanDistance) {
  this.closestCentroidDistance = euclideanDistance;
  this.closestCentroid = centroid;
}
