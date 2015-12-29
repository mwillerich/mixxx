function HerculesDJCCompact () {}

//based on Hercules Mk4 scripts from Dj Kork

// Number of the standard RPM value. Lower values increase de sensitivity as the really records.
HerculesDJCCompact.standardRpm = 33.33;

// The HerculesDJCCompact.alpha value for the filter (start with 1/8 (0.125) and tune from there)
HerculesDJCCompact.alpha = 1/8;

// The HerculesDJCCompact.beta value for the filter (start with HerculesDJCCompact.alpha/32 and tune from there)
HerculesDJCCompact.beta = HerculesDJCCompact.alpha/20;

HerculesDJCCompact.LEDOff = 0x00;
HerculesDJCCompact.LEDOn = 0x7F;
HerculesDJCCompact.LEDOff = 0x00;
HerculesDJCCompact.AllLED = "Bx7F";

HerculesDJCCompact.timerID; //timer 
HerculesDJCCompact.scratchTimeout = 1000; //in ms
//all controls 9x01 - 9x56 (1 to 86)


HerculesDJCCompact.init = function (id) {
    // Switch off all LEDs
    for (var i=1; i<95; i++) midi.sendShortMsg(0x90, i, 0x00);

    var alpha = 1.0/8;
    var beta = alpha/32;
};

HerculesDJCCompact.shutdown = function (id) {
    // Switch off all LEDs
    for (var i=1; i<95; i++) midi.sendShortMsg(0x90, i, 0x00);
};

// The wheel that actually controls the scratching
HerculesDJCCompact.wheelTurn = function (channel, control, value, status, group) {
    print(group);
    if (!engine.isScratching(1)) {
        engine.scratchEnable(
            1,
            128,
            HerculesDJCCompact.standardRpm,
            HerculesDJCCompact.alpha,
            HerculesDJCCompact.beta
        );
        return;
    }

    var newValue;
    if (value-64 > 0) newValue = value-128;
    else newValue = value;

    // In either case, register the movement
    engine.scratchTick(1,newValue);

    engine.stopTimer(HerculesDJCCompact.timerID);
    HerculesDJCCompact.timerID = engine.beginTimer(
        HerculesDJCCompact.scratchTimeout, 
        "HerculesDJCCompact.scratchDisable(1)", 
        true
    );
}

HerculesDJCCompact.scratchDisable = function (deck) {
    engine.scratchDisable(deck);
}

HerculesDJCCompact.deck=function(group){
    var deck = /^[Channel(\d+)]$/.exec(group);
    return (deck && deck[1]) ? deck[1] : 0;
}