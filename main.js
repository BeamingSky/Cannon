//-----------Canvas Setup:------------//

// Initialize the canvas and its context
//########################################################[1]########################################################
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 600; // Width set to 1000 pixels
canvas.height = 600; // Height set to 600 pixels

//----------Audio and Image Loading:------------//

//Here, an audio element (cannonSfx) and an image element (cannonTop) are created and loaded with sound and image files, respectively.
// Load the cannon firing sound
let cannonSfx = new Audio("Anti.mp3");
// Load the cannon top image
let cannonTop = new Image();
cannonTop.src = "cannon.png";


// --------------Initialize mouse position and angle----------------//

//########################################################[14]########################################################
let mousePos = null; // Variable is updated with the actual mouse position when the user moves the mouse within the canvas area.

//########################################################[16]########################################################
let angle = null; // Store the cannon's angle

//----------------Cannon Shooting Control:-----------------//

//canShoot is a boolean variable that controls whether the cannon can shoot. It's initially set to true to allow shooting.
let canShoot = true; // Initialize canShoot as true to allow shooting

//---------------Function for Calculating Cannonball Position:-----------------//

//This function calculates the position of the cannonball when it's shot from the cannon. It takes the current cannon position and calculates the new position based on the angle of the cannon.
//########################################################[28]########################################################
function sortBallPos(x, y) {
  // Calculate the new position of the cannonball after shooting
  let rotatedAngle = angle; // Store the current angle of the cannon
  let dx = x - (cannon.x + 15); // Calculate the horizontal distance between cannon nozzle and target
  let dy = y - (cannon.y - 50); // Calculate the vertical distance between cannon nozzle and target
  let distance = Math.sqrt(dx * dx + dy * dy); // Calculate the distance using Pythagoras' theorem
  let originalAngle = Math.atan2(dy, dx); // Calculate the original angle between cannon nozzle and ball

  // Calculate the new positions:
  // Calculate the new X and Y positions of the cannonball after shooting.
  // We want to determine where the cannonball should be based on its initial position,
  // the angle it's fired at, and the distance it should travel.
  // newX represents the new X-coordinate, and newY represents the new Y-coordinate.
  // ----------------------------------------------------------------
  // Calculate the horizontal component (X-coordinate) of the new position:
  // - Start with the current X-coordinate of the cannon nozzle (cannon.x).
  // - Add an offset of 15 units to account for the distance from the cannon's base to its nozzle.
  // - Calculate the horizontal distance the cannonball should travel (distance) by using the angle
  //   (originalAngle + rotatedAngle) and multiplying it by the overall distance.
  let newX = cannon.x + 15 + distance * Math.cos(originalAngle + rotatedAngle);

  // Calculate the vertical component (Y-coordinate) of the new position:
  // - Start with the current Y-coordinate of the cannon nozzle (cannon.y - 50).
  // - Calculate the vertical distance the cannonball should travel (distance) by using the angle
  //   (originalAngle + rotatedAngle) and multiplying it by the overall distance.
  // - Subtract 50 units to account for the height difference between the cannon's base and nozzle.
  let newY = cannon.y - 50 + distance * Math.sin(originalAngle + rotatedAngle);

  // Now, newX and newY represent the updated position of the cannonball after being fired.

  return {
    x: newX,
    y: newY,
  };
}

//---------------Function to Draw Canvas Border:-------------------//
//Global Function
//This function draws a border on the canvas, filling the entire canvas with a background color and then clearing a portion inside the border to create a border effect.
//########################################################[2]########################################################
function drawBorder() {
  ctx.fillStyle = "#666666"; // Color of the border of the frame
  ctx.fillRect(0, 0, canvas.width, canvas.height); // (x, y, width, height)
  ctx.clearRect(20, 20, 560, 560); // Clear a portion inside the border
}

//---------------Cannon Class:-------------//

