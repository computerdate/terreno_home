int cols, rows;
int scl=20;
int w = 1200;
int h= 900;
float[][] terrain;
float flying =3;
 


void setup(){
    size(innerWidth-15,innerHeight-15, P3D);
    noCursor();
    frameRate(2000);
    smooth(20);
    cols = w / scl;
    rows = h/scl;
    terrain = new float [cols][rows];
}

void draw()
{
    flying -= 0.1;
    float yoff = flying;
    for(int y=0; y< rows; y++){
    float xoff= 0;
       for(int x = 0;x<cols; x++){
       terrain[x][y] =map(noise(xoff,yoff),0,1,-50,100);
       xoff+= 0.2;
    }
yoff+=0.2;
}
background(255);
stroke(0,255,0);
strokeWeight(1);
noFill();
translate(width/2,height/2);
translate(-w/2,-h/2);
for(int y=0; y< rows-1; y++){
beginShape(QUAD_STRIP);
for(int x = 0;x<cols; x++){
vertex(x*scl,y*scl,terrain[x][y]);
vertex(x*scl,(y+1)*scl,terrain[x][y+1]);
}
endShape();
}
 
}
