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
				var numero = parseInt(tokens[c]);
				this.setMapTile(r,c,numero);
				if(numero==4){
					var xPos = thisGame.TILE_WIDTH*c;
					var yPos = thisGame.TILE_HEIGHT*r;
					player.homeX = xPos;
					player.homeY = yPos;
				}
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


		this.isWall = function(row, col) {
			// Tu código aquí
			var valor = this.getMapTile(row,col);
			//pared azul
			if(valor>=100&&valor<=199){
				return true;
			} else {
				return false;
			}

		};

		this.checkIfHitWall = function(possiblePlayerX, possiblePlayerY, row, col){
				// Tu código aquí
				// Determinar si el jugador va a moverse a una fila,columna que tiene pared 
				// Hacer uso de isWall
				var rectPlayer = {
							  x1: possiblePlayerX,
							  x2: possiblePlayerX + thisGame.TILE_WIDTH,
							  y1: possiblePlayerY,
							  y2: possiblePlayerY + thisGame.TILE_HEIGHT
							};
				for(var c=col-1;c<=col+1;c++){
					for(var r=row-1;r<=row+1;r++){
						if(this.isWall(r,c)){	
							var rectPared = {
							  x1: c*thisGame.TILE_WIDTH,
							  x2: c*thisGame.TILE_WIDTH+thisGame.TILE_WIDTH,
							  y1: r*thisGame.TILE_HEIGHT,
							  y2: r*thisGame.TILE_HEIGHT+thisGame.TILE_HEIGHT
							};
							//checkeo de colision entre dos rectangulos
							//http://math.stackexchange.com/questions/99565/simplest-way-to-calculate-the-intersect-area-of-two-rectangles
							var x_overlap = Math.max(0, Math.min(rectPlayer.x2, rectPared.x2) - Math.max(rectPlayer.x1, rectPared.x1));
							var y_overlap = Math.max(0, Math.min(rectPlayer.y2, rectPared.y2) - Math.max(rectPlayer.y1, rectPared.y1));
							var overlapArea = x_overlap * y_overlap;
							if(overlapArea>0){
								return true;
							}
						}
					}
				}
				return false;
		};

	}; // end Level 

	var Pacman = function() {
		this.radius = 10;
		this.x = 0;
		this.y = 0;
		this.speed = 3;
		this.angle1 = 0.25;
		this.angle2 = 1.75;
	};
	Pacman.prototype.move = function() {

		// tu código aquí
		var newX = this.x + this.velX;
	    var newY = this.y + this.velY;
	  	var row = Math.floor(newY/thisGame.TILE_HEIGHT);
	  	var col = Math.floor(newX/thisGame.TILE_WIDTH);

	  	if(newX<0||newX>w-2*this.radius){
		  	return;
	    }
	    if(newY<0||newY>h-2*this.radius){
	    	return;
	  	}
	  	if(thisLevel.checkIfHitWall(newX, newY, row, col)){
	  		return;
	  	}

	  	this.x = newX;
	  	this.y = newY;
	  	
	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
         
         // Pac Man
	    
			// tu código aquí	
		  ctx.beginPath();
		  var r = this.radius;
		  var x = this.x+thisGame.TILE_WIDTH/2;
		  var y = this.y+thisGame.TILE_HEIGHT/2;
		  ctx.arc(x,y,r,this.angle1*Math.PI,this.angle2*Math.PI,false);
		  ctx.lineTo(x,y);
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
		// LEE bien el enunciado, especialmente la nota de ATENCION que
		// se muestra tras el test 7
		var newX,newY,row,col;
		
		if(inputStates.left){
			newX = player.x-player.speed;
		    newY = player.y;
		  	row = Math.floor(newY/thisGame.TILE_HEIGHT);
		  	col = Math.floor(newX/thisGame.TILE_WIDTH);
			if(!thisLevel.checkIfHitWall(newX, newY, row, col)){
		  		player.velX = -player.speed;
		   		player.velY = 0;
		  	}
		  }
		  if(inputStates.up){
		  	newX = player.x;
		    newY = player.y-player.speed;
		  	row = Math.floor(newY/thisGame.TILE_HEIGHT);
		  	col = Math.floor(newX/thisGame.TILE_WIDTH);
			if(!thisLevel.checkIfHitWall(newX, newY, row, col)){
		  		player.velX = 0;
		    	player.velY = -player.speed;
		  	}
		  }
		  if(inputStates.down){
		    newX = player.x;
		    newY = player.y+player.speed;
		  	row = Math.floor(newY/thisGame.TILE_HEIGHT);
		  	col = Math.floor(newX/thisGame.TILE_WIDTH);
			if(!thisLevel.checkIfHitWall(newX, newY, row, col)){
		  		player.velX = 0;
		   		player.velY = player.speed;
		  	}
		  }
		  if(inputStates.right){
		    newX = player.x+player.speed;
		    newY = player.y;
		  	row = Math.floor(newY/thisGame.TILE_HEIGHT);
		  	col = Math.floor(newX/thisGame.TILE_WIDTH);
			if(!thisLevel.checkIfHitWall(newX, newY, row, col)){
		  		player.velX = +player.speed;
		   		player.velY = 0;
		  	}
		  }
		  if(inputStates.space){
		    console.log("space");
		  }
	};


 
    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);
     
	checkInputs();
 
	player.move();
        // Clear the canvas
        clearCanvas();
   
	thisLevel.drawMap();

 
	player.draw();
        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };

    var addListeners = function(){
	    //add the listener to the main, window object, and update the states
	    // Tu código aquí
	    window.addEventListener("keydown",function(e){
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

    var reset = function(){
	// Tu código aquí
	// Inicialmente Pacman debe empezar a moverse en horizontal hacia la derecha, con una velocidad igual a su atributo speed
	// inicializa la posición inicial de Pacman tal y como indica el enunciado
		player.x = player.homeX;
		player.y = player.homeY;
		player.velX = player.speed; 
		player.velY = 0; 
    };

    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);
       
	addListeners();

	reset();

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


test('checkIfHitWall bien implementado', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
		var x = 315, y = 384, speed = 5, nearestRow = 16, nearestCol = 13;
		assert.ok( thisLevel.checkIfHitWall( x, y - speed, nearestRow, nearestCol ) == true , "entrar demasiado pronto por la primera salida hacia arriba de la pos. original" );
		x = 312; 
		assert.ok( thisLevel.checkIfHitWall( x, y - speed, nearestRow, nearestCol ) == false , "entrar OK por la primera salida hacia arriba de la pos. original" );	
		x = 240, y = 144, nearestRow = 6, nearestCol = 10;
		assert.ok( thisLevel.checkIfHitWall( x - speed, y , nearestRow, nearestCol ) == false , "apertura horizontal superior izquierda, entrando correctamente hacia la izquierda, no hay pared");
		y = 147;			
		assert.ok( thisLevel.checkIfHitWall( x - speed, y , nearestRow, nearestCol ) == true , "apertura horizontal superior izquierda, entrando demasiado tarde hacia la izquierda, hay pared");	
    		   done();
  }, 1000);

});

