const BOID_COUNT = 200;
let boids = [];
let nextIdentifier = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < BOID_COUNT; i++) {
    boids[i] = new boid();
  }
  angleMode(DEGREES);
  frameRate(60);
}

function draw() {
  background(35);
  for (let i = 0; i < boids.length; i++) {
    boids[i].update();
    boids[i].draw();
  }

}

const I_VELOCITY = 3;
const VIEW_DIST = 100;
const MIN_PROXIMITY = 25;
const DRAW_SIZE = 20;
const ALIGNMENT_ENABLED = true;
const COHESION_ENABLED = true;
const SEPARATION_ENABLED = true;

class boid {
  constructor() {
    this.position = new vector(random(width), random(height));
    this.velocity = new vector(random(-5, 5), random(-5, 5));
    this.velocity.scaleToMagnitude(1);
    this.speed = I_VELOCITY;
    this.identifier = nextIdentifier++;
  }

  update() {
    let neighbors = this.getNeighbors();
    let v1 = this.cohesionRule(neighbors);
    let v2 = this.separationRule(neighbors);
    let v3 = this.alignmentRule(neighbors);
    this.velocity = this.velocity.scale(25).add(v1.add(v2.add(v3)));
    this.velocity.scaleToMagnitude(0.5);
    this.position = this.position.add(this.velocity.scale(this.speed));
    this.position = new vector((this.position.x + width) % width, (this.position.y + height) % height);

  }

  cohesionRule(fm) {
    if (fm.length == 0 || !COHESION_ENABLED) return new vector(0, 0);
    let x = 0;
    let y = 0;
    for (let i = 0; i < fm.length; i++) {
      x += fm[i].position.x;
      y += fm[i].position.y;
    }
    x /= fm.length;
    y /= fm.length;
    let v = new vector(x - this.position.x, y - this.position.y)
    v.scaleToMagnitude(1);
    return v.scale(1);
  }

  separationRule(fm) {
    if (fm.length == 0 || !SEPARATION_ENABLED) return new vector(0, 0);
    let x = 0;
    let y = 0;
    let farCounter = 0;
    for (let i = 0; i < fm.length; i++) {
      if (fm[i].position.subtract(this.position).magnitude >
        MIN_PROXIMITY) {
        farCounter++;
        continue;
      }
      x += fm[i].position.x;
      y += fm[i].position.y;
    }
    if (farCounter == fm.length) return new vector(0, 0);
    x /= (fm.length - farCounter);
    y /= (fm.length - farCounter);
    let v = new vector(x - this.position.x, y - this.position.y)
    v.scaleToMagnitude(1);
    v = v.scale(-5)
    return v;
  }

  alignmentRule(fm) {
    if (fm.length == 0 || !ALIGNMENT_ENABLED) return new vector(0, 0);
    let x = 0;
    let y = 0;
    for (let i = 0; i < fm.length; i++) {
      x += fm[i].velocity.x;
      y += fm[i].velocity.y;
    }
    x /= fm.length;
    y /= fm.length;
    let v = new vector(x - this.velocity.x, y - this.velocity.y)
    v.scaleToMagnitude(1);
    return v.scale(0.5);
  }

  draw() {
    noStroke();
    fill(75, 25);
    fill(240);
    let direction = this.velocity.direction();
    let p = this.position;
    triangle(p.x + cos(direction) * DRAW_SIZE, p.y + sin(direction) * DRAW_SIZE, p.x + cos(direction + 90) * DRAW_SIZE / 4, p.y + sin(direction + 90) * DRAW_SIZE / 4, p.x + cos(direction - 90) * DRAW_SIZE / 4, p.y + sin(direction - 90) * DRAW_SIZE / 4);
    stroke(240);
    strokeWeight(1);
  }

  getNeighbors() {
    let neighbors = [];
    for (let i = 0; i < boids.length; i++) {
      if (boids[i].identifier == this.identifier) {
        continue;
      }
      let toBoid = boids[i].position.subtract(this.position);
      if (toBoid.magnitude <= VIEW_DIST) {
        neighbors.push(boids[i]);
        stroke(240)
        strokeWeight(2);

      }
    }
    return neighbors;
  }
}