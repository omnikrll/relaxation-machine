// dom elements
var textArea = document.getElementById('text-area'),
	rateSlider = document.getElementById('rate-slider'),
	buttonContainer = document.getElementById('start-button'),
	header = document.getElementById('header'),
	canvasParent = document.getElementById('canvas-parent'),
	startButton;

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
	sineTones = {
		l: { osc: null, env: null },
		r: { osc: null, env: null}
	},
	noiseGens = {
		l: { filter: null, osc: null, env: null },
		r: { filter: null, osc: null, env: null }
	};

// everything else
var playback = false;

function setup() {
	colorMode(RGB, 255);
	var canvas = createCanvas(640, 480, WEBGL);
	canvas.parent('canvas-parent');

	startButton = createButton('start');
	startButton.parent('start-button');
	startButton.mousePressed(startSketch);
}

function startSketch() {
	synth.sample = loadSound('audio/synth.mp3', synthReady);
	rhodes.sample = loadSound('audio/rhodes.mp3', rhodesReady);

	setupAudio();

	startButton.remove();
	buttonContainer.parentNode.removeChild(buttonContainer);

	header.style.display = 'none';
	rateSlider.style.display = 'inline';
	canvasParent.style.display = 'block';

	playback = true;
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

function setupAudio() {
	setSineToneL();
	setSineToneR();
	setNoiseL();
	setNoiseR();

	triggerOscsOn();
}

function setSineToneL() {
	sineTones.l.env = new p5.Env();
	sineTones.l.env.setADSR(2.0, 0, 0.2, 2.0);
	sineTones.l.env.setRange(0.2, 0)

	sineTones.l.osc = new p5.Oscillator();
	sineTones.l.osc.setType('sine');
	sineTones.l.osc.start();
	sineTones.l.osc.freq(86);
	sineTones.l.osc.pan(-1);
	sineTones.l.osc.amp(sineTones.l.env);
}

function setSineToneR() {
	sineTones.r.env = new p5.Env();
	sineTones.r.env.setADSR(2.0, 0, 0.2, 2.0);
	sineTones.r.env.setRange(0.2, 0)

	sineTones.r.osc = new p5.Oscillator();
	sineTones.r.osc.setType('sine');
	sineTones.r.osc.start();
	sineTones.r.osc.freq(92);
	sineTones.r.osc.pan(1);
	sineTones.r.osc.amp(sineTones.r.env);
}

function setNoiseL() {
	noiseGens.l.env = new p5.Env();
	noiseGens.l.env.setADSR(2.0, 0, 0.7, 2.0);
	noiseGens.l.env.setRange(0.7, 0)

	noiseGens.l.filter = new p5.BandPass();
	noiseGens.l.filter.freq(358);
	noiseGens.l.filter.res(28);

	noiseGens.l.osc = new p5.Noise();
	noiseGens.l.osc.disconnect();
	noiseGens.l.osc.connect(noiseGens.l.filter);
	noiseGens.l.osc.start();
	noiseGens.l.osc.pan(-0.8);
	noiseGens.l.osc.amp(noiseGens.l.env);
}

function setNoiseR() {
	noiseGens.r.env = new p5.Env();
	noiseGens.r.env.setADSR(2.0, 0, 0.7, 2.0);
	noiseGens.r.env.setRange(0.7, 0)

	noiseGens.r.filter = new p5.BandPass();
	noiseGens.r.filter.freq(362);
	noiseGens.r.filter.res(28);

	noiseGens.r.osc = new p5.Noise();
	noiseGens.r.osc.disconnect();
	noiseGens.r.osc.connect(noiseGens.r.filter);
	noiseGens.r.osc.start();
	noiseGens.r.osc.pan(0.8);
	noiseGens.r.osc.amp(noiseGens.r.env);
}

function triggerOscsOn() {
	sineTones.l.env.triggerAttack();
	sineTones.r.env.triggerAttack();
	noiseGens.l.env.triggerAttack();
	noiseGens.r.env.triggerAttack();
}

function triggerOscsOff() {
	sineTones.l.env.triggerRelease();
	sineTones.r.env.triggerRelease();
	noiseGens.l.env.triggerRelease();
	noiseGens.r.env.triggerRelease();
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

		noiseGens.l.filter.res(res_l);
		noiseGens.r.filter.res(res_r);

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

			triggerOscsOff();

			if (synth.loaded) synth.sample.setVolume(0);
			if (rhodes.loaded) rhodes.sample.setVolume(0);
		} else {
			playback = true;

			triggerOscsOn();

			if (synth.loaded) synth.sample.setVolume(0.1);
			if (rhodes.loaded) rhodes.sample.setVolume(0.1);
		}
	}
}