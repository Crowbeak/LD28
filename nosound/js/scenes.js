// LD28 YOGO
// by Lena LeRay
//
// A puzzley strategy game in which the player only gets one of two
// possible pieces.

/*jslint    browser:true,
            devel:true,
            plusplus:true,
            vars:true */

/*global    Constants,
            enchant,
                Class,
                Event,
                Scene,
            Game,
            ShapeDefinitions */


(function (Scenes) {
    "use strict";
    
    /**
     * The scene where all the gaming happens.
     */
    Scenes.gameplay = Class.create(Scene, {
        initialize: function (images, options) {
            console.info("init game scene");
            Scene.call(this);
            
            this.backgroundColor = Constants.gamebgc;
            this.isTouched = false;
            this.board = new Game.Board(images, options.boardsize);
            this.scoreboard = new Game.Scoreboard();
            this.targetDisplay = new Game.TargetDisplay(images.shapes, ShapeDefinitions.shapeObjectList, options.targets);
            this.nextPieces = new Game.NextPiecesDisplay(images);
            this.nextPieces.generateTiles();
            
            this.board.addGraphicsToScene(this);
            this.nextPieces.addGraphicsToScene(this);
            this.scoreboard.addGraphicsToScene(this);
            this.targetDisplay.addGraphicsToScene(this);
            this.targetDisplay.generateNextTarget();
            this.targetDisplay.update();
            
            this.clickpoint = new Game.ClickPoint();
            this.addEventListener(Event.TOUCH_START, function (e) {
//                console.info("x" + e.x + "y" + e.y);
                this.clickpoint.x = e.x;
                this.clickpoint.y = e.y;
            });
            this.addChild(this.clickpoint);
            
            this.checkBoardState = function () {
                var boardState = {
                    points: 0,
                    tilesToRemove: [],
                    shapeFound: false
                };
                
                boardState = this.board.checkState(this.targetDisplay.getCurrentTarget());
                while (boardState.shapeFound) {
                    this.board.removeTiles(boardState.tilesToRemove);
                    this.scoreboard.update(boardState.points);
                    this.targetDisplay.generateNextTarget();
                    this.targetDisplay.update();
                    boardState = this.board.checkState(this.targetDisplay.getCurrentTarget());
                }
            };
        },
        
        onenterframe: function () {
            var i;
            
            if (this.nextPieces.tileActive) {
                for (i = 0; i < this.board.tiles.length; i++) {
                    if ((this.clickpoint.intersect(this.board.tiles[i])) && (this.board.tiles[i].type === 0)) {
                        this.board.placeTile(i, this.nextPieces.newType);
                        this.checkBoardState();
                        this.nextPieces.generateTiles();
                        this.nextPieces.markSelectable();
                        break;
                    }
                }
            } else {
                for (i = 0; i < this.nextPieces.tiles.length; i++) {
                    if (this.clickpoint.intersect(this.nextPieces.tiles[i])) {
                        this.nextPieces.selectTile(i);
                        this.nextPieces.markUnselectable();
                        this.board.markSelectable();
                        break;
                    }
                }
            }
        }
    });
}(window.Scenes = window.Scenes || {}));
