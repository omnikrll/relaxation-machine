var audio_left,
	audio_right,
	sphere_left,
	sphere_right;

function setup() {
	createCanvas(800, 600, WEBGL);
	audio_left = loadSound('audio/audio_left.wav', startAudioLeft);
	audio_right = loadSound('audio/audio_right.wav', startAudioRight);	
}

function startAudioLeft(audio_left) {
	audio_left.loop();
	audio_left.pan(-0.4);
	// audio_left.setVolume(0);
	// audio_left.setVolume(1,3);
	// audio_left.play();
}

function startAudioRight(audio_right) {
	audio_right.loop();
	audio_right.pan(0.4);
	// audio_right.setVolume(0);
	// audio_right.setVolume(1,3);
	// audio_right.play();
}

var xpos = -100,
	ypos = 0,
	xspeed = 1.5,
	yspeed = 0.75;

function draw() {
	if (xpos > 100 || xpos < -300) {
		xspeed *= -1;
		console.log('x:', xpos, xspeed);
	}

	if (ypos > 30 || ypos < -60) {
		yspeed *= -1;
		console.log('y:', ypos, yspeed);
	}

	if (keyIsDown(LEFT_ARROW)) {
		xpos += xspeed;
		ypos += yspeed;
	}

	if (keyIsDown(RIGHT_ARROW)) {
		xpos -= xspeed;
		ypos -= yspeed;
	}

	translate(xpos, ypos, 1);
	push();
	// rotateZ(frameCount * 0.01);
	// rotateX(frameCount * 0.01);
	// rotateY(frameCount * 0.01);
	sphere(80);
	pop();

	translate((-xpos - 80), (-ypos), -1);
	push();
	// rotateZ(frameCount * 0.01);
	// rotateX(frameCount * 0.01);
	// rotateY(frameCount * 0.01);
	sphere(40);
	pop();
}

function keyPressed() {
	// if (keyCode == LEFT_ARROW) {
	// 	if (audio_right.isPlaying()) audio_right.stop();
	// 	if (!audio_left.isPlaying()) audio_left.play();
	// } else if (keyCode == RIGHT_ARROW) {
	// 	if (audio_left.isPlaying()) audio_left.stop();
	// 	if (!audio_right.isPlaying()) audio_right.play();
	// } else 
	if (keyCode == DOWN_ARROW) {
		if (audio_left.isPlaying()) audio_left.stop();
		if (audio_right.isPlaying()) audio_right.stop();
	}
}