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

    const TILE_WIDTH=24, TILE_HEIGHT=24;
        var numGhosts = 4;
	var ghostcolor = {};
	ghostcolor[0] = "rgba(255, 0, 0, 255)";
	ghostcolor[1] = "rgba(255, 128, 255, 255)";
	ghostcolor[2] = "rgba(128, 255, 255, 255)";
	ghostcolor[3] = "rgba(255, 128, 0,   255)";
	ghostcolor[4] = "rgba(50, 50, 255,   255)"; // blue, vulnerable ghost
	ghostcolor[5] = "rgba(255, 255, 255, 255)"; // white, flashing ghost


	// hold ghost objects
	var ghosts = {};

    var Ghost = function(id, ctx){

		this.x = 0;
		this.y = 0;
		this.velX = 0;
		this.velY = 0;
		this.speed = 1;
		
		this.nearestRow = 0;
		this.nearestCol = 0;
	
		this.ctx = ctx;
	
		this.id = id;
		this.homeX = 0;
		this.homeY = 0;

	this.draw = function(){
		// Pintar cuerpo de fantasma

		// Tu código aquí
		this.ctx.beginPath();
		this.ctx.moveTo(this.x,this.y+thisGame.TILE_HEIGHT);
		this.ctx.quadraticCurveTo(this.x+thisGame.TILE_WIDTH/3, this.y-thisGame.TILE_HEIGHT/2, this.x+thisGame.TILE_WIDTH, this.y+thisGame.TILE_HEIGHT);
		this.ctx.closePath();
		this.ctx.fillStyle = ghostcolor[this.id];
		this.ctx.fill();
		// Pintar ojos 

		// Tu código aquí
		this.ctx.beginPath();
		this.ctx.fillStyle = "white";
		this.ctx.arc(this.x+thisGame.TILE_WIDTH/4,this.y+thisGame.TILE_HEIGHT/4,thisGame.TILE_WIDTH/6,0,2*Math.PI,false);
		this.ctx.fill();
		this.ctx.beginPath();
		this.ctx.arc(this.x+thisGame.TILE_WIDTH/2,this.y+thisGame.TILE_HEIGHT/4,thisGame.TILE_WIDTH/6,0,2*Math.PI,false);
		this.ctx.fill();
		this.ctx.fillStyle = "black";
		this.ctx.beginPath();
		this.ctx.arc(this.x+thisGame.TILE_WIDTH/4,this.y+thisGame.TILE_HEIGHT/4,thisGame.TILE_WIDTH/12,0,2*Math.PI,false);
		this.ctx.fill();
		this.ctx.beginPath();
		this.ctx.arc(this.x+thisGame.TILE_WIDTH/2,this.y+thisGame.TILE_HEIGHT/4,thisGame.TILE_WIDTH/12,0,2*Math.PI,false);
		this.ctx.fill();

	}; // draw

	    	this.move = function() {
				// Tu código aquí
				if(this.x%thisGame.TILE_WIDTH==0 &&this.y%thisGame.TILE_HEIGHT==0){
					var col = Math.floor(this.x/thisGame.TILE_WIDTH);
					var row = Math.floor(this.y/thisGame.TILE_HEIGHT);
					var soluciones = [];
					var posiblesMovimientos = [[0,-1],[1,0],[0,1],[-1,0]];

					for (var i = 0; i<posiblesMovimientos.length;i++) {
						var rowNew = row+posiblesMovimientos[i][0];
						var colNew = col+posiblesMovimientos[i][1];
						if(!(posiblesMovimientos[i][0]==-this.velY/this.speed && posiblesMovimientos[i][1]==-this.velX/this.speed)){
							if(!thisLevel.isWall(rowNew,colNew) && thisLevel.getMapTile(rowNew,colNew)!=20 && thisLevel.getMapTile(rowNew,colNew)!=21){
								soluciones.push(posiblesMovimientos[i]);
							}
						}

					}
					if(soluciones.length==0){
						this.velX *= -1;
						this.velY *= -1;
					} else if(soluciones.length>=1){
						var newSentido = soluciones[Math.floor(Math.random()*soluciones.length)];
						this.velX = newSentido[1];
						this.velY = newSentido[0];
					}

				}
				this.x += this.velX;
				this.y += this.velY;

		};

	};

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
				//pacman
				if(numero==4){
					var xPos = thisGame.TILE_WIDTH*c;
					var yPos = thisGame.TILE_HEIGHT*r;
					player.homeX = xPos;
					player.homeY = yPos;
				}
				if(numero>=10&&numero<=13){
					console.log("Ghost "+numero);
					var ghId = numero-10;
					var gh = ghosts[ghId];
					var xPos = thisGame.TILE_WIDTH*c;
					var yPos = thisGame.TILE_HEIGHT*r;
					gh.homeX = xPos;
					gh.homeY = yPos;
				}
				//pellet
				else if(numero==2){
					this.pellets++;
				}
				//power pellet 
				else if(numero==3){
					this.pellets++;
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
		 this.powerPelletBlinkTimer++;
			if(this.powerPelletBlinkTimer==60){
				this.powerPelletBlinkTimer=0;
			};
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
						if(this.powerPelletBlinkTimer%60<30){
							ctx.beginPath();
							ctx.fillStyle = "red";
							ctx.arc(xPos+TILE_WIDTH/2, yPos+TILE_HEIGHT/2, 5, 0, 2*Math.PI, true);
							ctx.closePath();
							ctx.fill();
						}
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

		this.checkIfHitSomething = function(playerX, playerY, row, col){
			var tileID = {
	    			'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3,
				'pellet': 2
			};
			var colPac = Math.floor(playerX/thisGame.TILE_WIDTH);
			var rowPac = Math.floor(playerY/thisGame.TILE_HEIGHT);
			if(colPac==col&&rowPac==row){
				if(thisLevel.getMapTile(row,col)==tileID['pellet']){
					thisLevel.setMapTile(row,col,0);
					thisLevel.pellets--;
					if(thisLevel.pellets==0){
						console.log("CHAN TATA CHAN, ganaste !!!!");
					}
				} else if(thisLevel.getMapTile(row,col)==tileID['pellet-power']){
					thisLevel.setMapTile(row,col,0);
					thisLevel.pellets--;
					if(thisLevel.pellets==0){
						console.log("CHAN TATA CHAN, ganaste !!!!");
					}
				}
			}
			// Tu código aquí (test9)
			//  Gestiona las puertas teletransportadoras

			if(thisLevel.getMapTile(row,col)==tileID['door-v']){
				if(row>this.lvlHeight/2){
					player.y = thisGame.TILE_HEIGHT;
					player.velX = 0;
					player.velY = player.speed;
				} else {
					player.y = (this.lvlHeight-1)*thisGame.TILE_HEIGHT;
					player.velX = 0;
					player.velY = -player.speed;
				}
			} else if(thisLevel.getMapTile(row,col)==tileID['door-h']){
				if(col>this.lvlWidth/2){ 
					player.x = thisGame.TILE_WIDTH;
					player.velX = player.speed;
					player.velY = 0;
				} else {
					player.x = (this.lvlWidth-1)*thisGame.TILE_WIDTH;
					player.velX = -player.speed;
					player.velY = 0;
				}
			}
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

		// Tu código aquí
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

	  	this.nearestRow = row;
	  	this.nearestCol = col;
		//
		// tras actualizar this.x  y  this.y... 
		 // check for collisions with other tiles (pellets, etc)
		    thisLevel.checkIfHitSomething(this.x, this.y, this.nearestRow, this.nearestCol);
		// ....

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
	for (var i=0; i< numGhosts; i++){
		ghosts[i] = new Ghost(i, canvas.getContext("2d"));
	}


	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
		screenTileSize: [24, 21],
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24
	};

	var thisLevel = new Level(canvas.getContext("2d"));
	thisLevel.loadLevel( thisGame.getLevelNum() );



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

	// Tu código aquí
	    // Mover fantasmas
	    for (var i = 0; i < numGhosts; i++) {
			var gh = ghosts[i];
			gh.move();
		};

	player.move();
        // Clear the canvas
        clearCanvas();
   
	thisLevel.drawMap();

	// Tu código aquí
	    // Pintar fantasmas
	    for (var i = 0; i < numGhosts; i++) {
			var gh = ghosts[i];
			gh.draw();
		};


 
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
	// Tu código aquí (test10)		
	// Inicializa los atributos x,y, velX, velY, speed de la clase Ghost de forma conveniente
    	for (var i = 0; i < numGhosts; i++) {
			var gh = ghosts[i];
			gh.x = gh.homeX;
			gh.y = gh.homeY;
			var vels = [[-gh.speed,0],[gh.speed,0],[0,gh.speed],[0,-gh.speed]];
			var velId = Math.floor(Math.random()*4);
			gh.velX = vels[velId][0];
			gh.velY = vels[velId][1];
		};
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
        start: start,
	ghost: Ghost // exportando Ghost para poder probarla
    };
};



  var game = new GF();
  game.start();


