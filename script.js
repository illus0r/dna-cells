function World(height, width) {
  this.cellSize = 8;
  this.i = 0;
  this.height = height;
  this.width = width;
  this.parse = function(string){
    //return([0,0, 1,5,4, 2,5,4, 3]);
    //return([0, 1,4,7, 1,7,1, 3]); // oscilator
    //return([ 30 ,93 ,61 ,50 ,15 ,5 ,43 ,9 ,71 ,30 ,13 ,22 ,47 ,75 ,44 ,35 ,62 ,98 ,83 ,5 ,53 ,29 ,27 ,3 ,70 ,57 ,58 ,10 ,40 ,68 ,81 ,74 ,102 ,90 ,92 ]); // spaceship
    //return([ 30 ,100 ,61 ,50 ,15 ,5 ,43 ,9 ,75 ,30 ,13 ,22 ,47 ,75 ,44 ,35 ,62 ,98 ,83 ,7 ,53 ,29 ,27 ,3 ,70 ,57 ,58 ,10 ,40 ,68 ,81 ,74 ,102 ,90 ,92 ]); // spaceship 2
    //return([ 30 ,100 ,61 ,50 ,15 ,5 ,43 ,9 ,75 ,30 ,13 ,22 ,51 ,75 ,44 ,35 ,66 ,98 ,83 ,7 ,53 ,29 ,27 ,3 ,70 ,57 ,58 ,10 ,40 ,68 ,81 ,74 ,102 ,90 ,92 ]); // spaceship turbo
    return([ 30 ,100 ,61 ,50 ,15 ,5 ,43 ,9 ,75 ,30 ,13 ,22 ,51 ,75 ,44 ,35 ,66 ,98 ,83 ,7 ,53 ,29 ,27 ,3 ,70 ,7 ,58 ,10 ,40 ,68 ,81 ,77 ,102 ,90 ,92 ]); // stepladder turbo
    //return([ 32 ,32 ,43 ,9 ,71 ,60 ,13 ,22 ,47 ,75 ,44 ,35 ,62 ,98 ,83 ,5 ,53 ,29 ,27 ,3 ,70 ,57 ,18 ,10 ,40 ,68 ,81 ,74 ,88 ,90 ,92 ]); // two racing cars
    //return([30,12,0,26]);
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
    switch (this.dna[this.cursor] % 7){
      case 0:
        // idle
        console.log("idle");
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
        // goto
        this.cursor = this.dna[this.cursor] - 1; // to compensate later increase
        this.normalizeCursor();
        console.log("goto", this.cursor+1);
        break;
      case 6:
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

