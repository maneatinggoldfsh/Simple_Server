window.onload = function() {

canvasCont = document.getElementById("gameCanvas");

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
canvasCont.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";
//2
var heroReady2 = false;
var heroImage2 = new Image();
heroImage2.onload = function () {
	heroReady2 = true;
};
heroImage2.src = "images/hero2.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";
var monsterReady = false;
//2
var monsterImage2 = new Image();
monsterImage2.onload = function () {
	monster2Ready = true;
};
monsterImage2.src = "images/monster2.png";

// Coin image
var coinReady = false;
var coinImage = new Image();
coinImage.onload = function () {
	coinReady = true;
};
coinImage.src = "images/coin.png";


// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};

var coin = {
	x : 0,
	y : 0,
	collected : 0,
	reset : function(){
		// Throw the monster somewhere on the screen randomly
		coin.x = 32 + (Math.random() * (canvas.width - 64));
		coin.y = 32 + (Math.random() * (canvas.height - 64));
	}
};
var coinsCollected = 0;

var isCloseL = false;
var isCloseR = false;
var isCloseU = false;
var isCloseD = false;

var animate = {
	hero : {
		frame : 1,
		tick : 0,
		ticker : function(){
			this.tick++;
			if(this.tick >= 50){
				this.frame = 1;
				this.tick = 0;
			}
			if(this.tick<=25){
				this.frame = 1;
			} else if(this.tick>25){
				this.frame = 2;
			}
		}
	},
	monster : {
		frame : 1,
		tick : 0,
		ticker : function(){
			this.tick++;
			if(this.tick >= 60){
				this.frame = 1;
				this.tick = 0;
			}
			if(this.tick<=30){
				this.frame = 1;
			} else if(this.tick>30){
				this.frame = 2;
			}
		}
	}
}

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));

	coin.collected = 0;
	coin.reset();

	keysDown = {};
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
		if(hero.y <= 0){hero.y = 0}	//up
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
		if(hero.y >= 450){hero.y = 450} //down
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
		if(hero.x <= 0){hero.x = 0} // left
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
		if(hero.x >= 480){hero.x = 480} //right
	}
	
	
	animate.hero.ticker();
	animate.monster.ticker();

	isCloseL = monster.x <= hero.x+128 && hero.x-16 < monster.x;
	isCloseR = monster.x >= hero.x-128 && hero.x+16 > monster.x;
	isCloseU = monster.y <= hero.y+128 && hero.y-16 < monster.y;
	isCloseD = monster.y >= hero.y-128 && hero.y+16 > monster.y;


	//monstergoesright
	if(hero.x>=monster.x && isCloseR && (isCloseD || isCloseU)){monster.x += hero.speed/3 * modifier}
	//monstergoesleft
	if(hero.x<=monster.x && isCloseL && (isCloseD || isCloseU)){monster.x -= hero.speed/3 * modifier}
	//monstergoesup
	if(hero.y<=monster.y && isCloseU && (isCloseL || isCloseR)){monster.y -= hero.speed/3 * modifier}
	//monstergoesdown
	if(hero.y>=monster.y && isCloseD && (isCloseL || isCloseR)){monster.y += hero.speed/3 * modifier}
	else {
			//monstergoesright
			if(coin.x>=monster.x){monster.x += hero.speed/10 * modifier}
			//monstergoesleft
			if(coin.x<=monster.x){monster.x -= hero.speed/10 * modifier}
			//monstergoesup
			if(coin.y<=monster.y){monster.y -= hero.speed/10 * modifier}
			//monstergoesdown
			if(coin.y>=monster.y){monster.y += hero.speed/10 * modifier}

	}






	//Monster Edge Detection
	if(monster.y <= 0){monster.y = 0}	//up
	if(monster.y >= 450){monster.y = 450} //down
	if(monster.x <= 0){monster.x = 0} // left
	if(monster.x >= 480){monster.x = 480} //right

	// monster - Hero collision
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		alert("You were caught by the goblin!")
		reset();
	}

	// Coin - Hero collision
	if (
		hero.x <= (coin.x + 32)
		&& coin.x <= (hero.x + 32)
		&& hero.y <= (coin.y + 32)
		&& coin.y <= (hero.y + 32)
	) {
		++coin.collected;
		coin.reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (coinReady) {
		ctx.drawImage(coinImage, coin.x, coin.y);
	}

	if (heroReady&&animate.hero.frame === 1) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	} else if (heroReady2&&animate.hero.frame === 2){
		ctx.drawImage(heroImage2, hero.x, hero.y);
	}

	if (monsterReady&&animate.monster.frame === 1) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	} else if (monsterReady&&animate.monster.frame === 2) {
		ctx.drawImage(monsterImage2, monster.x, monster.y);
	} 

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Coins Collected: " + coin.collected, 32, 32);

	//Debugging Stuff, change if to true!
	if(false){
		ctx.font = "12px Helvetica";
		ctx.fillText("Player x: " + hero.x, 32, 62);
		ctx.fillText("Player y: " + hero.y, 32, 80);
		ctx.fillText("isCloseL: " + isCloseL, 32, 98);
		ctx.fillText("isCloseR: " + isCloseR, 32, 116);
		ctx.fillText("isCloseU: " + isCloseU, 32, 134);
		ctx.fillText("isCloseD: " + isCloseD, 32, 152);
		ctx.fillText("coin.collected: " + coin.collected, 32, 170);

		canvas.addEventListener("mousedown", getPosition, false);

		function getPosition(event)
		{
		  var x = event.x;
		  var y = event.y;
		  x -= canvas.offsetLeft;
		  y -= canvas.offsetTop;

		  monster.x = x-16;
		  monster.y = y-16;

		  //alert("x:" + x + " y:" + y);
		}
	}
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();

};