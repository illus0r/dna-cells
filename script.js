function World(height, width) {
  this.cellSize = 8;
  this.i = 0;
  this.height = height;
  this.width = width;
  this.parse = function(string){
    //return([320,516,220,320,416,420,120,416,420,620,416,421,621,816,920,020,219]); // cascade
    //return([320,416,420,120,406,420,620,416,421,621,816,920,020,219]); // cascade
    //return([120,906,420,620,416,421,920,020,219]); // cascade
    //return([ 	239,	234,	650, 100,	757,	36,	676,	266, 72,	453,	764,	72,	141, 738,	756,	484,	35,	947, 157,	538,	223,	507,	757, 995,	175,	82,	263,	270, 533,	372,	19,	912,	708, 836,	355,	432,	176,	349, 621,	242,	301,	825,	533, 871,	129,	605,	270,	491, 691,	73,	308,	951,	927, 599,	245,	647,	937,	65, 413,	672,	2,	995,	966, 741,	691,	971,	558,	596, 622,	723,	526,	532,	590, 652,	597,	306,	371,	191, 278,	641,	385,	407,	947, 121,	234,	186,	14,	577, 950,	585,	995,	127,	600, 616,	459,	558,	549,	274, 670,	565,	106,	870,	830, 241,	634,	133,	516,	790 ]); // cascade
    return([	597,	306,	371,	191, 278,	641,	385,	407,	947, 121,	234,	186,	14,	577, 950,	585,	995,	428,	600, 616,	459,	558,	549,	274, 670,	565,	106,	870,	830, 241,	634,	133,	516,	790 ]); // fireflys
  };
  var dna = this.parse(".....x");
  this.animal = new Animal(dna,50,50);
  this.develop = function(){
    this.animal.develop();
  } 
  var th = this;
  setInterval(function() { 
    th.render();
    th.develop(); 
  }, 50);
  this.svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
  this.render = function(){
    var cellData = this.svg
      .selectAll("g.cell")
      .data(this.animal.cells);
    cellData
      .enter()
      .append("g")
      .attr("class", "cell")
      .append("rect");
    cellData
      .select("rect")
      .attr({
        x: function(d){return d.x*th.cellSize},
        y: function(d){return d.y*th.cellSize},
        width:  this.cellSize-0.3,
        height: this.cellSize-0.3,
      })
      .attr("fill", function(d){return d.color});
    cellData
      .exit()
      .remove();
  }
};

function Animal(dna,x,y){
  this.cells = [new Cell(dna,0,x,y)];
  this.develop = function(){
    if(this.cells.length < 200){
      var cellsNew = [];
      var th = this;
      this.cells.map(function(cell) {
        cellsNew = cell.develop();
        cellsNew.map(function(cellNew) {
          var dx = cellNew.x - cell.x;
          var dy = cellNew.y - cell.y;
          var cellsToMove = th.cells.map(function(c){
            if(dy == -1){
              if(c.x == cell.x && c.y < cell.y){
                console.log("up");
                c.y = c.y - 1;
              }
            }
            else if(dx ==  1){
              if(c.x > cell.x && c.y == cell.y){
                console.log("right");
                c.x = c.x + 1;
              }
            }
            else if(dy ==  1){
              if(c.x == cell.x && c.y > cell.y){
                console.log("down");
                c.y = c.y + 1;
              }
            }
            else if(dx == -1){
              if(c.x < cell.x && c.y == cell.y){
                console.log("left");
                c.x = c.x - 1;
              }
            }
          });
        });
        th.cells = th.cells.concat(cellsNew);
      });
      this.cells = this.cells.filter(cell => cell.isDead === false);
    }
  }
};

function Cell(dna,cursor,x,y){
  this.normalizeCursor = function(){
    this.cursor = this.cursor % this.dna.length;
  }
  this.dna = dna;
  this.cursor = cursor;
  this.normalizeCursor();
  this.x = x;
  this.y = y;
  this.isDead = false;
  this.colorUpdate = function(){
    this.color = "hsl("+parseInt(100 * this.cursor / this.dna.length)+", 100%, 50%)";
  };
  this.colorUpdate();
  this.develop = function(){
    this.normalizeCursor();
    var cellsNew = [];
    var dx, dy;
    var isDivided = false;
    //console.log("before",this);
    //this.x=this.x+1;
    var dnaCurrent = this.dna[this.cursor];
    if(dnaCurrent<100){
        // divide up
        console.log("↑");
        dx =  0;
        dy = -1;
        isDivided = true;
    } else
    if(dnaCurrent<200){
        // divide right
        console.log("→");
        dx =  1;
        dy =  0;
        isDivided = true;
    } else
    if(dnaCurrent<300){
        // divide down
        console.log("↓");
        dx =  0;
        dy =  1;
        isDivided = true;
    } else
    if(dnaCurrent<400){
        // divide left
        console.log("←");
        dx = -1;
        dy =  0;
        isDivided = true;
    } else
    if(dnaCurrent<500){
        // goto
        this.cursor = this.dna[this.cursor] - 1; // to compensate later increase
        this.normalizeCursor();
        console.log("goto", this.cursor+1);
    } else
    if(dnaCurrent<600){
      //idle
    } else
    {
      // die
      this.isDead = true;
    }
    if(isDivided){
      cellsNew = [new Cell(this.dna, this.dna[this.cursor] % 100, this.x+dx, this.y+dy)];
      //this.cursor = this.cursor + 1
      //this.normalizeCursor();
      //this.isDead = true;
    }
    this.cursor = this.cursor + 1;
    this.normalizeCursor();
    this.colorUpdate();
    //console.log("after",this);
    return cellsNew;
  };
};

function dnaBit(string){
  this.stringParts = str.split(":");
  this.command = stringParts[0];
}

var world = new World(1000, 1000);
//var t = d3.timer(function(elapsed) {
//  console.log(elapsed);
//}, 2000, 2000);