//This class defines the cannon object. It has methods to draw the cannon stand, rotate the cannon top based on mouse position, and draw the complete cannon.
//########################################################[7]########################################################
class Cannon {
  // Method in a class, used to initialize and set up an object created from the class. x and y, represent the initial coordinates of the cannon's base.
  //######################################################[8]########################################################
  constructor(x, y) {
    this.x = x; // X-coordinate of the cannon's base (LEFT - RIGHT)
    this.y = y; // Y-coordinate of the cannon's base (UP - DOWN)
    this.topX = x - 20; // X-coordinate of the cannon's top part
    this.topY = y - 95; // Y-coordinate of the cannon's top part
  }

  // Draw the cannon stand
  // This method is responsible for drawing the cannon stand.
  //#######################################################[9]########################################################
  stand() {
    // Begin defining a new path for drawing.
    ctx.beginPath();

    // Set the line width to make the strokes bolder (e.g., 3 pixels).
    ctx.lineWidth = 7;

    // Move the drawing "pen" to the starting point of the stand.
    ctx.moveTo(this.x, this.y);

    // Draw a line from the starting point to the middle part of the stand.
    ctx.lineTo(this.x + 15, this.y - 50);

    // Draw another line from the middle part to the end of the stand.
    ctx.lineTo(this.x + 30, this.y);

    // Stroke (draw) the lines to make them visible on the canvas.
    ctx.stroke();
  }

  //---------------------------------------------------------------
  /* Rotate the cannon top based on the mouse position.
  This function calculates the angle at which the cannon top should be rotated
  to point towards the current mouse position and then applies the rotation.*/

  // Check if the mouse position (mousePos) is defined, meaning the mouse is within the canvas.
  //########################################################[17]########################################################
  rotateTop() {
    if (mousePos) {
      // Calculate the angle (in radians) between the cannon nozzle and the mouse position.
      // Use Math.atan2 to compute the angle based on the difference in Y-coordinates
      angle = Math.atan2(
        mousePos.y - (this.y - 60),
        mousePos.x - (this.x + 15)
      );

      // Translate the canvas context to the pivot point (the cannon nozzle).
      // This involves moving the coordinate system to the nozzle's location
      // to perform the rotation around that point.
      ctx.translate(this.x + 15, this.y - 50); // Rotate the cannon around its nozzle

      // Rotate the canvas context by the calculated angle.
      // - This rotates the drawing operations by the specified angle.
      ctx.rotate(angle);

      // Translate the canvas context back to the original position.
      // - After rotation, the context is translated back to its original position
      //   to ensure that subsequent drawing operations are not affected by the rotation.
      ctx.translate(-(this.x + 15), -(this.y - 50));
    }
  }

  // The result is that the cannon top is rotated to align with the mouse position.
  // This enables the player to aim the cannon by moving the mouse.
  //-----------------------------------------------------------------------------
  //#########################################################[10]########################################################
  draw() {
    //called at line 351 in animate().
    // Draw the cannon on the canvas
    // This function combines several drawing operations to render the cannon:
    // 1. The cannon stand is drawn.
    // 2. The cannon top is rotated based on the mouse position.
    // 3. The rotated cannon top image is drawn.

    // Save the current canvas state using ctx.save().
    // - This allows us to temporarily store the current transformation matrix
    //   and other canvas settings so that they can be restored later.
    //#######################################################[19]########################################################
    ctx.save();

    // Draw the cannon stand by calling the stand() method.
    this.stand();

    //#######################################################[18]########################################################
    // Rotate the cannon top based on the mouse position by calling the rotateTop() method.
    this.rotateTop();

    // Draw the cannon top image (cannonTop) with the following parameters:
    // - The image source (cannonTop).
    // - The top left corner's X and Y coordinates (this.topX, this.topY).
    // - The width and height of the image (100, 50).
    //#######################################################[13]########################################################
    ctx.drawImage(cannonTop, this.topX, this.topY, 100, 50);

    // Restore the canvas state to its previous settings using ctx.restore().
    // - This reverts any transformations or changes made within this function
    //   to the original canvas state.
    ctx.restore();

    // The result is that the complete cannon, including the stand and the rotated top,
    // is drawn on the canvas. This function is typically called during the animation loop.
  }
}

//-------------Creating the Cannon Object:---------------//
//[GLOBAL SCOPE]
//An instance of the Cannon class is created with initial coordinates for its position.
//##########################################################[11]########################################################
let cannon = new Cannon(270, 580);

