// LD28 YOGO
// by Lena LeRay
//
// A puzzley strategy game in which the player only gets one of two
// possible pieces.


// This is the last file to load.
// Initializes and starts the game itself.

/*jslint    browser:true,
            devel:true,
            plusplus:true,
            vars:true */

/*global    $,
            Constants,
            enchant,
                Class,
                Core,
                Event,
                Label,
                Node,
                Scene,
                Sprite,
                Surface,
            Scenes */


// Initialize and start the game.
$(document).ready(function () {
    "use strict";
    var game = new Core(Constants.stageWidth, Constants.stageHeight);
    game.preload('img/crowbeak.png',
                 'img/basetile.png',
                 'img/red.png',
                 'img/yellow.png',
                 'img/green.png',
                 'img/blue.png',
                 'sound/click.wav',
                 'sound/gung.wav',
                 'sound/shoonk.wav',
                 'sound/ting.wav');
    game.fps = Constants.fps;
    game.onload = function () {
        console.info("Game loaded.");
        var images = {
            logo: game.assets['img/crowbeak.png'],
            tiles: {
                base: game.assets['img/basetile.png'],
                one: game.assets['img/red.png'],
                two: game.assets['img/blue.png'],
                three: game.assets['img/yellow.png'],
                four: game.assets['img/green.png']
            }
        };
        var sounds = {
            click: game.assets['sound/click.wav'],
            gung: game.assets['sound/gung.wav'],
            shoonk: game.assets['sound/shoonk.wav'],
            ting: game.assets['sound/ting.wav']
        };
        var options = {
            boardsize: {
                rows: 4,
                cols: 6
            },
            colorblind: false
        };
        
        Constants.bindKeys(game);
        
        game.pushScene(new window.Scenes.gameplay(images, sounds, options));
    };
    game.start();
});
