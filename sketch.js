let serial;
let latestData = "waiting for data";
let player1;
let player2;
let backgroundImage;
let buttonbackgroundImage;

// Variables for jumping
let isJumping1 = false;
let jumpVelocity1 = 0;
let gravity1 = 0.5;

let isJumping2 = false;
let jumpVelocity2 = 0;
let gravity2 = 0.5;

// Projectile variables for player 2
let projectiles = [];
let projectileSpeed = 5;

// Timer variables for delaying animations
let punchTimer1 = 0;
let kickTimer1 = 0;
let jumpTimer1 = 0;

let punchTimer2 = 0;
let kickTimer2 = 0;
let jumpTimer2 = 0;

// Duration and delay for each animation
let punchAnimationDuration = 50;
let kickAnimationDuration = 50;
let jumpAnimationDuration = 50;

// Delay for each animation
let punchDelay = 50;
let kickDelay = 50;
let jumpDelay = 50;

// Health-related variables
let maxHealth = 100;
let health1 = maxHealth;
let health2 = maxHealth;

let leftKeyPressed = false;
let rightKeyPressed = false;
let upKeyPressed = false; // Added variable for up key
let downKeyPressed = false; // Added variable for down key

// Ground level
let ground;

let currentScreen = "game"; // Default screen is the game
let buttonSize = 50;
let buttonExpanded = false;
let buttonExpansion = 0;

function preload() {
  backgroundImage = loadImage("background_main.png");
  buttonbackgroundImage = loadImage("buttonbackground_Image.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize the serial port
  serial = new p5.SerialPort();
  serial.list();
  serial.open('/dev/tty.usbmodem101');
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);

  // Initialize player 1
  player1 = createSprite(50, height / 2); // Start on the left side
  player1.addAnimation('walking', 'move1_new.png', 'move2_new.png', 'move3_new.png', 'move4_new.png', 'move5_new.png', 'move6_new.png', 'move7_new.png');
  player1.addAnimation('jumping', 'before_jump.png', 'jumping.png');
  player1.addAnimation('punching', 'ready_punch.png', 'punch.png');
  player1.addAnimation('kicking', 'past_kick.png', 'middle_kick.png', 'final_kick.png');
  player1.animation.frameDelay = 10;

  // Initialize player 2
  player2 = createSprite(width - 100, height / 2); // Start on the right side
  player2.addAnimation('walking', 'opps_one_new.png', 'opps_two_new.png', 'opps_three_new.png', 'opps_four_new.png', 'opps_five_new.png', 'opps_six_new.png');
  player2.addAnimation('jumping_opps', 'opps_jumping_one.png', 'opps_jumping_two.png', 'opps_jump_3_main.png');
  player2.animation.frameDelay = 10;

  // Set the ground level
  ground = height - 300; // Adjust the value as needed
}

function serverConnected() {
  console.log("Connected to Server");
}

function gotList(thelist) {
  console.log("List of Serial Ports:");
  for (let i = 0; i < thelist.length; i++) {
    console.log(i + " " + thelist[i]);
  }
}

function gotOpen() {
  console.log("Serial Port is Open");
}

function gotClose() {
  console.log("Serial Port is Closed");
  latestData = "Serial Port is Closed";
}

function gotError(theerror) {
  console.log(theerror);
}

function gotData() {
  let currentString = serial.readLine();
  trim(currentString);
  if (!currentString) return;
  console.log(currentString);
  latestData = currentString;
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    leftKeyPressed = true;
  } else if (keyCode === RIGHT_ARROW) {
    rightKeyPressed = true;
  } else if (keyCode === UP_ARROW) {
    upKeyPressed = true;
    // Check if player 2 is not already jumping
    if (!isJumping2 && jumpTimer2 <= 0) {
      isJumping2 = true;
      jumpVelocity2 = -20;
      player2.changeAnimation('jumping_opps');
      jumpTimer2 = jumpAnimationDuration + jumpDelay;
    }
  } else if (keyCode === DOWN_ARROW) {
    downKeyPressed = true;
    // Create a projectile when the down key is pressed
    let newProjectile = createSprite(player2.position.x, player2.position.y, 10, 10);
    newProjectile.visible = false; // Initially invisible
    projectiles.push(newProjectile);
  } else if (keyCode === 66) { // ASCII code for 'b'
    // Check if 'b' key is pressed for switching screens
    if (currentScreen === "game") {
      currentScreen = "info"; // Switch to the info screen
    } else if (currentScreen === "info") {
      currentScreen = "game"; // Switch back to the game screen
    }
  } else if (keyCode === 87) { // ASCII code for 'w'
    // Check if 'w' key is pressed for button expansion
    if (currentScreen === "game") {
      buttonExpanded = true;
    }
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    leftKeyPressed = false;
  } else if (keyCode === RIGHT_ARROW) {
    rightKeyPressed = false;
  } else if (keyCode === UP_ARROW) {
    upKeyPressed = false;
  } else if (keyCode === DOWN_ARROW) {
    downKeyPressed = false;
    // Hide all projectiles when the down key is released
    for (let i = 0; i < projectiles.length; i++) {
      projectiles[i].visible = false;
    }
  } else if (keyCode === 87) { // ASCII code for 'w'
    // Check if 'w' key is released for button contraction
    if (currentScreen === "game") {
      buttonExpanded = false;
    }
  }
}