//----------------Array for Cannonballs:-----------------//

//An array is created to store cannonball objects.
//########################################################[22]########################################################
let cannonBalls = [];

//--------------CannonBall Class:---------------//

//This class defines the cannonball object. It stores information about the cannonball's position, velocity, gravity, elasticity, friction, and collision audio.
class CannonBall {
  constructor(angle, x, y) {
    //########################################################[23]####################################################
    //------------Size of the Balls------------//
    this.radius = 15; // Radius of the cannonball
    this.mass = this.radius; // Mass of the cannonball
    this.angle = angle; // Angle at which the cannonball is fired
    this.x = x; // X-coordinate of the cannonball's position
    this.y = y; // Y-coordinate of the cannonball's position

    //-----------Velocity of the Balls---------//
    this.dx = Math.cos(angle) * 9; // Horizontal velocity of the cannonball
    this.dy = Math.sin(angle) * 9; // Vertical velocity of the cannonball

    //--------------Basic Physics------------//
    this.gravity = 0.05; // Acceleration due to gravity
    this.elasticity = 0.5; // Elasticity of collisions
    this.friction = 0.008; // Friction coefficient
    this.collAudio = new Audio("metal.wav"); // Sound for collisions
    this.collAudio.volume = 0.7; // Set the volume for collision sound
    this.shouldAudio = true; // Control whether collision sound should play
    this.timeDiff1 = null; // Store the time of the last collision
    this.timeDiff2 = new Date(); // Store the current time
  }

  // Move the cannonball
  move() {
    // Move the cannonball.
    // This function updates the position of the cannonball based on its velocity,
    // gravity, and friction.

    // Apply gravity to the cannonball's vertical velocity (dy).
    // - Check if the new Y-coordinate (this.y + this.gravity) is less than 580
    //   (assuming 580 is the canvas floor). If so, it means the cannonball is above
    //   the floor and gravity should be applied.
    if (this.y + this.gravity < 580) {
      // Increase the vertical velocity (dy) by the gravitational force (gravity).
      this.dy += this.gravity;
    }

    // Apply friction to the cannonball's horizontal velocity (dx).
    // - Reduce the horizontal velocity (dx) by a fraction of itself, which is determined
    //   by the friction coefficient (this.friction).
    // - This simulates a slowing down of the cannonball's horizontal movement over time.
    this.dx = this.dx - this.dx * this.friction;

    //########################################################[24]####################################################
    // Update the X-coordinate (this.x) by adding the horizontal velocity (dx).
    this.x += this.dx;
    // Update the Y-coordinate (this.y) by adding the vertical velocity (dy).
    this.y += this.dy;

    // The result is that the cannonball's position is updated, and it moves according
    // to its velocity, is affected by gravity, and experiences friction, simulating
    // its motion through the environment.
  }

  // Draw the cannonball on the canvas
  //########################################################[25]####################################################
  draw() {
    // Set the fill style for drawing to "black".
    ctx.fillStyle = "black";

    ctx.beginPath();

    // Draw a filled circle representing the cannonball:
    // - Centered at the current X and Y coordinates of the cannonball (this.x, this.y).
    // - With a radius equal to the cannonball's radius (this.radius).
    // - Starting from the 0 radians angle.
    // - Ending at 2 * Pi radians (a full circle), creating a complete circle.
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    // Fill the circle with the previously set fill style (black).
    ctx.fill();

    // The result is that a filled black circle is drawn on the canvas, representing the cannonball.
  }
}

//----------------Function for Handling Ball-Wall Collisions:------------------//

