var nextConnectionNo = 1000;
var population;
var speed = 60;
var showBest = true;
var runBest = false;
var humanPlaying = false;
var humanPlayer;
var showBrain = false;
var showBestEachGen = false;
var upToGen = 0;
var genPlayerTemp;
var showNothing = false;
var popSize = 150;

var cycles = 1;

var colors = ["blue", "red", "gold"];
var walls;
var firstCoords;
var playerStartX = 60;
var playerStartY = 224;

var debugMode = false;
var car;
var selectedCar;

function preload() {
	car = loadImage('../assets/car.png');
	selectedCar = loadImage('../assets/selectedCar.png');
}

function setup() {
	createCanvas(900, 500);

	walls = [
		new Boundary(20, 424, 18, 106),
		new Boundary(19, 106.5, 65, 44.5),
		new Boundary(64, 44, 373, 37),
		new Boundary(375, 36.5, 404, 60.5),
		new Boundary(374, 37, 456, 109),
		new Boundary(457, 110.5, 471, 221.5),
		new Boundary(472, 223, 522, 242),
		new Boundary(522, 242.5, 748, 237.5),
		new Boundary(750, 236, 823, 271),
		new Boundary(825, 272, 828, 351),
		new Boundary(709, 462, 449, 475),
		new Boundary(448, 477, 376, 442),
		new Boundary(375, 441, 58, 463),
		new Boundary(58, 463.5, 20, 424.5),

		new Boundary(95, 123, 99, 354),
		new Boundary(99, 355, 123, 381),
		new Boundary(121, 380, 354, 346),
		new Boundary(356, 343, 430, 369),
		new Boundary(430, 369, 702, 366),
		new Boundary(704, 364.5, 719, 334.5),
		new Boundary(718, 333, 697, 320),
		new Boundary(697, 319, 519, 318),
		new Boundary(514, 316.5, 440, 291.5),
		new Boundary(438, 289, 401, 275),
		new Boundary(401, 273.5, 377, 155.5),
		new Boundary(375, 156, 327, 106),
		new Boundary(327, 106.5, 120, 104.5),
		new Boundary(120, 105, 95, 121),

		new Boundary(829, 353, 711, 463),
	]

	population = new Population(popSize);
	humanPlayer = new Player(playerStartX, playerStartY);
}
function draw() {
	cycles = $(".cycles").val()
	for (var c = 0; c < cycles; c ++) {
		background(60, 60, 60);

		textAlign(LEFT);
		fill(255, 255, 255);
		stroke(0, 0, 0);
		textSize(30);
		text("Покоління " + population.gen, 500, 200);
	
		for (var wall of walls) {
			stroke(255, 255, 255);
			wall.draw();
		}
	
		if (!population.done()) {
			population.updateAlive();
		} else {
			population.naturalSelection();
		}
		// if (humanPlayer.dead) {
		// 	console.log("deadd");
		// }
		// humanPlayer.update();
		// humanPlayer.show();
		drawBrain();
	}

}

function drawBrain() {
	var startX = 500;
	var startY = 20;
	var w = 300;
	var h = 150;
  
	var selectedPlayer;

	if (runBest) {
	  	population.bestPlayer.brain.drawGenome(startX, startY, w, h);
		selectedPlayer = population.bestPlayer;
	} else
	if (humanPlaying) {
	  	showBrain = false;
		selectedPlayer = null;
	} else if (showBestEachGen) {
	  	genPlayerTemp.brain.drawGenome(startX, startY, w, h);
		selectedPlayer = genPlayerTemp;
	} else {
	  	population.players[0].brain.drawGenome(startX, startY, w, h);
		selectedPlayer = population.players[0];
	}
	if (selectedPlayer) {
		selectedPlayer.selected = true;
		if (!selectedPlayer.dead) {
			selectedPlayer.show();
		}
	}
  }

function mouseReleased() {
	$(".road").append(`<p>new Boundary(${firstCoords[0]}, ${firstCoords[1]}, ${mouseX}, ${mouseY}),</p>`);
	walls.push(new Boundary(firstCoords[0], firstCoords[1], mouseX, mouseY));
}

function mousePressed() {
	console.log(mouseX, mouseY);
	firstCoords = [mouseX, mouseY];
}

function keyReleased() {
	switch (key) {
		case "W":
			humanPlayer.controls.up = false;
			break;
		case "A":
			humanPlayer.controls.left = false;
			break;
		case "S":
			humanPlayer.controls.down = false;
			break;
		case "D":
			humanPlayer.controls.right = false;
			break;
	}
}

function keyPressed() {
	switch (key) {
		case "W":
			humanPlayer.controls.up = true;
			break;
		case "A":
			humanPlayer.controls.left = true;
			break;
		case "S":
			humanPlayer.controls.down = true;
			break;
		case "D":
			humanPlayer.controls.right = true;
			break;
		case "M":
			debugMode = !debugMode;
	}
}