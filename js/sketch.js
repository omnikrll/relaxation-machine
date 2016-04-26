var audio_left,
	audio_right;

function preload() {
	audio_left = loadSound('audio/audio_left.wav');
	audio_right = loadSound('audio/audio_right.wav');
}

function setup() {
	createCanvas((windowWidth - 20), (windowHeight - 20), WEBGL);
	// startAudioLeft();
	// startAudioRight();
}

function startAudioLeft() {
	audio_left.loop();
	audio_left.pan(-0.4);
	audio_left.setVolume(0);
	audio_left.setVolume(1,3);
	// audio_left.play();
}

function startAudioRight() {
	audio_right.loop();
	audio_right.pan(0.4);
	audio_right.setVolume(0);
	audio_right.setVolume(1,3);
	// audio_right.play();
}

var angle = 0,
	direction = 1,
	breath = 'inhale';

function draw() {
	var sine = sin(angle),
		cosine = cos(angle),
		x = sine * 200,
		y = cosine * 80, 
		size_a = 50 + cosine * 30,
		size_b = 50 + cosine * -30;

	angle += 0.03 * direction;

	breath = floor(abs(angle) / 4) % 2 == 0 ? 'inhale' : 'exhale';

	translate(x, y, 0);
	push();
	sphere(size_a);
	pop();

	translate((-x * 2), (-y * 2), 0);
	push();
	sphere(size_b);
	pop();
}

function keyPressed() {
	if (keyCode == LEFT_ARROW) {
		direction = -1;
	} else if (keyCode == RIGHT_ARROW) {
		direction = 1;
	} else if (key == ' ') {
		if (audio_left.isPlaying() && audio_right.isPlaying()) { 
			audio_left.stop();
			audio_right.stop();
		} else if (!audio_left.isPlaying() && !audio_right.isPlaying()) {
			audio_left.play();
			audio_right.play();
		}
	}
}