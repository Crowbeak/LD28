// LD28 YOGO
// by Lena LeRay
//
// A puzzley strategy game in which the player only gets one of two
// possible pieces.


// constants.js must be the first file loaded.
// It starts enchant.js up in addition to specifying the Constants object.

/*jslint    browser:true,
            devel:true,
            plusplus:true,
            vars:true */

/*global    enchant */


enchant();

var Constants = {
    boardx: 100,
    boardy: 50,
    fps: 20,
    gamebgc: "lightgray",
    numberOfChoices: 2,
    stageHeight: 600,
    stageWidth: 800,
    tilesize: 100,
    
    bindKeys: function (game) {
        // Bind spacebar to 'a' and allow WASD input
        "use strict";
        console.info("Binding keys.");
        game.keybind(32, 'a');
        game.keybind(65, 'left');
        game.keybind(68, 'right');
        game.keybind(87, 'up');
        game.keybind(83, 'down');
    }
};
if (Object.freeze) { Object.freeze(Constants); }