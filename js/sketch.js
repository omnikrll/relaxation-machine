// dom elements
var textArea = document.getElementById('text-area'),
	rateSlider = document.getElementById('rate-slider');

// sphere rotation params
var angle = 0,
	speed = rateSlider.value,
	direction = 1;

// audio params
var synth = {
		loaded: false,
		sample: null,
		delay: null
	},
	rhodes = {
		loaded: false,
		sample: null,
		delay: null
	},
	oscs = { l: null, r: null },
	noise = { l: null, r: null },
	filters = { l: null, r: null},
	playback = true;

function setup() {
	colorMode(RGB, 255);
	var canvas = createCanvas(640, 480, WEBGL);
	canvas.parent('canvas-parent');

	synth.sample = loadSound('audio/synth.mp3', synthReady);
	rhodes.sample = loadSound('audio/rhodes.mp3', rhodesReady);

	// fsButton = createButton('toggle fullscreen');
	// fsButton.parent('fullscreen');
	// fsButton.mousePressed(toggleFullscreen);

	startAudio();
}

function synthReady() {
	synth.loaded = true;

	synth.sample.loop();
	synth.sample.pan(-0.4);
	synth.sample.setVolume(0.1)

	synth.delay = new p5.Delay();
	synth.delay.setType('pingPong');
	synth.delay.process(synth.sample, .624, .6, 1950);
}

function rhodesReady() {
	rhodes.loaded = true;

	rhodes.sample.loop();
	rhodes.sample.pan(0.4);
	rhodes.sample.setVolume(0.17);

	rhodes.delay = new p5.Delay();
	rhodes.delay.setType('pingPong');
	rhodes.delay.process(rhodes.sample, .48, .4, 1440);
}

// function toggleFullscreen() {
// 	var fs = fullscreen();
// 	fullscreen(!fs);
// }

function startAudio() {
	oscs.l = new p5.Oscillator();
	oscs.l.setType('sine');
	oscs.l.start();
	oscs.l.freq(84);
	oscs.l.pan(-1);
	oscs.l.amp(0.2);

	oscs.r = new p5.Oscillator();
	oscs.r.setType('sine');
	oscs.r.start();
	oscs.r.freq(92);
	oscs.r.pan(1);
	oscs.r.amp(0.2);

	filters.l = new p5.BandPass();
	filters.l.freq(358);
	filters.l.res(28);

	filters.r = new p5.BandPass();
	filters.r.freq(362);
	filters.r.res(28);

	noise.l = new p5.Noise();
	noise.l.disconnect();
	noise.l.connect(filters.l);
	noise.l.start();
	noise.l.pan(-0.7);
	noise.l.amp(0.7);

	noise.r = new p5.Noise();
	noise.r.disconnect();
	noise.r.connect(filters.r);
	noise.r.start();
	noise.r.pan(0.7);
	noise.r.amp(0.7);
}

function draw() {
	ambientLight(100);
	pointLight(200, 200, 200, 120, 240, 0);

	if (playback) {
		speed = rateSlider.value;

		var sine = sin(angle),
			cosine = cos(angle),
			x = sine * 240,
			y = cosine * 64, 
			size_a = 56 + cosine * 32,
			size_b = 56 - cosine * 32,
			res_l = 14 - sine * 11,
			res_r = 14 + sine * 11;

		angle += speed * direction;

		if (abs(ceil(sine)) == 0) {
			textArea.innerHTML = 'exhale';
		} else if (abs(ceil(sine)) == 1) {
			textArea.innerHTML = 'inhale';
		}

		filters.l.res(res_l);
		filters.r.res(res_r);

		translate(x, y, 0);
		push();
		ambientMaterial(250);
		sphere(size_a);
		pop();

		x *= -2;
		y *= -2;

		translate(x, y, 0);
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

			oscs.l.amp(0);
			oscs.r.amp(0);

			noise.l.amp(0);
			noise.r.amp(0);

			if (synth.loaded) synth.sample.setVolume(0);
			if (rhodes.loaded) rhodes.sample.setVolume(0);
		} else {
			playback = true;

			oscs.l.amp(0.2);
			oscs.r.amp(0.2);

			noise.l.amp(0.7);
			noise.r.amp(0.7);

			if (synth.loaded) synth.sample.setVolume(0.1);
			if (rhodes.loaded) rhodes.sample.setVolume(0.1);
		}
	}
}