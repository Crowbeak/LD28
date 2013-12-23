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
                Core,
            Scenes */


// Initialize and start the game.
$(document).ready(function () {
    "use strict";
    var game = new Core(Constants.stageWidth, Constants.stageHeight);
    game.preload('img/crowbeak.png',
                 'img/boardui1.png',
                 'img/boardui2.png',
                 'img/centerui1.png',
                 'img/centerui2.png',
                 
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
                 'img/blocks/tblock.png');
    game.fps = Constants.fps;
    game.onload = function () {
        console.info("Game loaded.");
        var images = {
            logo: game.assets['img/crowbeak.png'],
            boardui: {
                back: game.assets['img/boardui1.png'],
                front: game.assets['img/boardui2.png']
            },
            centerui: {
                back: game.assets['img/centerui1.png'],
                front: game.assets['img/centerui2.png']
            },
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
        var options = {
            boardsize: {
                rows: 4,
                cols: 6
            },
            colorblind: false,
            targets: {
                startIndex: Constants.fourTetrominoesStart,
                numberOfPatterns: Constants.fourTetrominoesNumber
            }
        };
        
        Constants.bindKeys(game);
        
        game.pushScene(new window.Scenes.gameplay(images, options));
    };
    game.start();
});
