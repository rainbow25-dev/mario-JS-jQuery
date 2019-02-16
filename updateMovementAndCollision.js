/**
 * This is the function that you need to implement. The function is responsible for all the updates such as
 * Playable object movement, gravity, collision detection and so on.
 * @param deltaTime: Passed time since last update.
 * @param keyPresses: Array of booleans indicating the keys that are currently pressed. You can use
 * this data of keys A,D and W press statuses as follows. For example if you want to see if key A is pressed, then
 * you can check to see if keyPressed.A is true or false. If true then A is pressed, if false then it is not.
 * @param playableObject: This is the only object that you need to apply the gravity movement on. This is going to be the
 * only object that moves, the rest of the objects are static. Please see script.js to see the structure of this object.
 * @param listOfAllObjects: This is an array of static objects that the playable object can collide with.
 * Please see script.js to see the structure of these objects. Ideally the only attributes that you should care about are
 * x,y,width and height. All the objects in these array will have these attributes.
 * @param boundingBox: Bounding box of the canvas in the following order [left, bottom, right, top]
 */

function updateMovementAndCollision(deltaTime, keyPresses, playableObject, listOfAllObjects, boundingBox) {
	// playableObject.isOnSurface = false; // Flag to indicate if the object is on top of solid surface. You can modify it if you want.

	let clientRect = {
		left: boundingBox[0],
		bottom: boundingBox[1],
		right: boundingBox[2],
		top: boundingBox[3]
	}

	let direction;

	// TODO: Implement the character movement.
	// Pressing W will make the playableObject jump.
	// Object can`t jump if it is in the air.

	if (keyPresses.W == true) {
		if (playableObject.isOnSurface === true) {
			direction = "up";
			startJumpUp(playableObject);
		}
	}

	// Pressing D will make the playableObject to move right.
	// Make sure the object can`t enter the bounding box.

	if (keyPresses.D == true) {
		direction = "right";
		moveHorizontal(playableObject, direction);
		detectAndCorrect(listOfAllObjects, playableObject, direction)
	}

	// Pressing A will make the playableObject to move left.
	// Make sure the object can`t enter the bounding box.

	if (keyPresses.A == true) {
		direction = "left";
		moveHorizontal(playableObject, direction);
		detectAndCorrect(listOfAllObjects, playableObject, direction)
	}

	// TODO: Implement collision detection and correction.
	// When our playableObject encounters any other object from the list of listOfAllObjects, then the collision
	// Should be detected and corrected. For example when the object falls down to the ground due to gravity, the
	// Collision detection should detect this and prevent the playableObject from falling through other objects
	// by correcting the position and velocity of the playableObject.

	if (playableObject.isOnSurface === false) {
		direction = playableObject.velocity >= 0 ? "down" : "up";

		moveVerticalUsingGravity(playableObject);

		// reached maximum height, turn direction to down
		if (direction === "up" && playableObject.velocity > 0) {
			startJumpDown(playableObject);
			direction = "down";
		}
		detectAndCorrect(listOfAllObjects, playableObject, direction);
	}

	detectOutOfCanvas(playableObject, clientRect);
}


let gravity = 0.98; // Gravity value for calculating the downward velocity. You can change it if you want
let initialSpeedY = -20; // v0 when thrown up
let speedX = 5; // Horizontal movement speed of the playable object.

function detectOutOfCanvas(person, rect) {
	// reached right edge of the container rectangle
	if (person.x + person.width > rect.right) {
		person.x = rect.right - person.width;
	}

	// reached left edge
	if (person.x < rect.left) {
		person.x = rect.left;
	}

	// reached top edge
	if (person.y < rect.top) {
		person.y = rect.top;
		startJumpDown(person);
	}

	// reached bottom edge
	if (person.y + person.height > rect.bottom) {
		person.y = rect.bottom - person.height;
		stopJumpGravity(person);
	}
}

function startJumpDown(person) {
	person.velocity = 0;
	person.acceleration = gravity;
}

function startJumpUp(person) {
	person.acceleration = (-1) * gravity;
	person.velocity = initialSpeedY;
	person.isOnSurface = false;
}

function stopJumpGravity(person) {
	person.velocity = 0;
	person.acceleration = 0;
	person.isOnSurface = true;
}

function moveHorizontal(person, direction) {
	person.x += (direction === "left" ? -1 : 1) * speedX;
	person.isOnSurface = false;
}

function moveVerticalUsingGravity(person) {
	const direction = person.velocity >= 0 ? 1 : -1;

	if (person.acceleration === 0) {
		person.acceleration = gravity;
	}
	person.velocity += direction * person.acceleration;
	person.y += person.velocity;
}

function isOverlapped(rect1, rect2) {
	let bound1 = {
		left: rect1.x,
		right: rect1.x + rect1.width,
		top: rect1.y,
		bottom: rect1.y + rect1.height
	};

	let bound2 = {
		left: rect2.x,
		right: rect2.x + rect2.width,
		top: rect2.y,
		bottom: rect2.y + rect2.height
	};

	if (bound1.left >= bound2.right || bound1.right <= bound2.left ||
		bound1.top >= bound2.bottom || bound1.bottom <= bound2.top) {
		return false;
	}
	return true;

}

function hasFoundOverlap(obstacle, person, direction) {
	if (isOverlapped(obstacle, person) == false) {
		return false;
	}
	switch (direction) {
		case "left":
			person.x = obstacle.x + obstacle.width;
			break;
		case "right":
			person.x = obstacle.x - person.width;
			break;
		case "down":
			person.y = obstacle.y - person.height;
			stopJumpGravity(person);
			break;
		case "up":
			person.y = obstacle.y + obstacle.height;
			startJumpDown(person);
			break;
	}

	return true;
}

function detectAndCorrect(listOfAllObjects, nextObject, direction) {
	for (let i = 0; i < listOfAllObjects.length; i++) {
		if (hasFoundOverlap(listOfAllObjects[i], nextObject, direction) == true)
			return;
	}
}
