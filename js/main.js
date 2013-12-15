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
            Scenes,
            Shapes */


// Initialize and start the game.
$(document).ready(function () {
    "use strict";
    var game = new Core(Constants.stageWidth, Constants.stageHeight);
    game.preload('img/crowbeak.png',
                 
                 'img/tiles/basetile.png',
                 'img/tiles/red.png',
                 'img/tiles/yellow.png',
                 'img/tiles/green.png',
                 'img/tiles/blue.png',
                 
                 'img/blocks/square.png',
                 'img/blocks/straight.png',
                 'img/blocks/zblock.png',
                 'img/blocks/sblock.png',
                 'img/blocks/lgun.png',
                 'img/blocks/rgun.png',
                 'img/blocks/tblock.png',
                 
                 'sound/badmove.wav',
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
                base: game.assets['img/tiles/basetile.png'],
                one: game.assets['img/tiles/red.png'],
                two: game.assets['img/tiles/blue.png'],
                three: game.assets['img/tiles/yellow.png'],
                four: game.assets['img/tiles/green.png']
            },
            shapes: {
                square: game.assets['img/blocks/square.png'],
                straight: game.assets['img/blocks/straight.png'],
                zblock: game.assets['img/blocks/zblock.png'],
                sblock: game.assets['img/blocks/sblock.png'],
                lgun: game.assets['img/blocks/lgun.png'],
                rgun: game.assets['img/blocks/rgun.png'],
                tblock: game.assets['img/blocks/tblock.png']
            }
        };
        var sounds = {
            badmove: game.assets['sound/badmove.wav'],
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
