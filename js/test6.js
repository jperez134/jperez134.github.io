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

    this.drawMap = function(){
    	var TILE_WIDTH = thisGame.TILE_WIDTH;
    	var TILE_HEIGHT = thisGame.TILE_HEIGHT;

		var tileID = {
    		'door-h' : 20,
			'door-v' : 21,
			'pellet-power' : 3
		};
	 	// Tu código aquí
		for (var r = 0; r < this.lvlHeight; r++) {
			for (var c = 0; c < this.lvlWidth; c++) {
				var valor = this.getMapTile(r,c);
				var xPos = TILE_WIDTH*c;
				var yPos = TILE_HEIGHT*r;

				//pared azul
				if(valor>=100&&valor<=199){
					ctx.fillStyle = "blue";
					ctx.fillRect(xPos,yPos,TILE_WIDTH,TILE_HEIGHT);
				}
				//pildora de poder
				else if (valor==3) {
					ctx.beginPath();
					ctx.fillStyle = "red";
					ctx.arc(xPos+TILE_WIDTH/2, yPos+TILE_HEIGHT/2, 5, 0, 2*Math.PI, true);
					ctx.closePath();
					ctx.fill();
				}
				//pildora normal
				else if (valor==2) {
					ctx.beginPath();
					ctx.fillStyle = "white";
					ctx.arc(xPos+TILE_WIDTH/2, yPos+TILE_HEIGHT/2, 3, 0, 2*Math.PI, true);
					ctx.closePath();
					ctx.fill();
				}
				//puertas horizontales
				else if (valor==20) {

				}
				//puertas verticales
				else if (valor==21) {
					
				}
				//fantasma 1
				else if (valor==10) {
					ctx.fillStyle = "black";
					ctx.fillRect(xPos,yPos,TILE_WIDTH,TILE_HEIGHT);
				}
				//fantasma 2
				else if (valor==11) {
					ctx.fillStyle = "black";
					ctx.fillRect(xPos,yPos,TILE_WIDTH,TILE_HEIGHT);
				}
				//fantasma 3
				else if (valor==12) {
					ctx.fillStyle = "black";
					ctx.fillRect(xPos,yPos,TILE_WIDTH,TILE_HEIGHT);
				}
				//fantasma 4
				else if (valor==13) {
					ctx.fillStyle = "black";
					ctx.fillRect(xPos,yPos,TILE_WIDTH,TILE_HEIGHT);
				}
				//pacman
				else if (valor==4) {

				} 
				//valor incorrecto
				else {
				
				}
			};
		};
	};

	}; // end Level 

	var Pacman = function() {
		this.radius = 10;
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
		screenTileSize: [24, 21],
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24
	};

	// thisLevel global para poder realizar las pruebas unitarias
	thisLevel = new Level(canvas.getContext("2d"));
	thisLevel.loadLevel( thisGame.getLevelNum() );
	// thisLevel.printMap(); 



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
   
	thisLevel.drawMap();

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

test('Mapa correctamente dibujado en pantalla', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {


	     	   assert.pixelEqual( canvas,  35,35, 0, 0, 255, 255,"esquina superior izquierda azul"); 
	     	   assert.pixelEqual( canvas, 250,35, 0, 0, 0, 0,"puerta superior negra");
	     	   assert.pixelEqual( canvas, 465,35, 0, 0, 255, 255,"esquina superior derecha azul");
	     	   assert.pixelEqual( canvas, 58,58, 255, 255, 255,255,"primera pi'ldora esquina superior izquierda blanca");
	     	   assert.pixelEqual( canvas, 58,82, 255, 0,0,255,"pi'ldora de poder esquina superior izquierda roja");
	     	   assert.pixelEqual( canvas, 442,82, 255, 0,0,255,"pi'ldora de poder esquina superior derecha roja");

	     	   assert.pixelEqual( canvas, 35,300, 0, 0,0,0 ,"puerta lateral izquierda negra");
	     	   assert.pixelEqual( canvas, 252,300, 0, 0,0, 255,"centro de casa de los fantasmas negro");
	     	   assert.pixelEqual( canvas, 482, 300, 0, 0,0, 0,"puerta lateral derecha negra");
		
		   assert.pixelEqual( canvas, 12, 585, 0, 0,255,255,"esquina inferior izquierda azul"); 
	     	   assert.pixelEqual( canvas, 60, 538, 0, 0,255,255,"cuadrado interior esquina inferior izquierda azul");
	     	   assert.pixelEqual( canvas, 250,538, 255, 255,255,255,"pi'ldora central lateral inferior blanca");
	     	   assert.pixelEqual( canvas, 442,538, 0, 0,255,255,"cuadrado interior esquina inferior derecha azul");
		   assert.pixelEqual( canvas, 488,582, 0, 0,255,255,"esquina inferior derecha azul"); 

    		   done();
  }, 1000);

});