test('Clase Ghost bien implementada', function(assert) {

  	var done = assert.async();
  	setTimeout(function() {
		var ghost = new game.ghost(4, canvas.getContext("2d"));
		assert.ok( typeof(ghost)!= "undefined" , "El fantasma existe" );

		ghost.x = 250;
		ghost.y = 240;
		ghost.velX = 3;
		ghost.velY = 0;
		ghost.draw(); // no se va a ver, porque no está en el mainloop, pero queremos verificar que no da errores
		ghost.move();
		assert.ok( ghost.x > 250 , "El fantasma se mueve hacia la derecha cuando es posible" );

    		ghost.x = 240;
		ghost.y = 242;
		ghost.velX = 0;
		ghost.velY = 3;
		ghost.draw(); // no se va a ver, porque no está en el mainloop....
		ghost.move();
		assert.ok( ghost.y > 240 , "El fantasma se mueve hacia abajo cuando es posible" );
    	
		ghost.x = 240;
		ghost.y = 240;
		ghost.draw(); // no se va a ver, porque no está en el mainloop....
		ghost.move(); // lo movemos dos veces
		ghost.move();
		ghost.velX = 3;
		ghost.velY = 3;
		assert.ok( (ghost.x != 240 && ghost.y == 240) || (ghost.x == 240 && ghost.y != 240) , "El fantasma elige una direccio'n al azar cuando encuentra una bifurcacio'n " );
    	
		done();
  }, 1000);

});


