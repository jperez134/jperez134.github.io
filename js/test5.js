// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;


// GAME FRAMEWORK 
var GF = function(){

 // variables para contar frames/s, usadas por measureFPS
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps; 
 
    //  variable global temporalmente para poder testear el ejercicio
    inputStates = {};


	var Level = function(ctx) {
		this.ctx = ctx;
		this.lvlWidth = 0;
		this.lvlHeight = 0;
		
		this.map = [];
		
		this.pellets = 0;
		this.powerPelletBlinkTimer = 0;

	this.setMapTile = function(row, col, newValue){
		// tu código aquí
		var pos = col+row*this.lvlWidth;
		this.map[pos]=newValue;
	};

	this.getMapTile = function(row, col){
		// tu código aquí
		var pos = col+row*this.lvlWidth;
		return this.map[pos];
	};

	this.printMap = function(){
		// tu código aquí
		console.log(this.map);
	};

	this.loadLevel = function(){
		// leer res/levels/1.txt y guardarlo en el atributo map	
		// haciendo uso de setMapTile
		var path_fich = "res/levels/1.txt";
		
  		var data = $.ajax({type: "GET", url: path_fich, async: false}).responseText;
  		
  		var lineas = data.split("\n");
		var s;
		var tokens;
		var comand;
		var sigueMatriz = false;
		var matriz = [];
		for(i=0; i<lineas.length;i++){
			s = lineas[i];
			if(s.startsWith("#")){
				tokens = s.split(" ");
				comand = tokens[1];
				if(comand=="lvlwidth"){
					this.lvlWidth = parseInt(tokens[2]);
				} else if(comand=="lvlheight"){
					this.lvlHeight = parseInt(tokens[2]);
				} else if(comand=="startleveldata"){
					sigueMatriz = true;
				} else if(comand=="endleveldata"){
					sigueMatriz = false;
				} 
			} else {
				if(sigueMatriz){
					matriz.push(s);
				}
			}
		}
		for(r=0;r<this.lvlHeight;r++){
			tokens = matriz[r].split(" ");
			for(c=0;c<this.lvlWidth;c++){
				this.setMapTile(r,c,parseInt(tokens[c]));
			}
		}

	};


	}; // end Level 

	var Pacman = function() {
		this.radius = 15;
		this.x = 0;
		this.y = 0;
		this.speed = 5;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
	};
	Pacman.prototype.move = function() {
		// tu código aquí
		var newX = this.x + this.velX;
	    var newY = this.y + this.velY;
	    if(newX>=0&&newX<=w-2*this.radius){
	      this.x = newX;
	    }
	    if(newY>=0&&newY<=h-2*this.radius){
	      this.y = newY;
	  	}
	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
         
         // Pac Man
	    
	// tu código aquí	  
		  ctx.beginPath();
		  var r = this.radius;
		  var x = this.x;
		  var y = this.y;
		  ctx.arc(x+r,y+r,r,this.angle1*Math.PI,this.angle2*Math.PI,false);
		  ctx.lineTo(x+r,y+r);
		  ctx.closePath();
		  ctx.fillStyle = "yellow";
		  ctx.fill();   
    };

	var player = new Pacman();

	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24
	};

	// thisLevel global para poder realizar las pruebas unitarias
	thisLevel = new Level(canvas.getContext("2d"));
	thisLevel.loadLevel( thisGame.getLevelNum() );
	thisLevel.printMap(); 



	var measureFPS = function(newTime){
		// la primera ejecución tiene una condición especial

		if(lastTime === undefined) {
			lastTime = newTime; 
			return;
		}

		// calcular el delta entre el frame actual y el anterior
		var diffTime = newTime - lastTime; 

		if (diffTime >= 1000) {

			fps = frameCount;    
			frameCount = 0;
			lastTime = newTime;
		}

		// mostrar los FPS en una capa del documento
		// que hemos construído en la función start()
		fpsContainer.innerHTML = 'FPS: ' + fps; 
		frameCount++;
	};

	// clears the canvas content
	var clearCanvas = function() {
		ctx.clearRect(0, 0, w, h);
	};

	var checkInputs = function(){
		// tu código aquí
		if(inputStates.left){
		    player.velX = -player.speed;
		    player.velY = 0;
		  }
		  if(inputStates.up){
		    player.velX = 0;
		    player.velY = -player.speed;
		  }
		  if(inputStates.down){
		    player.velX = 0;
		    player.velY = player.speed;
		  }
		  if(inputStates.right){
		    player.velX = player.speed;
		    player.velY = 0;
		  }
		  if(inputStates.space){
		    console.log("space");
		  }
	};


 
    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
     
	checkInputs();
 
        // Clear the canvas
        clearCanvas();
    
	player.move();
 
	player.draw();
        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

   var addListeners = function(){
		//add the listener to the main, window object, and update the states
		// Tu código aquí
		window.addEventListener("keydown",function(e){
		    console.log(e.keyCode);
		    inputStates.left = false;
		    if (e.keyCode === 37){inputStates.left = true;}

		    inputStates.right = false;
		    if (e.keyCode === 39){inputStates.right = true;}

		    inputStates.up = false;
		    if (e.keyCode === 38){inputStates.up = true;}

		    inputStates.down = false;
		    if (e.keyCode === 40){inputStates.down = true;}

		    inputStates.space = false;
		    if (e.keyCode === 32){inputStates.space = true;}
		  });
   };


    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
       
	addListeners();

	player.x = 0;
	player.y = 0; 
	player.velY = 0;
	player.velX = player.speed;
 
        // start the animation
        requestAnimationFrame(mainLoop);
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};



  var game = new GF();
  game.start();


test('Mapa correctamente cargado', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
			// console.log(player.x);
 		   assert.ok( thisLevel.getMapTile(0,9) == 113, "Line 0, Column 9: wall");
 		   assert.ok( thisLevel.getMapTile(24,20) == 106, "Line 24, Column 21: wall");
 		   assert.ok( thisLevel.getMapTile(23,1) == 2, "Line 23, Column 1 : pellet");
 		   assert.ok( thisLevel.getMapTile(22,1) == 3, "Line 22, Column 1: power pellet");

    		   done();
  }, 1000);

});

