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
                Core,
                Event,
                Group,
                Label,
                Node,
                Scene,
                Sprite,
                Surface, */


(function (Scenes) {
    "use strict";
    
    /**
     * Takes block of all tile images.
     */
    var Tile = Class.create(Sprite, {
        initialize: function (images, tilesize) {
            Sprite.call(this, tilesize, tilesize);
            
            this.images = images;
            this.image = this.images.base;
            this.selected = false;
            this.number = 0;
        },
        
        onenterframe: function () {
            // !!! update tile
        }
    });
    
    Tile.prototype.change = function () {
        console.error("change tile number");
    };
    
    var NextPiecesDisplay = Class.create(Group, {
        initialize: function (tileimages) {
            var i, temp;
            
            Group.call(this);
            
            this.tileSelected = false;
            
            this.bg = new Label();
            this.bg.width = (Constants.tilesize * Constants.numberOfChoices) + (2 * (Constants.numberOfChoices + 1));
            this.bg.height = Constants.tilesize + 4;
            this.bg.backgroundColor = "black";
            this.bg.x = (Constants.stageWidth / 2) - (this.bg.width / 2);
            this.bg.y = Constants.stageHeight - this.bg.height;
            
            this.tiles = [];
            for (i = 0; i < 2; i++) {
                temp = new Tile(tileimages, Constants.tilesize);
                temp.x = this.bg.x + (2 * (i + 1)) + (i * 100);
                temp.y = this.bg.y + 2;
                this.tiles.push(temp);
            }
        }
    });
    
    NextPiecesDisplay.prototype.addGraphicsToScene = function (scene) {
        var i;
        scene.addChild(this.bg);
        for (i = 0; i < this.tiles.length; i++) {
            scene.addChild(this.tiles[i]);
        }
    };
    
    var Scoreboard = Class.create(Group, {
        initialize: function () {
            Group.call(this);
            
            this.score = 0;
            
            this.scoreDisplay = new Label("0");
            this.scoreDisplay.height = 90;
            this.scoreDisplay.width = 180;
            this.scoreDisplay.font = "80px arial,sans-serif";
            this.scoreDisplay.textAlign = "center";
            this.scoreDisplay.color = "white";
            this.scoreDisplay.backgroundColor = "#333333";
            this.scoreDisplay.x = 0;
            this.scoreDisplay.y = Constants.stageHeight - this.scoreDisplay.height;
            
            this.title = new Label("SCORE");
            this.title.height = 20;
            this.title.x = 2;
            this.title.y = Constants.stageHeight - this.scoreDisplay.height - this.title.height;
            this.title.color = "#333333";
            this.title.font = "20px arial,sans-serif";
        },
        
        onenterframe: function () {
            this.text = this.score;
        }
    });
    
    Scoreboard.prototype.addGraphicsToScene = function (scene) {
        scene.addChild(this.scoreDisplay);
        scene.addChild(this.title);
    };
    
    var TargetDisplay = Class.create(Group, {
        initialize: function () {
            Group.call(this);
            
            this.bg = new Label();
            this.bg.height = 90;
            this.bg.width = 180;
            this.bg.x = Constants.stageWidth - this.bg.width;
            this.bg.y = Constants.stageHeight - this.bg.height;
            this.bg.backgroundColor = "#333333";
            
            this.title = new Label("NEXT SHAPE");
            this.title.height = 20;
            this.title.width = 180;
            this.title.x = Constants.stageWidth - this.title.width - 2;
            this.title.y = Constants.stageHeight - this.bg.height - this.title.height;
            this.title.color = "#333333";
            this.title.font = "20px arial,sans-serif";
            this.title.textAlign = "right";
        }
    });
    
    TargetDisplay.prototype.addGraphicsToScene = function (scene) {
        scene.addChild(this.bg);
        scene.addChild(this.title);
    };
    
    var Board = Class.create(Group, {
        initialize: function (tileimages, options) {
            var i, j, temp;
            
            Group.call(this);
            
            this.rows = options.rows;
            this.cols = options.cols;
            console.info("rows " + this.rows + " cols " + this.cols);
            
            this.tiles = [];
            for (i = 0; i < this.cols; i++) {
                for (j = 0; j < this.rows; j++) {
                    temp = new Tile(tileimages, Constants.tilesize);
                    temp.x = Constants.boardx + (i * Constants.tilesize) - ((this.cols - 1) - (2 * i));
                    temp.y = Constants.boardy + (j * Constants.tilesize) - ((this.rows - 1) - (2 * j));
                    this.tiles[this.tiles.length] = temp;
                }
            }
        }
    });
    
    Board.prototype.addGraphicsToScene = function (scene) {
        var i;
        for (i = 0; i < this.tiles.length; i++) {
            scene.addChild(this.tiles[i]);
        }
    };
    
    /**
     * The scene where all the gaming happens.
     */
    Scenes.gameplay = Class.create(Scene, {
        initialize: function (images, sounds, options) {
            console.info("init game scene");
            Scene.call(this);
            
            this.backgroundColor = Constants.gamebgc;
            this.isTouched = false;
            this.board = new Board(images.tiles, options.boardsize);
            this.scoreboard = new Scoreboard();
            this.targetDisplay = new TargetDisplay();
            this.nextPieces = new NextPiecesDisplay(images.tiles);
            
            this.board.addGraphicsToScene(this);
            this.nextPieces.addGraphicsToScene(this);
            this.scoreboard.addGraphicsToScene(this);
            this.targetDisplay.addGraphicsToScene(this);
            
            this.cursor = new Sprite(10, 10);
            this.cursor.backgroundColor = "red";
//            this.cursor.x = 0;
//            this.cursor.y = 0;
            this.addEventListener(Event.TOUCH_START, function (e) {
                console.info("x" + e.x + "y" + e.y);
                this.cursor.x = e.x;
                this.cursor.y = e.y;
            });
            
            this.addChild(this.cursor);
        },
        
        onenterframe: function () {
            var i, j;
            if (this.nextPieces.tileSelected) {
                console.error("choose where to put it");
            } else {
                for (i = 0; i < this.nextPieces.tiles.length; i++) {
                    if (this.cursor.intersect(this.nextPieces.tiles[i])) {
                        this.nextPieces.tiles[i].selected = true;
                        this.nextPieces.tileSelected = true;
                        console.info("selected tile " + i);
                        break;
                    }
                }
            }
        }
    });
}(window.Scenes = window.Scenes || {}));