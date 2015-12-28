function HerculesDJCCompact () {}

//based on Hercules Mk4 scripts from Dj Kork


// Number of the standard RPM value. Lower values increase de sensitivity as the really records.
HerculesDJCCompact.standardRpm = 33.33;

// The HerculesDJCCompact.alpha value for the filter (start with 1/8 (0.125) and tune from there)
HerculesDJCCompact.alpha = 1/8;

// The HerculesDJCCompact.beta value for the filter (start with HerculesDJCCompact.alpha/32 and tune from there)
HerculesDJCCompact.beta = HerculesDJCCompact.alpha/20;

HerculesDJCCompact.scratchButton = 0;
HerculesDJCCompact.scratchMode =[0,0];
HerculesDJCCompact.antiguoMixCue=1;
HerculesDJCCompact.sensivityPitch=[5,5];
HerculesDJCCompact.jogFastPosition=[0,0];

HerculesDJCCompact.LEDOff = 0x00;
HerculesDJCCompact.LEDOn = 0x7F;
HerculesDJCCompact.LEDOff = 0x00;
HerculesDJCCompact.AllLED = "Bx7F";

//all controls 9x01 - 9x56


HerculesDJCCompact.init = function (id) {
	// Switch off all LEDs
	for (var i=1; i<95; i++) midi.sendShortMsg(0x90, i, 0x00);

	var alpha = 1.0/8;
    var beta = alpha/32;
    engine.scratchEnable(1, 128, 33+1/3, alpha, beta);
    //engine.scratchEnable(2, 128, 33+1/3, alpha, beta);
};

HerculesDJCCompact.shutdown = function (id) {
	// Switch off all LEDs
	for (var i=1; i<95; i++) midi.sendShortMsg(0x90, i, 0x00);
	engine.scratchDisable(1);
	engine.scratchDisable(2);
};

// The wheel that actually controls the scratching
HerculesDJCCompact.wheelTurn = function (channel, control, value, status) {
    // See if we're scratching. If not, skip this.
    if (!engine.isScratching(1)) return;

    var newValue;
    if (value-64 > 0) newValue = value-128;
    else newValue = value;

    // In either case, register the movement
    engine.scratchTick(1,newValue);
}