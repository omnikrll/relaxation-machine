// dom elements
var textArea = document.getElementById('text-area'),
	rateSlider = document.getElementById('rate-slider');

// sphere rotation params
var angle = 0,
	speed = rateSlider.value,
	direction = 1;

// audio params
var samples = { l: null, r: null },
	oscs = { l: null, r: null },
	playback = true;

function preload() {
	samples.l = loadSound('audio/audio_left.mp3');
	samples.r = loadSound('audio/audio_right.mp3');
}

function setup() {
	colorMode(RGB, 255);
	var canvas = createCanvas(640, 480, WEBGL);
	canvas.parent('canvas-parent');

	fsButton = createButton('toggle fullscreen');
	fsButton.parent('fullscreen');
	fsButton.mousePressed(toggleFullscreen);

	startAudio();
	console.log(textArea.innerHTML);
}

function toggleFullscreen() {
	var fs = fullscreen();
	fullscreen(!fs);
}

function startAudio() {
	samples.l.loop();
	samples.l.pan(-0.4);
	samples.l.setVolume(0.1)

	samples.r.loop();
	samples.r.pan(0.4);
	samples.r.setVolume(0.1);

	oscs.l = new p5.Oscillator();
	oscs.l.setType('sine');
	oscs.l.start();
	oscs.l.freq(60);
	oscs.l.pan(-1);
	oscs.l.amp(0.2);

	oscs.r = new p5.Oscillator();
	oscs.r.setType('sine');
	oscs.r.start();
	oscs.r.freq(68);
	oscs.r.pan(1);
	oscs.r.amp(0.2);
}

function draw() {
	ambientLight(100);
	pointLight(200, 200, 200, 120, 240, 0);

	if (playback) {
		speed = rateSlider.value;

		var sine = sin(angle),
			cosine = cos(angle),
			x = sine * 200,
			y = cosine * 64, 
			size_a = 56 + cosine * 32,
			size_b = 56 + cosine * -32;

		angle += speed * direction;

		if (abs(ceil(sine)) == 0) {
			textArea.innerHTML = 'exhale';
		} else if (abs(ceil(sine)) == 1) {
			textArea.innerHTML = 'inhale';
		}

		translate(x, y, 0);
		push();
		ambientMaterial(250);
		sphere(size_a);
		pop();

		translate((-x * 2), (-y * 2), 0);
		push();
		ambientMaterial(250);
		sphere(size_b);
		pop();
	}
}

function keyPressed() {
	if (keyCode == LEFT_ARROW) {
		direction = -1;
	}

	if (keyCode == RIGHT_ARROW) {
		direction = 1;
	}

	if (key == ' ') {
		if (playback) { 
			playback = false;
			samples.l.setVolume(0.0);
			samples.r.setVolume(0.0);
			oscs.l.amp(0);
			oscs.r.amp(0);
		} else {
			playback = true;
			samples.l.setVolume(0.1);
			samples.r.setVolume(0.1);
			oscs.l.amp(0.2);
			oscs.r.amp(0.2);
		}
	}
}