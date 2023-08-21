function getRandomBackground(){
    let pick = floor(random(0, backgrounds.length));
    var col = backgrounds[pick];
    return col;
}

function populateEdgeTileArrays(){
    for (let index = segments-1; index < segments*ySegments; index+=segments) {
        rightEdgeTiles.push(index);
    } 
    for (let index = 0; index < ((segments*(ySegments-1))+1); index+=segments) {
        leftEdgeTiles.push(index);
    }
    for (let index = (segments*(ySegments-1)); index < segments*ySegments; index++) {
        bottomEdgeTiles.push(index);
    }
    for (let index = 0; index < segments; index++) {
        topEdgeTiles.push(index);
    }
}
var segments = 40;
var ySegments;
var Tiles = [];
var tileIndex = 0;
const palette1 = ['#1A4568', '#5F84A1', '#90AFC4', '#B6D0E1', '#CBDEED'];
const palette2 = ['#981C1C', '#AB2020', '#BF2424', '#C53939', '#CB4F4F'];
const palette3 = ['#212226', '#1E4040', '#255954', '#3A8C7D', '#71D99E'];
const palette4 = ['#F5F2DF', '#E07A5F', '#3D405B', '#81B29A', '#F2CC8F'];
const palette5 = ['#062F40', '#025951', '#1D734B', '#168C40', '#82D92B'];
const palette6 = ['#F22E62', '#FDEBEB', '#038C8C', '#F25C05', '#F2F2F2'];
const palette7 = ['#F2AA52', '#F29849', '#D95204', '#A62F03', '#591607'];
const palette8 = ['#499EBF', '#5BD9D9', '#F2C879', '#F29966', '#F28177'];
const palette9 = ['#1B80BF', '#0D0D0D', '#F2F2F2', '#F27329', '#F25F29'];
const palette10 = ['#6BBCC7', '#49676B', '#E66C6E', '#A3728C', '#93CCB3'];
const palette11 = ['#F24B88', '#6080BF', '#63AEBF', '#F2B441', '#F2695C'];
const palette12 = ['#C45404', '#D28F29', '#9CC4BC', '#416975', '#0E393D'];
const palette13 = ['#59484F', '#8ABFAC', '#F2E0BD', '#F29966', '#F25E5E'];

const backgrounds = ['#F7A8B1', '#C4F2D4', '#FAEEE1'];
var rightEdgeTiles = [];
var leftEdgeTiles = [];
var bottomEdgeTiles = [];
var topEdgeTiles = [];
var edgeTiles = [];
var traversed = [];
var edgeBorder = 200;

function setup() {
  createCanvas(2000, 3000);
  ySegments = segments*(height-2*edgeBorder)/(width-2*edgeBorder);
  console.log(ySegments);
  pixelDensity(4); // Change resolution of image
  noLoop();

}

