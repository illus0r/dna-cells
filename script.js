function World(height, width) {
  this.cellSize = 10;
  this.i = 0;
  this.height = height;
  this.width = width;
  this.parse = function(string){
    //return([0,0, 1,5,4, 2,5,4, 3]);
    //return([0, 1,4,7, 1,7,1, 3]); // oscilator
    return([ 86 ,63 ,30 ,58 ,78 ,84 ,51 ,9 ,49 ,26 ,30 ,93 ,61 ,50 ,15 ,1 ,41 ,36 ,35 ,56 ,17 ,39 ,11 ,67 ,77 ,94 ,66 ,21 ,32 ,43 ,9 ,71 ,30 ,13 ,22 ,47 ,75 ,44 ,35 ,62 ,98 ,83 ,5 ,53 ,29 ,27 ,3 ,70 ,57 ,12 ,10 ,40 ,68 ,81 ,74 ,88 ,90 ,92 ]);
    //return([ 34 ,46 ,7 ,42 ,95 ,52 ,28 ,12 ,38 ,37 ,73 ,24 ,4 ,85 ,59 ,93 ,6 ,87 ,96 ,82 ,48 ,72 ,76 ,91 ,100 ,69 ,54 ,2 ,33 ,19 ,64 ,97 ,23 ,86 ,63 ,20 ,58 ,78 ,84 ,51 ,8 ,49 ,26 ,30 ,89 ,61 ,50 ,15 ,1 ,41 ,36 ,25 ,56 ,17 ,39 ,11 ,67 ,77 ,94 ,66 ,21 ,32 ,43 ,9 ,71 ,60 ,13 ,22 ,47 ,75 ,44 ,35 ,62 ,98 ,83 ,5 ,53 ,29 ,27 ,3 ,70 ,57 ,18 ,10 ,40 ,68 ,81 ,74 ,88 ,90 ,92 ]); funny runner
    //return([1,0,0,3,0,0]);
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
  }, 20);
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
      //.attr("fill", function(d){return d.color});
    cellData
      .select("rect")
      .attr({
        x: function(d){return d.x*th.cellSize},
        y: function(d){return d.y*th.cellSize},
        width:  this.cellSize-0.5,
        height: this.cellSize-0.5,
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
          th.cells = th.cells.filter(function(cell){
            if(cell.x == cellNew.x && cell.y == cellNew.y){
              //console.log("YOOOO!");
              return false;
            }
            return true;
          });
        });
      });
      this.cells = this.cells.filter(cell => cell.isDead === false);
      this.cells = this.cells.concat(cellsNew);
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
    switch (this.dna[this.cursor] % 6){
      case 0:
        // idle
        //console.log("idle");
        break;
      case 1:
        // divide up
        console.log("↑");
        dx =  0;
        dy = -1;
        isDivided = true;
        break;
      case 2:
        // divide right
        console.log("→");
        dx =  1;
        dy =  0;
        isDivided = true;
        break;
      case 3:
        // divide down
        console.log("↓");
        dx =  0;
        dy =  1;
        isDivided = true;
        break;
      case 4:
        // divide left
        console.log("←");
        dx = -1;
        dy =  0;
        isDivided = true;
        break;
      case 5:
        // die
        this.isDead = true;
        break;
    }
    if(isDivided){
      cellsNew = [new Cell(this.dna, this.dna[this.cursor] % this.dna.length, this.x+dx, this.y+dy)];
      //this.cursor = this.cursor + 1;
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

