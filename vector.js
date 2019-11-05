class vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.magnitude = Math.sqrt(x*x + y*y);
  }
  
  add(v1) {
    return new vector(this.x + v1.x, this.y + v1.y);
  }
  
  subtract(v1) {
     return new vector(this.x - v1.x, this.y - v1.y); 
  }
  
  scale(scalar) {
    return new vector(this.x * scalar, this.y * scalar); 
  }
  
  direction() {
    let theta = Math.atan(this.y / this.x);
    if (this.x < 0) theta += Math.PI;
    return theta;
  }
  
  scaleToMagnitude(m) {
    let dir = this.direction();
    this.x = Math.cos(dir) * m;
    this.y = Math.sin(dir) * m;
    this.magnitude = m;
  }
  
  print() {
    return ("x: " + this.x + ", y: " + this.y);
  }
}