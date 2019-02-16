let canvasWidth = 1024;
let canvasHeight = 768;
let canvas = document.getElementById("mycanvas");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
let ctx = canvas.getContext("2d");
let lastRender = window.performance.now();


let keyAPressed = false;
let keyDPressed = false;
let keyWPressed = false;


let skyBackground = {
	img: new Image(),
	imgWidth: 282,	
};
skyBackground.img.src = "images/sky.png";

let obstacle = {
	img: new Image(),
	x: 400,
	y: canvasHeight - 75,
	width: 50,
	height: 50,
};
obstacle.img.src = "images/crate.png";

let obstacle1 = {
	img: new Image(),
	x: 150,
	y: 550,
	width: 100,
	height: 100,
};
obstacle1.img.src = "images/crate.png";

let platform1 = {
	imgStart: new Image(),
	img: new Image(),
	imgEnd: new Image(),
	x: 600,
	y: 600,
	width: 300,
	height: 50,
	imgWidth: 50,
	imgHeight: 50,
};
platform1.img.src = "images/platformMiddle.png";
platform1.imgStart.src = "images/platformStart.png";
platform1.imgEnd.src = "images/platformEnd.png";



let groundRectangle = {
	img: new Image(),
	x: 0,
	y: canvasHeight - 25,
	width: canvasWidth,
	height: 25,
	imgWidth: 25,
	imgHeight: 25,
};
groundRectangle.img.src = "images/tile.png";


let playableShape = {
	imgLeft: new Image(),
	imgRight: new Image(),
	drawImage: "left",
	x: 300,
	y: 250,
	width: 39,
	height: 52.5,
	velocity: 0,
	acceleration: 0,
	isOnSurface: false,
};
playableShape.imgLeft.src = "images/characterLeft.png";
playableShape.imgRight.src = "images/characterRight.png";

let listOfAllObjects = [groundRectangle, obstacle, obstacle1, platform1];



document.addEventListener('keydown', function(event) {
	if(event.code === "KeyA") {
		keyAPressed = true;
	} else if(event.code === "KeyD") {
		keyDPressed = true;
	} else if(event.code === "KeyW") {
		keyWPressed = true;
	}
  
});

document.addEventListener('keyup', function(event) {
  if(event.code === "KeyA") {
		keyAPressed = false;
	} else if(event.code === "KeyD") {
		keyDPressed = false;
	} else if(event.code === "KeyW") {
		keyWPressed = false;
	}
});

function update(delta) {
  let keyPresses = {
	  A: keyAPressed,
	  D: keyDPressed,
	  W: keyWPressed
  };

	if(keyPresses.A === true) {
		playableShape.drawImage = "left";
	}

	if(keyPresses.D === true) {
		playableShape.drawImage = "right";
	}
 
  updateMovementAndCollision(delta,keyPresses, playableShape, listOfAllObjects, [0, canvasHeight, canvasWidth, 0]);
}




function draw() {
	ctx.clearRect(0, 0, 800, 800);
	
	if (skyBackground.img.complete) {
		for(let xPos = 0; xPos <= canvasWidth; xPos += skyBackground.imgWidth) {
			ctx.drawImage(skyBackground.img, xPos, 0, skyBackground.imgWidth, canvasHeight);
		}
    }
	
	if (playableShape.imgLeft.complete) {
		if(playableShape.drawImage === "left") {
			ctx.drawImage(playableShape.imgLeft, playableShape.x, playableShape.y, playableShape.width, playableShape.height);
		} else {
			ctx.drawImage(playableShape.imgRight, playableShape.x, playableShape.y, playableShape.width, playableShape.height);
		}
		
	}
	
	if (groundRectangle.img.complete) {
		for(let xPos = 0; xPos <= groundRectangle.width; xPos += groundRectangle.imgWidth) {
			ctx.drawImage(groundRectangle.img, xPos, groundRectangle.y, groundRectangle.imgWidth, groundRectangle.imgHeight);
		}
    }
	
	if (platform1.img.complete) {
		for(let xPos = platform1.x ; xPos < platform1.x + platform1.width; xPos += platform1.imgWidth) {
			if(xPos === platform1.x) {
				ctx.drawImage(platform1.imgStart, xPos, platform1.y, platform1.imgWidth, platform1.imgHeight);
			} else if(xPos +platform1.imgWidth >= platform1.x + platform1.width) {
				ctx.drawImage(platform1.imgEnd, xPos, platform1.y, platform1.imgWidth, platform1.imgHeight);
			} else {
				ctx.drawImage(platform1.img, xPos, platform1.y, platform1.imgWidth, platform1.imgHeight);
			}
			
		}
    }
	
	
	if(obstacle.img.complete) {
		ctx.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
	}
	
	if(obstacle1.img.complete) {
		ctx.drawImage(obstacle1.img, obstacle1.x, obstacle1.y, obstacle1.width, obstacle1.height);
	}
}



function loop(timestamp) {
	const delta = timestamp - lastRender;
	
	if(delta > 13) {
		update(delta);
		draw();
		lastRender = timestamp;
	}
	
	window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);