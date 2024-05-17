class Boundary {
	constructor(x1, y1, x2, y2) {
		this.a = createVector(x1, y1)
		this.b = createVector(x2, y2)
	}
		
	draw() {
		strokeWeight(4); 
		line(this.a.x, this.a.y, this.b.x, this.b.y)
	}
	checkIntersection(x, y) {
			let v1 = createVector(this.a.x, this.a.y);
			let v2 = createVector(this.b.x, this.b.y);
			let point = createVector(x, y);
			let d1 = dist(point.x, point.y, v1.x, v1.y);
			let d2 = dist(point.x, point.y, v2.x, v2.y);
			let lineLength = dist(v1.x, v1.y, v2.x, v2.y);
			let buffer = 0.1;

			return d1 + d2 >= lineLength - buffer && d1 + d2 <= lineLength + buffer;
	}
}