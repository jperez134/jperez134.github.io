// Variables globales de utilidad
var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;
var pathSprites = "res/img/sprites.png";

var soundEat;
var soundDie;

// GAME FRAMEWORK 
var GF = function(){

 // variables para contar frames/s, usadas por measureFPS
    var frameCount = 0;
    var lastTime;
    var fpsContainer;
    var fps;
    var oldTime = 0;
    var delta;

    var timer = function(currentTime) {
		var aux = currentTime - oldTime;
		oldTime = currentTime;
		return aux;
	}
       
 
    //  variable global temporalmente para poder testear el ejercicio
    inputStates = {};

    const TILE_WIDTH=24, TILE_HEIGHT=24;
        var numGhosts = 4;
        /*
	var ghostcolor = {};
	ghostcolor[0] = "rgba(255, 0, 0, 255)";
	ghostcolor[1] = "rgba(255, 128, 255, 255)";
	ghostcolor[2] = "rgba(128, 255, 255, 255)";
	ghostcolor[3] = "rgba(255, 128, 0,   255)";
	ghostcolor[4] = "rgba(50, 50, 255,   255)"; // blue, vulnerable ghost
	ghostcolor[5] = "rgba(255, 255, 255, 255)"; // white, flashing ghost
*/
	var ghostcolor = {};
	ghostcolor[0] = [472,16*4];
	ghostcolor[1] = [472,16*5];
	ghostcolor[2] = [472,16*6];
	ghostcolor[3] = [472,16*7];

	ghostcolor[4] = [472+16*7,16*4]; // vulnerable ghost
	ghostcolor[5] = [472+16*7,16*5]; // spectacles ghost

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
		this.sprite = new Sprite(pathSprites, ghostcolor[this.id].slice(0), [16,16], 0.005, [0,-1],[this.x,this.y],[TILE_WIDTH,TILE_HEIGHT]);

	this.draw = function(){
		// test13 Tu código aquí
		// El cuerpo del fantasma sólo debe dibujarse cuando el estado del mismo es distinto a Ghost.SPECTACLES
		// Pintar cuerpo de fantasma
		// Tu código aquí
		// test12 Tu código aquí
		// Asegúrate de pintar el fantasma de un color u otro dependiendo del estado del fantasma y de thisGame.ghostTimer
		// siguiendo el enunciado

		/*
		if (this.state != Ghost.SPECTACLES){
			this.ctx.beginPath();
			this.ctx.moveTo(this.x,this.y+thisGame.TILE_HEIGHT);
			this.ctx.quadraticCurveTo(this.x+thisGame.TILE_WIDTH/3, this.y-thisGame.TILE_HEIGHT/2, this.x+thisGame.TILE_WIDTH, this.y+thisGame.TILE_HEIGHT);
			this.ctx.closePath();
			if(this.state == Ghost.NORMAL){
				this.ctx.fillStyle = ghostcolor[this.id];
			} else if (this.state == Ghost.VULNERABLE) {
				if(thisGame.ghostTimer<100 && thisGame.ghostTimer%20<10){
					this.ctx.fillStyle = ghostcolor[5];
				} else {
					this.ctx.fillStyle = ghostcolor[4];
				}
			}
			this.ctx.fill();
		}
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

		this.sprite = new Sprite(pathSprites, ghostcolor[this.id], [16,16], 0.005, [0,-1],[this.x,this.y],[TILE_WIDTH,TILE_HEIGHT]);

		*/

		if(this.state != Ghost.SPECTACLES){
			if(this.state == Ghost.NORMAL){
				this.sprite.pos[1] = ghostcolor[this.id][1];
				if(this.velX>0){
					this.sprite.pos[0] = ghostcolor[this.id][0] + 0;
				} else if(this.velX<0){
					this.sprite.pos[0] = ghostcolor[this.id][0] + 32;
				} else if(this.velY>0){
					this.sprite.pos[0] = ghostcolor[this.id][0] + 96;
				} else if(this.velY<0){
					this.sprite.pos[0] = ghostcolor[this.id][0] + 64;
				}
				this.sprite.frames = [0,-1];
			} else if (this.state == Ghost.VULNERABLE) {
				if(thisGame.ghostTimer<100 && thisGame.ghostTimer%20<10){
					this.sprite.pos = ghostcolor[4].slice(0);
					this.sprite.frames = [0,1,2,3];
				} else {
					this.sprite.pos = ghostcolor[4].slice(0);
					this.sprite.frames = [0,1];
				}
			}
		} else {
			this.sprite.pos = ghostcolor[5].slice(0);
			this.sprite.frames = [0];
			if(Math.abs(this.velX) > Math.abs(this.velY)){
				if(this.velX> 0){
					this.sprite.pos[0] = ghostcolor[5][0] + 0;
				} else {
					this.sprite.pos[0] = ghostcolor[5][0] + 16;
				}
			} else {
				if(this.velY > 0){
					this.sprite.pos[0] = ghostcolor[5][0] + 48;
				} else {
					this.sprite.pos[0] = ghostcolor[5][0] + 32;
				}
			}
		}
		this.sprite.update(delta);
		this.sprite.render(ctx);

	}; // draw

	    	this.move = function() {

				// Test13 Tu código aquí
				// Si esl estado del fantasma es Ghost.SPECTACLES
				// Mover el fantasma lo más recto posible hacia la casilla de salida
				// Tu código aquí
				if(this.state != Ghost.SPECTACLES){
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
				} else {
					var umbral = this.speed*2;
					if(Math.abs(this.homeX-this.x)<umbral && Math.abs(this.homeY-this.y)<umbral){
						this.x = this.homeX;
						this.y = this.homeY;
						this.state = Ghost.NORMAL;
					} else {
						var difX = this.homeX-this.x;
						var difY = this.homeY-this.y;
						this.velX = this.speed*difX/Math.max(Math.abs(difX),Math.abs(difY));
						this.velY = this.speed*difY/Math.max(Math.abs(difX),Math.abs(difY));
						this.x += this.velX;
						this.y += this.velY;
					}
				}
				this.sprite.posObj = [this.x,this.y];

		};

	}; // fin clase Ghost

	 // static variables
	  Ghost.NORMAL = 1;
	  Ghost.VULNERABLE = 2;
	  Ghost.SPECTACLES = 3;

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

		this.checkIfHit = function(playerX, playerY, x, y, holgura){
		
			// Tu código aquí	
			if(Math.abs(playerX-x)<holgura && Math.abs(playerY-y)<holgura){
				return true;
			} else {
				return false
			}	
		};


		this.checkIfHitSomething = function(playerX, playerY, row, col){
			var tileID = {
	    		'door-h' : 20,
				'door-v' : 21,
				'pellet-power' : 3,
				'pellet': 2
			};

			// Tu código aquí
			//  Gestiona la recogida de píldoras
			//
			// test12 TU CÓDIGO AQUÍ
			// Gestiona la recogida de píldoras de poder
			// (cambia el estado de los fantasmas)

			var colPac = Math.floor(playerX/thisGame.TILE_WIDTH);
			var rowPac = Math.floor(playerY/thisGame.TILE_HEIGHT);
			if(colPac==col&&rowPac==row){
				if(thisLevel.getMapTile(row,col)==tileID['pellet']){
					thisLevel.setMapTile(row,col,0);
					thisLevel.pellets--;
					thisGame.addToScore(10);
					soundEat.play();
					if(thisLevel.pellets==0){
						console.log("CHAN TATA CHAN, ganaste !!!!");
					}
				} else if(thisLevel.getMapTile(row,col)==tileID['pellet-power']){
					thisLevel.setMapTile(row,col,0);
					thisLevel.pellets--;
					thisGame.addToScore(50);
					thisGame.ghostTimer = 360;
					if(thisLevel.pellets==0){
						console.log("CHAN TATA CHAN, ganaste !!!!");
					}
				}
			}

			//Gestiona los portales

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
		//this.angle1 = 0.25;
		//this.angle2 = 1.75;
		this.sprite = new Sprite(pathSprites, [471,0], [16,16], 0.005, [0,-1],[this.x,this.y],[TILE_WIDTH,TILE_HEIGHT]);
	};
	Pacman.prototype.move = function() {

		// Tu código aquí
		var newX = this.x + this.velX;
	    var newY = this.y + this.velY;
	  	var row = Math.floor(newY/thisGame.TILE_HEIGHT);
	  	var col = Math.floor(newX/thisGame.TILE_WIDTH);

	  	//
		// tras actualizar this.x  y  this.y... 
		 // check for collisions with other tiles (pellets, etc)
		    thisLevel.checkIfHitSomething(this.x, this.y, this.nearestRow, this.nearestCol);
		// ....
		// test13 Tu código aquí.  Si chocamos contra un fantasma y su estado es Ghost.VULNERABLE
		// cambiar velocidad del fantasma y pasarlo a modo Ghost.SPECTACLES
		for(var i = 0; i< numGhosts;i++){
			if(thisLevel.checkIfHit(this.x,this.y,ghosts[i].x,ghosts[i].y,thisGame.TILE_WIDTH/2)){
				if(ghosts[i].state == Ghost.VULNERABLE){
					thisGame.addToScore(100);
					ghosts[i].state = Ghost.SPECTACLES;
				} else if(ghosts[i].state == Ghost.NORMAL){
					thisGame.setMode(thisGame.HIT_GHOST);
				}
			}
		}
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

	  	this.sprite.posObj = [this.x,this.y];

	  	this.nearestRow = row;
	  	this.nearestCol = col;
		
		// test14 Tu código aquí. 
		// Si chocamos contra un fantasma cuando éste esta en estado Ghost.NORMAL --> cambiar el modo de juego a HIT_GHOST

	};


     // Función para pintar el Pacman
     Pacman.prototype.draw = function(x, y) {
         
        // Pac Man
	    if(thisGame.mode == thisGame.HIT_GHOST){
	    	if(thisGame.modeTimer == 20){
	    		this.sprite.pos = [487,0];
	    		this.sprite.frames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
	    		this.sprite._index = 0;
	    		this.sprite.speed = 0.01;
	    	}
	    }
	    else{
	    	this.sprite.frames = [0,-1];
	    	this.sprite.speed = 0.005;
			// tu código aquí 
			if(this.velX>0){
				//this.angle1 = 0+0.25;
				//this.angle2 = 0+1.75;
				this.sprite.pos = [471,0];
			} else if(this.velX<0){
				//this.angle1 = 1+0.25;
				//this.angle2 = 1+1.75;
				this.sprite.pos = [471,16];
			} else if(this.velY>0){
				//this.angle1 = 0.5+0.25;
				//this.angle2 = 0.5+1.75;
				this.sprite.pos = [471,48];
			} else if(this.velY<0){
				//this.angle1 = 1.5+0.25;
				//this.angle2 = 1.5+1.75;
				this.sprite.pos = [471,32];
			}
		}
		this.sprite.update(delta);
		this.sprite.render(ctx);
		/*
		ctx.beginPath();
		var r = this.radius;
		var x = this.x+thisGame.TILE_WIDTH/2;
		var y = this.y+thisGame.TILE_HEIGHT/2;
		ctx.arc(x,y,r,this.angle1*Math.PI,this.angle2*Math.PI,false);
		ctx.lineTo(x,y);
		ctx.closePath();
		ctx.fillStyle = "yellow";
		ctx.fill();	   
		*/  
    };

	var player = new Pacman();
	for (var i=0; i< numGhosts; i++){
		ghosts[i] = new Ghost(i, canvas.getContext("2d"));
	}


	var thisGame = {
		getLevelNum : function(){
			return 0;
		},
	    setMode : function(mode) {
			this.mode = mode;
			this.modeTimer = 0;
		},
		displayScore: function(ctx){
			ctx.font = "bold 18px sans-serif";
			ctx.fillStyle = "red";
			ctx.fillText("Lives: "+this.lives,this.TILE_WIDTH,this.TILE_HEIGHT-5);
			ctx.fillStyle = "white";
			ctx.fillText(this.points,5*this.TILE_WIDTH,this.TILE_HEIGHT-5);
			ctx.fillStyle = "red";
			ctx.fillText("High Score",12.5*this.TILE_WIDTH,this.TILE_HEIGHT-5);
			ctx.fillStyle = "white";
			ctx.fillText(this.highscore,17*this.TILE_WIDTH,this.TILE_HEIGHT-5);
		},
		printLevelComplete: function(ctx){
			ctx.font = "bold 18px sans-serif";
			ctx.fillStyle = "red";
			ctx.fillText("LEVEL COMPLETE",7*this.TILE_WIDTH+10,11*this.TILE_HEIGHT);
		},
		printGameOver: function(ctx){
			ctx.font = "bold 18px sans-serif";
			ctx.fillStyle = "red";
			ctx.fillText("GAME OVER",8*this.TILE_WIDTH+10,11*this.TILE_HEIGHT);
		},
		pause: function(ctx){
			ctx.font = "bold 18px sans-serif";
			ctx.fillStyle = "red";
			ctx.fillText("--- pause ---",8*this.TILE_WIDTH+10,11*this.TILE_HEIGHT-5);
		},
		addToScore: function(pts){
			this.points += pts;
		},
		screenTileSize: [24, 21],
		TILE_WIDTH: 24, 
		TILE_HEIGHT: 24,
		ghostTimer: 0,
		NORMAL : 1,
		HIT_GHOST : 2,
		GAME_OVER : 3,
		WAIT_TO_START: 4,
		LEVEL_COMPLETE: 5,
		PAUSE: 6,
		modeTimer: 0,
		lives: 3,
		points: 0,
		highscore: 0
	};

	var thisLevel = new Level(canvas.getContext("2d"));
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

		if(thisGame.mode == thisGame.PAUSE){
			if(inputStates.p){
				inputStates.p = false;
				thisGame.setMode(thisGame.NORMAL);
			}
		} else {
			if(inputStates.p){
				inputStates.p = false;
				thisGame.setMode(thisGame.PAUSE);
			}
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
		}
	};


    var updateTimers = function(){
		// tu código aquí (test12)
        // Actualizar thisGame.ghostTimer (y el estado de los fantasmas, tal y como se especifica en el enunciado)
    	var gt = thisGame.ghostTimer;
        var estado;
        if(gt==0){
        	estado = Ghost.NORMAL;
        } else {
        	estado = Ghost.VULNERABLE;
        	thisGame.ghostTimer--;
        }
        for(var i = 0; i<numGhosts; i++){
        	if(ghosts[i].state != Ghost.SPECTACLES){
	        	ghosts[i].state = estado;
	        }
        }
        // tu código aquí (test 14)
        // actualiza modeTimer...
        thisGame.modeTimer++;
    };

    var mainLoop = function(time){
        //main function, called each frame 
        measureFPS(time);

        delta = timer(time);
     
		// test14
		// tu código aquí
	    // sólo en modo NORMAL
	    if(thisGame.mode==thisGame.NORMAL){
			checkInputs();

			// Tu código aquí
			// Mover fantasmas
			for (var i = 0; i < numGhosts; i++) {
				var gh = ghosts[i];
				gh.move();
			};

			if(thisLevel.pellets==0){
				thisGame.setMode(thisGame.LEVEL_COMPLETE);
			}

			player.move();
		} 
	    // en modo HIT_GHOST
	    // 	seguir el enunciado...
	    else if(thisGame.mode==thisGame.HIT_GHOST) {
	    	if(thisGame.modeTimer==20){
		    	soundDie.play();
		    }
	    	if(thisGame.modeTimer>=90){
	    		thisGame.lives--;
	    		if(thisGame.lives>0){
		    		reset();
		    		thisGame.setMode(thisGame.WAIT_TO_START);
		    	} else {
		    		thisGame.setMode(thisGame.GAME_OVER);
		    	}
	    	}
	    }
	    // 	en modo WAIT_TO_START
	    // 	segur el enunciado...
	    else if(thisGame.mode==thisGame.WAIT_TO_START) {
	    	if(thisGame.modeTimer>=30){
	    		thisGame.setMode(thisGame.NORMAL);
	    	}
	    }
	    // 	en modo GAME_OVER
	    // 	segur el enunciado...
	    else if(thisGame.mode==thisGame.GAME_OVER) {
	    	//thisGame.printGameOver(ctx);
	    } 
	    // 	en modo LEVEL_COMPLETE
	    // 	segur el enunciado...
	    else if(thisGame.mode==thisGame.LEVEL_COMPLETE) {
	    	//thisGame.printLevelComplete(ctx);
	    }
	    // 	en modo PAUSE
	    else if(thisGame.mode==thisGame.PAUSE){
			checkInputs();
		}

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

		thisGame.displayScore(ctx);


		if(thisGame.mode==thisGame.GAME_OVER) {
	    	thisGame.printGameOver(ctx);
	    }else if(thisGame.mode==thisGame.LEVEL_COMPLETE) {
	    	thisGame.printLevelComplete(ctx);
	    }else if(thisGame.mode==thisGame.PAUSE){
			thisGame.pause(ctx);
		}

		updateTimers();
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

		    inputStates.p = false;
		    if (e.keyCode === 80){inputStates.p = true;}
		  });
    };

    var reset = function(){
    	inputStates = {left:false,right:false,down:false,up:false,p:false};
		// Tu código aquí (test12)
	    // probablemente necesites inicializar los atributos de los fantasmas
	    // (x,y,velX,velY,state, speed)
	    //En el loop del test 10

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
			gh.state = Ghost.NORMAL;
		};
	    // test14
	     thisGame.setMode( thisGame.NORMAL);
    };

    function init(){
		addListeners();
		reset();

		soundEat = new Howl({
        	src: ["res/sounds/eating.mp3"],
        	volume: 0.5,
        	onload: function() {
        		soundDie = new Howl({
		        	src: ["res/sounds/die.mp3"],
		        	volume: 0.5,
		        	onload: function() {
		        		// start the animation
		        		requestAnimationFrame(mainLoop);
		        	}
		        })
		    }
        });
    }

    var start = function(){
        // adds a div for displaying the fps value
        fpsContainer = document.createElement('div');
        document.body.appendChild(fpsContainer);

		
  		resources.load([pathSprites])

  		resources.onReady(init);
    };

    //our GameFramework returns a public API visible from outside its scope
    return {
        start: start,
		thisGame: thisGame
    };
};


var game = new GF();
game.start();