function draw() {
  background(backgroundImage);
  fill(0, 0, 0);
  text(latestData, 100, 10);

  // Draw the ground
  fill(100);
  rect(0, ground, width, height - ground);

  // Update health bars
  fill(255, 0, 0);
  rect(10, 10, maxHealth * 2, 20);
  fill(0, 255, 0);
  rect(10, 10, health1 * 2, 20);

  fill(255, 0, 0);
  rect(width - maxHealth * 2 - 10, 10, maxHealth * 2, 20);
  fill(0, 255, 0);
  rect(width - health2 * 2 - 10, 10, health2 * 2, 20);

  // Draw the expandable button
  fill(150);
  ellipse(width - buttonSize / 2, height - buttonSize / 2, buttonSize + buttonExpansion);

  // Draw the info screen if expanded
  if (buttonExpanded && currentScreen === "game") {
    fill(200); // Change color or add an image for the info screen
    rect(0, 0, width, height);
    fill(0);
    textSize(24);
    
    image(buttonbackgroundImage, 0, 0, width, height);

    textAlign(CENTER, CENTER);
    text("Information Screen", width / 2, height / 2 - 50);
    text("Some text here...", width / 2, height / 2);
  }

  // Check for different animations based on the received data for player 1
  if (latestData == 'COMMAND LEFT') {
    player1.position.x -= 5;
    player1.position.x = max(player1.position.x, player1.width / 2);
  } else if (latestData == 'COMMAND RIGHT') {
    player1.position.x += 5;
    player1.position.x = min(player1.position.x, width - player1.width / 2);
  } else if (latestData == 'COMMAND UP' && !isJumping1 && jumpTimer1 <= 0) {
    isJumping1 = true;
    jumpVelocity1 = -20;
    player1.changeAnimation('jumping');
    jumpTimer1 = jumpAnimationDuration + jumpDelay;
  } else if (latestData == 4) {
    player1.changeAnimation('punching');
    punchTimer1 = punchAnimationDuration + punchDelay;
    health2 -= 5; // Decrease health for player 2 when player 1 punches
    health2 = constrain(health2, 0, maxHealth);
  } else if (latestData == 1) {
    player1.changeAnimation('kicking');
    kickTimer1 = kickAnimationDuration + kickDelay;
    health2 -= 5; // Decrease health for player 2 when player 1 kicks
    health2 = constrain(health2, 0, maxHealth);
  } else {
    player1.changeAnimation('walking');
  }

  // Handle timers for player 1
  if (jumpTimer1 > 0) {
    jumpTimer1--;
  }
  if (punchTimer1 > 0) {
    punchTimer1--;
  }
  if (kickTimer1 > 0) {
    kickTimer1--;
  }

  // Handle jumping for player 1
  if (isJumping1) {
    player1.position.y += jumpVelocity1;
    jumpVelocity1 += gravity1;

    // Check if player 1 is below the ground
    if (player1.position.y > ground - player1.height / 2) {
      player1.position.y = ground - player1.height / 2;
      isJumping1 = false;
      player1.changeAnimation('walking');
      jumpVelocity1 = 0;
    }
  }
  player1.position.y = min(player1.position.y, ground - player1.height / 2);

  // Handle player 2 movement
  if (leftKeyPressed) {
    player2.position.x -= 5;
    player2.position.x = max(player2.position.x, player2.width / 2);
  } else if (rightKeyPressed) {
    player2.position.x += 5;
    player2.position.x = min(player2.position.x, width - player2.width / 2);
  } else if (downKeyPressed) {
    // Move all projectiles towards player 1 when the down key is pressed
    for (let i = 0; i < projectiles.length; i++) {
      let direction = createVector(player1.position.x - projectiles[i].position.x, player1.position.y - projectiles[i].position.y);
      direction.normalize();
      projectiles[i].position.x += direction.x * projectileSpeed;
      projectiles[i].position.y += direction.y * projectileSpeed;

      // Check for collisions with player 1
      if (projectiles[i].overlap(player1)) {
        projectiles[i].remove(); // Remove projectile
        health1 -= 1; // Decrease health for player 1 when hit by a projectile
        health1 = constrain(health1, 0, maxHealth);
      }
    }
  } else if (upKeyPressed && !isJumping2 && jumpTimer2 <= 0) {
    isJumping2 = true;
    jumpVelocity2 = -20;
    player2.changeAnimation('jumping_opps');
    jumpTimer2 = jumpAnimationDuration + jumpDelay;
  } else {
    player2.changeAnimation('walking');
  }

  // Handle timers for player 2
  if (jumpTimer2 > 0) {
    jumpTimer2--;
  }
  if (punchTimer2 > 0) {
    punchTimer2--;
  }
  if (kickTimer2 > 0) {
    kickTimer2--;
  }

  // Handle jumping for player 2
  if (isJumping2) {
    player2.position.y += jumpVelocity2;
    jumpVelocity2 += gravity2;

    // Check if player 2 is below the ground
    if (player2.position.y >= ground - player2.height / 2) {
      player2.position.y = ground - player2.height / 2;
      isJumping2 = false;
      player2.changeAnimation('walking');
      jumpVelocity2 = 0;
    }
  }
  player2.position.y = min(player2.position.y, ground - player2.height / 2);

  // Draw all projectiles
  for (let i = 0; i < projectiles.length; i++) {
    drawSprite(projectiles[i]);
  }

  // Check if player 1 has won
  if (health1 <= 0) {
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Player 2 has won!", width / 2, height / 2);
    noLoop(); // Stop the draw loop
  }

  // Check if player 2 has won
  if (health2 <= 0) {
    fill(0, 255, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Player 1 has won!", width / 2, height / 2 - 200);
    noLoop(); // Stop the draw loop
  }
  drawSprites();
}
