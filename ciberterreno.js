int cols, rows;
int scl = 50;
int w = 1600;
int h = 1600;

float flying = 0;

float[][] terrain;

void setup() {
    size(innerWidth-15,innerHeight-15, P3D);
  noCursor();
  frameRate(18);
  cols = w / scl;
  rows = h / scl;
  terrain = new float[cols][rows];
} 

void draw() {
  background(255);
  stroke(255);
  strokeWeight(.3);
  fill(0,255,0);
  
  
  flying -= 0.03;
  
  float yoff = flying;
  for (int y = 0; y < rows; y++){
    float xoff = 0;
   for (int x = 0; x < cols; x++){
      terrain[x][y] = map(noise(xoff,yoff),0,1,-100,300);
      xoff += 0.1;
    }
    yoff += 0.1;
  }
  
  translate(width/2,height/2, -width);
  rotateX(PI/3);
  //frameRate(60);
  translate(-w/2,-h/2);
  for (int y = 0; y < rows-1; y++){
    beginShape(QUAD_STRIP);
   for (int x = 0; x < cols; x++){
      vertex(x*scl,y*scl,terrain[x][y]);
      vertex(x*scl,(y+1)*scl,terrain[x][y+1]);
      }
    endShape();
  }

}