function draw() {
  //background(getRandomBackground());
  background(backgrounds[2]);
  let spacing = (width -2*edgeBorder) / segments;
  populateEdgeTileArrays();
  stroke(0);
  
  for (let y = edgeBorder; y < height - edgeBorder; y += spacing) {
    for (let x = edgeBorder; x < width - edgeBorder; x += spacing) {
      if (random(1) < random(0.5)) {
        // Make triangles for color filling
        Tiles.push(new forwardSlash(x, y, spacing, tileIndex));
      } else {
        Tiles.push(new backSlash(x, y, spacing, tileIndex));
      }
      tileIndex++;
    }
  }
  console.log(Tiles.length);
  for (let index = 0; index < Tiles.length; index++) {
    if (Tiles[index].getType() == "forwardSlash") {
      if (Tiles[index].getUpper().getColor() == null) {
        Tiles[index].getUpper().getRandomColorFromPalette();
        if (!Tiles[index].getArrayIndex() == 0) {
          traversePathFromSeed(Tiles[index], index - 1, index, Tiles[index].getUpper());
        }
        traversePathFromSeed(Tiles[index], index - segments, index, Tiles[index].getUpper());
        traversed = [];
      } else if (Tiles[index].getLower().getColor() == null) {
        Tiles[index].getLower().getRandomColorFromPalette();
        traversePathFromSeed(Tiles[index], index + segments, index, Tiles[index].getLower());
        traversePathFromSeed(Tiles[index], index + 1, index, Tiles[index].getLower());
        traversed = [];
      }

    } else {
      if (Tiles[index].getUpper().getColor() == null) {
        Tiles[index].getUpper().getRandomColorFromPalette();
        traversePathFromSeed(Tiles[index], index - segments, index, Tiles[index].getUpper());
        traversePathFromSeed(Tiles[index], index + 1, index, Tiles[index].getUpper());
        traversed = [];
      } else if (Tiles[index].getLower().getColor() == null) {
        Tiles[index].getLower().getRandomColorFromPalette();
        if (!Tiles[index].getArrayIndex() == 0) {
          traversePathFromSeed(Tiles[index], index - 1, index, Tiles[index].getLower());
        }
        traversePathFromSeed(Tiles[index], index + segments, index, Tiles[index].getLower());
        traversed = [];
      }
    }
  }



  //render tiles
  for (let index = 0; index < Tiles.length; index++) {
    Tiles[index].getUpper().render();
    Tiles[index].getLower().render();
    stroke('#000000');
    line(Tiles[index].getLineX1(), Tiles[index].getLineY1(), Tiles[index].getLineX2(), Tiles[index].getLineY2()).strokeCap(PROJECT);
    
  }
}

function traversePathFromSeed(_seed, _current, _prev, _triangle) {
  const seed = _seed;
  let current = _current;
  let prev = _prev;
  let temp;
  const triangle = _triangle;
  let go = true;
  if (!Tiles[prev] == seed) {
    traversed.push(prev);
  }
  while (go) {
    if (current < 0 || current > (segments * ySegments - 1)) {
      go = false;
      //console.log(current, " 1");
      break;
    }
    else if (current == (prev - 1) && leftEdgeTiles.includes(prev)) {
      go = false;
      //console.log(current, "2");
      break;
    }
    else if (current == (prev + 1) && rightEdgeTiles.includes(prev)) {
      go = false;
      //console.log(current, " 3");
      break;
    }
    else if (traversed.includes(current)) {
      go = false;
      //console.log(current, " 4");
      break;
    }
    if (Tiles[current].findCorrectTriangle(prev).getColor() == null) {
      Tiles[current].findCorrectTriangle(prev).setColor(triangle.getColor());
    }
    temp = current;
    current = Tiles[current].whereIsNext(prev);
    prev = temp;
    if (Tiles[current] === seed && seed.getUpper().getColor() != null && seed.getLower().getColor() != null) {
      break;
    }
  }
}

function keyTyped(){
  if (key === 's'){
    save('export.png');
  }
}
class tile {
    constructor(_x,_y, _tileW, _index){
        this.topX1 = _x;
        this.topY1 = _y;
        this.bottomX1 = _x;
        this.bottomY1 = _y;
        this.tileW = _tileW;
        this.arrayIndex = _index;
        this.next;
        this.ptr_right = _index + 1;
        this.ptr_left = _index - 1;
        this.ptr_up = _index - segments; 
        this.ptr_down = _index + segments;
    }
   
    getArrayIndex(){
        return this.arrayIndex;
    }
}

