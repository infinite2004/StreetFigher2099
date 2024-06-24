2D Fighting Game with Arduino Joystick Controller

This project is a 2D fighting game implemented using p5.js, with two players controlled via keyboard inputs and an Arduino-based joystick controller. The game includes animated characters, jumping mechanics, health management, and projectile attacks. One player is controlled via keyboard inputs, while the other uses an Arduino joystick controller to send movement commands via serial communication.

Technologies and Techniques

	•	p5.js: A JavaScript library for creative coding,used for rendering the game and handling animations.
	•	Arduino: An open-source electronics platform used to create the joystick controller.
	•	Serial Communication: Used to send commands from the Arduino to the p5.js game.
	•	Animation: Handled using p5.js sprite animations for player movements and actions.
	•	Collision Detection: Managed within p5.js for projectiles and player interactions.
	•	Health Management: Each player has a health bar that decreases when hit by punches, kicks, or projectiles.


 Please consider checking out the code on this website: https://editor.p5js.org/qureshi.abdul.227/sketches/xhbs3m_Np

 How to Run the Project

	1.	Set up the Arduino:
	•	Connect the joystick to the Arduino as per the pin definitions in the Arduino code.
	•	Connect buttons to digital pins 3 and 4 on the Arduino.
	•	Upload the provided Arduino code to the Arduino board.
 
	2.	Set up the p5.js environment:
	•	Install the p5.js library if you haven’t already.
	•	Create an HTML file and include the p5.js library.
	•	Copy the p5.js game code into a separate JavaScript file and link it to the HTML file.
 
	3.	Run the game:
	•	Connect the Arduino to your computer via USB.
	•	Open the p5.js sketch in your web browser.
 	•	Open p5.serialcontrol and check the port your USB is connected to
	•	Go to your Javascript code and find this "serial.open('/dev/tty.usbmodem101');"
	•	Now change the values after dev/tty.________ to what is listed in p5.serialcontrol
 	•	The game will now start with both players on screen.
	•	Player 1 will be controlled by the Arduino joystick.
	•	Player 2 will be controlled by the keyboard (arrow keys for movement, W for expanding the button, B for switching screens).

