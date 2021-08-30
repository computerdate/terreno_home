
// Global variables
int Q_VALUE = 81;
int W_VALUE = 87;
int E_VALUE = 69;
int R_VALUE = 82;
int T_VALUE = 84;
int A_VALUE = 65;
int S_VALUE = 83;
int Z_VALUE = 90;
int X_VALUE = 88;

int TIMESTEPS_MAX = 50;
int TIMESTEPS_MIN = 1;
int GRID_RESOLUTION_MAX = 30;
int GRID_RESOLUTION_MIN = 4;

int pressedKey = -1;
int timesteps = 3;
int gridResolution = 11;
boolean doTriangulation = false;
ArrayList<Point> points = new ArrayList<Point>();
ArrayList<Segment> segments = new ArrayList<Segment>();


class Point {
  PVector oldPos = new PVector(0.0, 0.0, 0.0);
  PVector pos = new PVector(0.0, 0.0, 0.0);
  PVector forces = new PVector(0.0, 0.0, 0.0);
  boolean snap = false;
  boolean select = false; 
  float drawSize = 5.0;
  
  Point(float posX, float posY) {
    this.oldPos.set(posX, posY, 0.0);
    this.pos.set(posX, posY, 0.0);
  }
  
  void applyForce(PVector force)
  {
    this.forces.add(force);
  }
  
  void sim() {
    if (! this.snap) {
      // Add gravity
      PVector gravity = new PVector(0, .5, 0);
      this.applyForce(gravity);
          
      // Move point
      PVector velocity = this.pos.get();
      velocity.sub(this.oldPos);
      velocity.add(this.forces);
      float friction = 0.995;
      velocity.mult(friction);
      this.oldPos.set(this.pos);
      this.pos.add(velocity);
      this.forces.mult(0);
    }
  }
  

  void collideToWindow() {
    float border = 10.0;
    float vx = this.pos.x - this.oldPos.x;
    float vy = this.pos.y - this.oldPos.y;
    if (this.pos.y > height - border) {
        float bounce = 0.8;
     this.pos.y = height - border;
     this.oldPos.y = this.pos.y + vy * bounce;
    } else if (this.pos.y < 0 + border) {
     this.pos.y = 0 + border;
     this.oldPos.y = this.pos.y + vy;
    }
    if (this.pos.x < 0 + border) {
         this.pos.x = 0 + border;
     this.oldPos.x = this.pos.x + vx;
    } else if (this.pos.x > width - border) {
        this.pos.x = width - border;
     this.oldPos.x = this.pos.x + vx;
    }    
  }
  
  void draw() {
    if (this.select) {
      fill(255, 0, 0);
    } else if (this.snap) {
      fill(0, 255, 0);
    } else {
      fill(0);
    }
    
    noStroke();
    noFill();
    ellipse(this.pos.x, this.pos.y, this.drawSize, this.drawSize);
  }
}


class Segment {
  Point point1;
  Point point2;
  float restLength = 0.0;
  
  Segment(Point input1, Point input2) {
    this.point1 = input1;
    this.point2 = input2;
    this.restLength = input1.pos.dist(input2.pos);
  }
  
  void sim() {
   float currentLength = this.point1.pos.dist(this.point2.pos);
   float lengthDifference = this.restLength - currentLength;
   float offsetPercent = lengthDifference / currentLength / 2.0;
   
   PVector direction = this.point2.pos.get();
   direction.sub(this.point1.pos);
   direction.mult(offsetPercent);
   
   if (! this.point1.snap) {
     this.point1.pos.sub(direction);
   }
   
   if (! this.point2.snap) {
     this.point2.pos.add(direction);
   }
  }
  
  void draw() {
    line(this.point1.pos.x, this.point1.pos.y, this.point2.pos.x, this.point2.pos.y);
  }
}


Point addPoint(float xPos, float yPos) {
  Point newPoint = new Point(xPos, yPos);
  points.add(newPoint);
  return newPoint;
}


Segment addSegment(Point point1, Point point2) {
  Segment newSegment = new Segment(point1, point2);
  segments.add(newSegment);
  return newSegment;
}


void setup() {
    size(innerWidth-15,innerHeight-15, P3D);
 noCursor();
 resetGrid(doTriangulation);
}

// Create grid
void resetGrid(boolean triangulation) {
 points.clear();
 segments.clear();
 
 float startX = width/3;
 float startY = 50; 
 int gridSize = 500;
 int cellSize = gridSize / gridResolution;
 
 Point lastPoint = null;
 for (int y = 0; y < gridResolution; y++) {
   for (int x = 0; x < gridResolution; x++) {
     Point newPoint = addPoint(startX + (x * cellSize), startY + (y * cellSize) );
     
     if (y == 0) { // Snap points in first row
       if (x == 0 || x == gridResolution-1) {
         newPoint.snap = true;
       }
     } else { // Attach a segment on top
       addSegment(points.get(points.size()-gridResolution-1), newPoint);
       if (triangulation) {
         if (! ( (x+1) % gridResolution == 1) ) { // Add a segment for triangulation
           addSegment(points.get(points.size()-gridResolution-2), newPoint);
         }
       }
     }
     
     if (! ( (x+1) % gridResolution == 1) ) { // Attach a segment to the left
       addSegment(points.get(points.size()-2), newPoint);
     }
   }
 }
}


void draw() {
  background(255);
  stroke(0,255,0);
  strokeWeight(1);
  for (Point pt : points) { pt.sim(); }
  
  for (int timestep = 0; timestep < timesteps; timestep++) {
    for (Segment segment : segments) { segment.sim(); }
    
    for (Point pt : points) { pt.collideToWindow(); }
  }
  
  for (Segment segment : segments) { segment.draw(); }
  
  for (Point pt : points) { pt.draw(); }
}