class forwardSlash extends tile {
    constructor(_x,_y,_tileW, _index){
        super(_x,_y,_tileW, _index);
        this.type = "forwardSlash";
        this.topX2 = _x + this.tileW;
        this.topY2 = _y;
        this.topX3 = _x;
        this.topY3 = _y + this.tileW;
        this.bottomY1 = _y + this.tileW;
        this.bottomX2 = _x + this.tileW;
        this.bottomY2 = _y + this.tileW;
        this.bottomX3 = _x + this.tileW;
        this.bottomY3 = _y;
        this.upper = new triangleShape(this.topX1, this.topY1, this.topX2, this.topY2, this.topX3, this.topY3);
        this.lower = new triangleShape(this.bottomX1, this.bottomY1, this.bottomX2, this.bottomY2, this.bottomX3, this.bottomY3);
        this.lineX1 = _x;
        this.lineY1 = _y + this.tileW;
        this.lineX2 = _x + this.tileW;
        this.lineY2 = _y; 
    }
    getType(){
        return this.type;
    }
    getLineX1(){
        return this.lineX1;
    }
    getLineY1(){
        return this.lineY1;
    }
    getLineX2(){
        return this.lineX2;
    }
    getLineY2(){
        return this.lineY2;
    }
    whereIsNext(ptr){
        if (ptr == this.ptr_right) {
            return this.ptr_down;
        }
        else if (ptr == this.ptr_down){
            return this.ptr_right;
        }
        else if (ptr == this.ptr_left){
            return this.ptr_up;
        }
        else if (ptr == this.ptr_up){
            return this.ptr_left;
        }
    }
    findCorrectTriangle(_ptr){
        if (_ptr == this.ptr_right || _ptr == this.ptr_down) {
            return this.getLower();
        }
        else if (_ptr == this.ptr_up || _ptr == this.ptr_left){
            return this.getUpper();
        }
    }

    getUpper(){
        return this.upper;
    }
    getLower(){
        return this.lower;
    }
    ////DU JOBBER HER!!!////
}

class backSlash extends tile {
    constructor(_x,_y,_tileW, _index){
        super(_x,_y,_tileW, _index);
        this.type = "backSlash";
        this.topX2 = _x + this.tileW;
        this.topY2 = _y;
        this.topX3 = _x + this.tileW;
        this.topY3 = _y + this.tileW;
        this.bottomX2 = _x;
        this.bottomY2 = _y + this.tileW;
        this.bottomX3 = _x + this.tileW;
        this.bottomY3 = _y + this.tileW;
        this.upper = new triangleShape(this.topX1, this.topY1, this.topX2, this.topY2, this.topX3, this.topY3);
        this.lower = new triangleShape(this.bottomX1, this.bottomY1, this.bottomX2, this.bottomY2, this.bottomX3, this.bottomY3);
        this.lineX1 = _x;
        this.lineY1 = _y;
        this.lineX2 = _x + this.tileW;
        this.lineY2 = _y + this.tileW; 
    }
    getUpper(){
        return this.upper;
    }
    getLower(){
        return this.lower;
    }
    getType(){
        return this.type;
    }
    getLineX1(){
        return this.lineX1;
    }
    getLineY1(){
        return this.lineY1;
    }
    getLineX2(){
        return this.lineX2;
    }
    getLineY2(){
        return this.lineY2;
    }
    whereIsNext(ptr){
        if (ptr == this.ptr_right) {
            return this.ptr_up;
        }
        else if (ptr == this.ptr_up){
            return this.ptr_right;
        }
        else if (ptr == this.ptr_left){
            return this.ptr_down;
        }
        else if (ptr == this.ptr_down){
            return this.ptr_left;
        }
    }
    findCorrectTriangle(_ptr){
        if (_ptr == this.ptr_right || _ptr == this.ptr_up) {
            return this.getUpper();
        }
        else if (_ptr == this.ptr_down || _ptr == this.ptr_left) {
            return this.getLower();
        }
    }
}
class triangleShape {
    constructor(_x1,_y1,_x2,_y2,_x3,_y3) {
        this.x1 = _x1;
        this.y1 = _y1;
        this.x2 = _x2;
        this.y2 = _y2;
        this.x3 = _x3;
        this.y3 = _y3;
        this.triangleColor = null;   
    }

    getColor(){
        return this.triangleColor;
    }

    setColor(_color){
        this.triangleColor = _color;
    }

    getRandomColorFromPalette(){
        let pick = floor(random(0, palette1.length));
        var col = palette13[pick];
        this.setColor(col);
    }

    render(){
        if(this.triangleColor == null){
            this.getRandomColorFromPalette();
        }
        fill(this.triangleColor);
        noStroke();
        triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
    }

}