//This function checks if a cannonball has collided with the walls of the canvas and handles the collision, including changing the direction and playing a collision sound.
// Handle ball collisions with the canvas walls
function ballHitWall(ball) {
  // Check if the cannonball has collided with the canvas walls.
  if (
    ball.x + ball.radius > 580 || // Right wall collision
    ball.x - ball.radius < 20 || // Left wall collision
    ball.y + ball.radius > 580 || // Bottom wall collision
    ball.y - ball.radius < 20 // Top wall collision
  ) {
    // Check if there was a previous collision (ball.timeDiff1 is defined).
    if (ball.timeDiff1) {
      // Calculate the time difference between the current collision and the previous one.
      ball.timeDiff2 = new Date() - ball.timeDiff1;

      // Check if the time between collisions is less than 200 milliseconds.
      // If so, prevent audio playback (ball shouldAudio is set to false).
      ball.timeDiff2 < 200 ? (ball.shouldAudio = false) : null;
    }

    // If audio playback is allowed (shouldAudio is true), play the collision sound.
    if (ball.shouldAudio) ball.collAudio.play();

    // Apply elasticity to the cannonball's vertical velocity (dy).
    ball.dy = ball.dy * ball.elasticity;

    // Handle specific collision cases and change direction accordingly:
    if (ball.x + ball.radius > 580) {
      // Right wall collision:
      // - Set the X-coordinate of the cannonball to prevent it from going beyond the wall.
      // - Reverse the horizontal velocity (dx) to make the cannonball bounce back.
      ball.x = 580 - ball.radius;
      ball.dx *= -1; // Reverse the horizontal velocity.
    } else if (ball.x - ball.radius < 20) {
      // Left wall collision (similar logic as for the right wall):
      ball.x = 20 + ball.radius;
      ball.dx *= -1;
    } else if (ball.y + ball.radius > 580) {
      // Bottom wall collision:
      // - Set the Y-coordinate of the cannonball to prevent it from going below the floor.
      // - Reverse the vertical velocity (dy) to make the cannonball bounce back up.
      ball.y = 580 - ball.radius;
      ball.dy *= -1; // Reverse the vertical velocity.
    } else if (ball.y - ball.radius < 20) {
      // Top wall collision (similar logic as for the bottom wall):
      ball.y = 20 + ball.radius;
      ball.dy *= -1;
    }

    // Record the current collision time (timeDiff1) for future collision time calculations.
    ball.timeDiff1 = new Date();
  }

  // The result is that when the cannonball collides with any canvas wall,
  // it triggers collision handling logic, including audio playback,
  // elasticity application, and direction changes based on the specific collision.
}

function collide(index) {
  let ball = cannonBalls[index];
  for (let j = index + 1; j < cannonBalls.length; j++) {
    let testBall = cannonBalls[j];
    if (ballHitBall(ball, testBall)) {
      collideBalls(ball, testBall);
    }
  }
}

/* 
A new function is added to detect collisions between balls, which calculates the distance vector and relative velocity of the collided balls.
• The new function is called after the border collision section but before the cannonballs are drawn.
• The distance vector between the centers of the two collided balls is calculated using Pythagoras theorem.
• The distance vector is transformed into a normalized vector to get the angle of collision.
• The relative velocity of the second ball from the perspective of the first ball is calculated.*/
function ballHitBall(ball1, ball2) {
  let collision = false;
  let dx = ball1.x - ball2.x;
  let dy = ball1.y - ball2.y;
  // Compare the squared distance with the squared sum of radii to check for collision
  let distance = dx * dx + dy * dy;
  if (
    distance <=
    (ball1.radius + ball2.radius) * (ball1.radius + ball2.radius)
  ) {
    collision = true;
  }
  return collision;
}

function collideBalls(ball1, ball2) {
  // It matters that we are getting the exact distance between ball1 and ball2
  let dx = ball2.x - ball1.x;
  let dy = ball2.y - ball1.y;
  let distance = Math.sqrt(dx * dx + dy * dy);
  // Work out the normalized collision vector (direction only)
  let vCollisionNorm = { x: dx / distance, y: dy / distance };
  // Relative velocity of ball
  let vRelativeVelocity = { x: ball1.dx - ball2.dx, y: ball1.dy - ball2.dy };
  // Calculate Dot product
  let speed =
    vRelativeVelocity.x * vCollisionNorm.x +
    vRelativeVelocity.y * vCollisionNorm.y;
  // Don't do anything because balls are already moving out of each other's way
  if (speed < 0) return;
  let impulse = (2 * speed) / (ball1.mass + ball2.mass);
  // Because we calculate the relative velocity of ball2, Ball needs to go in the opposite direction, hence a collision will occur
  ball1.dx -= impulse * ball2.mass * vCollisionNorm.x;
  ball1.dy -= impulse * ball2.mass * vCollisionNorm.y;
  ball2.dx += impulse * ball1.mass * vCollisionNorm.x;
  ball2.dy += impulse * ball1.mass * vCollisionNorm.y;
  // Still have to account for elasticity
  ball1.dx *= ball1.elasticity;
  ball1.dy *= ball1.elasticity;
  ball2.dx *= ball2.elasticity;
  ball2.dy *= ball2.elasticity;
}

