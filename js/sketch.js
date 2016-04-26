// audio params
var samples = { l: null, r: null },
	oscs = { l: null, r: null };

// sphere rotation params
var angle = 0,
	direction = 1;

var textArea = document.getElementById('text-area');

function preload() {
	samples.l = loadSound('audio/audio_left.wav');
	samples.r = loadSound('audio/audio_right.wav');
}

function setup() {
	var canvas = createCanvas((windowWidth), (windowHeight), WEBGL);
	canvas.parent('canvas-parent');
	startAudio();
	console.log(textArea.innerHTML);
}

function startAudio() {
	samples.l.loop();
	samples.l.pan(-0.4);
	samples.l.setVolume(0.1)

	samples.r.loop();
	samples.r.pan(-0.4);
	samples.r.setVolume(0.1);

	oscs.l = new p5.Oscillator();
	oscs.l.setType('sine');
	oscs.l.start();
	oscs.l.freq(56);
	oscs.l.pan(-1);
	oscs.l.amp(0.2);

	oscs.r = new p5.Oscillator();
	oscs.r.setType('sine');
	oscs.r.start();
	oscs.r.freq(66);
	oscs.r.pan(1);
	oscs.r.amp(0.2);
}


function draw() {
	var _sin = sin(angle),
		_cos = cos(angle),
		x = _sin * 200,
		y = _cos * 80,
		size_a = 50 + _cos * 30,
		size_b = 50 + _cos * -30;

	angle += 0.0175 * direction;

	translate(x, y, 1);
	push();
	sphere(size_a);
	pop();

	translate((-x *2), (-y * 2), -1);
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
		if (samples.l.isPlaying() && samples.r.isPlaying()) { 
			samples.l.stop();
			samples.r.stop();
			oscs.l.amp(0);
			oscs.r.amp(0);
		} else if (!samples.l.isPlaying() && !samples.r.isPlaying()) {
			samples.l.play();
			samples.r.play();
			oscs.l.amp(0.2);
			oscs.r.amp(0.2);
		}
	}
}