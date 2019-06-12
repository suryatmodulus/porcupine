let VoiceControlDemo = (function(){
    let keywordIDs = {
        'ok lamp': new Uint8Array([
              0xbc, 0x7f, 0x9a, 0x76, 0x6d, 0xfd, 0x31, 0x6c, 0xfe, 0xe0, 0xb1, 0x45,
              0x5a, 0xee, 0x0a, 0x5b, 0x26, 0x8b, 0x4b, 0x95, 0x51, 0x4e, 0xd5, 0x83,
              0x87, 0x1c, 0xa7, 0xc5, 0xdf, 0xa2, 0x61, 0xaf, 0x2e, 0xa8, 0x20, 0xe3,
              0x5e, 0x0a, 0x83, 0x6c, 0xec, 0xa3, 0x24, 0xec, 0x59, 0xa9, 0xd9, 0x35,
              0xbe, 0xb8, 0x2c, 0x85, 0xa6, 0x6e, 0xce, 0xfc, 0x40, 0x67, 0x52, 0x20,
              0x14, 0x15, 0x04, 0x38, 0xa0, 0x54, 0x48, 0xd0, 0x84, 0xbd, 0x0b, 0x10,
              0x91, 0xb0, 0x24, 0xb3, 0x88, 0xba, 0x9f, 0x09, 0x01, 0xd4, 0x17, 0x84
            ]),
        'yellow': new Uint8Array([
              0x77, 0xfb, 0x8a, 0x2b, 0xdd, 0x98, 0x55, 0x75, 0xbf, 0x66, 0xc0, 0x35,
              0x6d, 0x65, 0xb0, 0x78, 0xec, 0xab, 0x2d, 0xcc, 0x30, 0xfc, 0x44, 0xa3,
              0x87, 0x94, 0xfa, 0xd7, 0xef, 0x6e, 0x80, 0xd4, 0x03, 0xb1, 0xb5, 0x91,
              0x76, 0xfa, 0x3f, 0x76, 0xb6, 0x22, 0x93, 0xc7, 0x21, 0x20, 0xed, 0xc6,
              0x55, 0x18, 0x2d, 0x6a, 0x24, 0x52, 0xa3, 0x80, 0xf7, 0x3e, 0x5b, 0xa3,
              0x0a, 0xc0, 0x53, 0x9b, 0x23, 0x6c, 0x89, 0xce
              ]),
        'orange': new Uint8Array([
              0x4a, 0x57, 0xb4, 0xad, 0xb7, 0xec, 0x7a, 0x46, 0x0a, 0xa8, 0xed, 0x17,
              0x58, 0x18, 0xd1, 0xae, 0xc2, 0x3f, 0x87, 0x42, 0x9d, 0x43, 0x73, 0x61,
              0xb4, 0x59, 0x0b, 0xff, 0x01, 0x07, 0xb7, 0xe5, 0x29, 0x32, 0x90, 0x91,
              0x7f, 0xad, 0x57, 0xc5, 0xd6, 0xb8, 0xe4, 0x87, 0xd3, 0xa6, 0x3d, 0xe9,
              0x75, 0x16, 0x6f, 0x02, 0xe1, 0xdc, 0x92, 0x23, 0x0b, 0xc8, 0xf0, 0x30,
              0x99, 0x08, 0x64, 0xbf, 0x54, 0x30, 0xf5, 0x5c, 0x11, 0xd6, 0xc6, 0x98
              ]),
        'purple': new Uint8Array([
              0xf8, 0x78, 0xef, 0xb6, 0x7f, 0x00, 0x57, 0x00, 0x0c, 0x01, 0x3b, 0x1a,
              0x67, 0x95, 0x9c, 0x72, 0xd8, 0x3e, 0x65, 0xa4, 0x02, 0x8f, 0xf5, 0x87,
              0x5a, 0x41, 0x32, 0x20, 0xaf, 0xe6, 0x89, 0xc7, 0x1a, 0xbd, 0x30, 0x35,
              0x5d, 0x49, 0xf3, 0x7d, 0xc4, 0x54, 0x67, 0x54, 0x98, 0x1a, 0xc9, 0x8a,
              0x09, 0x48, 0x2f, 0xc2, 0xbe, 0xd2, 0xd8, 0x2b, 0xee, 0x72, 0x93, 0x2a,
              0x45, 0x3c, 0x24, 0xb7, 0x47, 0xc4, 0xaf, 0x1a, 0x97, 0xda, 0x88, 0x8d
              ]),
        'navy blue': new Uint8Array([
              0x4d, 0xf0, 0x37, 0x9c, 0xe4, 0xb9, 0x66, 0x62, 0x02, 0x29, 0x46, 0x23,
              0x44, 0xa0, 0x78, 0xe5, 0x95, 0x96, 0xde, 0x81, 0x89, 0x8d, 0x8c, 0xa5,
              0xac, 0xf9, 0x2c, 0x14, 0x18, 0x6e, 0x9e, 0x1f, 0x6d, 0xae, 0x7b, 0xa3,
              0xb0, 0x3e, 0xbe, 0xdc, 0x21, 0x02, 0xdd, 0xa4, 0x56, 0xb9, 0xd9, 0x38,
              0xc4, 0x0a, 0xfd, 0x8d, 0x3a, 0xb5, 0x91, 0x14, 0xe1, 0x5e, 0x9e, 0xb6,
              0xaf, 0x15, 0x7f, 0x99, 0x43, 0xb6, 0x6e, 0x8a, 0xdc, 0x1b, 0xde, 0xed,
              0x97, 0x0e, 0x6e, 0x58, 0x29, 0xd8, 0xbd, 0xf1, 0x36, 0x34, 0x0a, 0xe2
              ]),
        'white': new Uint8Array([
              0xeb, 0x2d, 0x08, 0x40, 0xf2, 0xea, 0xd2, 0xaf, 0x1c, 0xab, 0x6f, 0xb8,
              0x13, 0xac, 0x0c, 0x8b, 0x68, 0x54, 0xdc, 0xd3, 0xe0, 0x06, 0x7c, 0xc3,
              0xfe, 0x1a, 0x6f, 0xa6, 0x86, 0x2d, 0xf5, 0x56, 0x81, 0xda, 0x9c, 0x61,
              0x0c, 0xdf, 0xf4, 0x31, 0xc1, 0x5f, 0x63, 0xa7, 0xc7, 0x37, 0x3d, 0x21,
              0xe1, 0x9e, 0x11, 0x65, 0x3c, 0x74, 0x29, 0xdd, 0x7a, 0xd8, 0xb7, 0xe3,
              0xb3, 0xe8, 0xa2, 0x0f, 0x65, 0x2a, 0xb9, 0xb9
              ]),
    };

    let sensitivities = new Float32Array([0.5, 1, 1, 1, 1, 1]);

    let keywordNames = Object.keys(keywordIDs);

    let currentTimeSeconds = function() { return new Date().getTime() / 1000 };

    let is_listening = false;
    let listeningStartSeconds;
    let processCallback = function(keywordIndex) {
        if (keywordIndex === -1) {
            if (is_listening && (currentTimeSeconds() - listeningStartSeconds) > 5) {
                document.querySelector("#light_bulb").setAttribute("src", "light_bulb_blue.svg");
                is_listening = false;
            }
            return;
        }

        let keyword = keywordNames[keywordIndex];
        if (is_listening) {
            if (keyword === "yellow") {
                document.querySelector("#light_bulb").setAttribute("style", "background-color:yellow")
            }
            if (keyword === "orange") {
                document.querySelector("#light_bulb").setAttribute("style", "background-color:orange")
            }
            if (keyword === "purple") {
                document.querySelector("#light_bulb").setAttribute("style", "background-color:purple")
            }
            if (keyword === "navy blue") {
                document.querySelector("#light_bulb").setAttribute("style", "background-color:blue")
            }
            if (keyword === "white") {
                document.querySelector("#light_bulb").setAttribute("style", "background-color:white")
            }
            document.querySelector("#light_bulb").setAttribute("src", "light_bulb_blue.svg");
            is_listening = false;
        }
        if (keyword === "ok lamp") {
            document.querySelector("#light_bulb").setAttribute("src", "light_bulb_red.svg");
            is_listening = true;
            listeningStartSeconds = currentTimeSeconds();
        }
    };

    let audioManager;

    let audioManagerErrorCallback = function(ex) {
        alert(ex.toString());
        document.querySelector("#light_bulb").setAttribute("style", "background-color:white");
        document.querySelector("#light_bulb").setAttribute("src", "light_bulb_blue.svg");
        document.querySelector("#demo_button").setAttribute("onclick", "VoiceControlDemo.start()");
        document.querySelector("#demo_button").innerText = "Start Demo";
    };

    let start = function() {
        audioManager = new PicovoiceAudioManager();
        audioManager.start(Porcupine.create(Object.values(keywordIDs), sensitivities), processCallback, audioManagerErrorCallback);

        document.querySelector("#demo_button").setAttribute("onclick", "VoiceControlDemo.stop()");
        document.querySelector("#demo_button").innerText = "Stop Demo";
    };

    let stop = function() {
        audioManager.stop();

        document.querySelector("#light_bulb").setAttribute("style", "background-color:white");
        document.querySelector("#light_bulb").setAttribute("src", "light_bulb_blue.svg");
        document.querySelector("#demo_button").setAttribute("onclick", "VoiceControlDemo.start()");
        document.querySelector("#demo_button").innerText = "Start Demo";
    };

    return {start: start, stop: stop}
})();