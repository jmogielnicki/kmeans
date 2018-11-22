class Point {
  constructor(dimensions) {
    this.dimensions = dimensions;
    this.lineDimensions;
    this.closestCentroid;
    this.closestCentroidDistance;
    this.color = [200, 200, 200];
    this.easing = 0.1;
  }
}

Point.prototype.reset = function() {
  this.closestCentroid = undefined;
  this.closestCentroidDistance = undefined;
}

Point.prototype.assignClosest = function(centroid, euclideanDistance) {
  if (!this.closestCentroid || this.closestCentroid.id != centroid.id) {
    this.lineDimensions = [...centroid.dimensions];
  }
  this.closestCentroidDistance = euclideanDistance;
  this.closestCentroid = centroid;
}

Point.prototype.update = function() {
  if (this.closestCentroid) {
    this.color = this.closestCentroid.color;
    for (var i = 0; i < this.dimensions.length; i++) {
      let delta = this.dimensions[i] - this.lineDimensions[i];
      this.lineDimensions[i] += delta * this.easing;
    }

  }
}

Point.prototype.display = function() {
  strokeWeight(1);
  stroke(0);
  fill(...this.color, 160);
  ellipse(point.dimensions[0], point.dimensions[1], 8, 8);
  if (this.closestCentroid) {
    strokeWeight(1);
    stroke(...this.color, 60);
    line(this.lineDimensions[0], this.lineDimensions[1], this.closestCentroid.dimensions[0], this.closestCentroid.dimensions[1])
  }
}