//-------------Animation Loop:------------------//

//This is the main animation loop that repeatedly clears the canvas, draws the border, rotates and draws the cannon, moves and draws cannonballs, and handles ball-wall collisions. It uses the requestAnimationFrame method for smooth animation.
// Function for animating the game
//##########################################################[3]########################################################
function animate() {
  // Request the next animation frame, creating a loop for smooth animation
  //########################################################[4]########################################################
  requestAnimationFrame(animate);
  //########################################################[5]########################################################
  // Clear the entire canvas to prepare for the next frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //########################################################[6]########################################################
  // Draw the border on the canvas
  drawBorder();

  // Draw the cannon on the canvas
  //########################################################[12]#######################################################
  cannon.draw();

  // Iterate through each cannonball in the cannonBalls array
  //########################################################[27]########################################################
  cannonBalls.forEach((ball, index) => {
    // Move the cannonball to update its position
    ball.move();

    // Check if the cannonball has collided with the canvas walls and handle the collision
    ballHitWall(ball);

    collide(index);

    // Draw the cannonball on the canvas
    ball.draw();
  });
}

//----------------Mouse Movement Event Listener (Moving):-----------------//

//This event listener tracks the mouse movement and updates the mousePos variable with the current mouse coordinates relative to the canvas.
// Event listener for tracking mouse movement within the canvas
//########################################################[15]########################################################
canvas.addEventListener("mousemove", (e) => {
  // Extract and store the current mouse position relative to the canvas

  // Calculate the X-coordinate of the mouse position relative to the canvas
  const mouseX = e.clientX - canvas.offsetLeft;

  // Calculate the Y-coordinate of the mouse position relative to the canvas
  const mouseY = e.clientY - canvas.offsetTop;

  // Create an object to store the current mouse position
  // - 'x' property stores the X-coordinate
  // - 'y' property stores the Y-coordinate
  const mousePosition = {
    x: mouseX,
    y: mouseY,
  };

  // Update the 'mousePos' variable with the current mouse position
  mousePos = mousePosition;
});

//----------------Mouse Click Event Listener (Shooting):----------------//

//This event listener responds to a mouse click. If conditions are met (angle within a range and canShoot is true), it calculates the position for a new cannonball, adds it to the cannonBalls array, plays a shooting sound, and sets a timeout to allow shooting again after one second.
// Event listener for handling mouse clicks (cannon shooting)
//########################################################[21]########################################################
canvas.addEventListener("click", (e) => {
  // Check if the cannon is allowed to shoot (controlled by 'canShoot' variable)
  if (!canShoot) return;

  // Prevent further shooting until the cooldown period is over
  canShoot = false;

  // Calculate the initial position of the cannonball when it's shot
  // - 'ballPos' stores the initial position calculated using 'sortBallPos'
  let ballPos = sortBallPos(cannon.topX + 100, cannon.topY + 30);

  // Create a new cannonball object and add it to the 'cannonBalls' array
  //########################################################[26]########################################################
  cannonBalls.push(new CannonBall(angle, ballPos.x, ballPos.y));

  // Set the current time of the cannon firing sound to a specific position
  cannonSfx.currentTime = 0.2;

  // Play the cannon firing sound effect
  cannonSfx.play();

  // Allow the cannon to shoot again after a cooldown period of one second
  setTimeout(() => {
    canShoot = true;
  }, 500);
});

//----------------Starting the Animation:-----------------//

//Finally, the animation loop is started to initiate the game animation.
animate();
