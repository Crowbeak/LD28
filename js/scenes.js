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
                Surface,
            Shapes */


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
            this.active = false;
            this.type = 0;
            this.typeChanged = false;
        },
        
        onenterframe: function () {
            if (this.typeChanged) {
                switch (this.type) {
                case 1:
                    this.image = this.images.one;
                    break;
                case 2:
                    this.image = this.images.two;
                    break;
                case 3:
                    this.image = this.images.three;
                    break;
                case 4:
                    this.image = this.images.four;
                    break;
                default:
                    this.image = this.images.base;
                }
                this.typeChanged = false;
            }
        }
    });
    
    Tile.prototype.change = function (type) {
        console.info("tile change num " + type);
        this.type = type;
        this.typeChanged = true;
    };
    
    Tile.prototype.reset = function () {
        this.type = 0;
        this.typeChanged = true;
    };
    
    var NextPiecesDisplay = Class.create(Group, {
        initialize: function (tileimages, clickSound) {
            var i, temp;
            
            Group.call(this);
            
            this.clickSound = clickSound;
            this.tileActive = false;
            this.newType = 0;
            
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
    
    NextPiecesDisplay.prototype.generateTiles = function () {
        var i;
        var types = [];
        types[0] = Math.floor((Math.random() * 4) + 1);
        i = Math.floor((Math.random() * 4) + 1);
        while (types[0] === i) {
            i = Math.floor((Math.random() * 4) + 1);
        }
        types[1] = i;
        for (i = 0; i < this.tiles.length; i++) {
            this.tiles[i].change(types[i]);
            this.tiles[i].active = false;
        }
        this.tileActive = false;
    };
    
    NextPiecesDisplay.prototype.selectTile = function (num) {
        this.tiles[num].active = true;
        this.tileActive = true;
        this.newType = this.tiles[num].type;
        this.clickSound.play();
        console.info("active tile " + num);
    };
    
    var Scoreboard = Class.create(Group, {
        initialize: function () {
            Group.call(this);
            
            this.score = 0;
            
            this.scoreDisplay = new Label();
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
        }
    });
    
    Scoreboard.prototype.addGraphicsToScene = function (scene) {
        scene.addChild(this.scoreDisplay);
        scene.addChild(this.title);
    };
    
    Scoreboard.prototype.update = function (points) {
        this.score += points;
        this.scoreDisplay.text = this.score;
    };
    
    var TargetDisplay = Class.create(Group, {
        initialize: function (images) {
            Group.call(this);
            
            this.images = images;
            
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
            
            this.nextTarget = new Sprite(180, 90);
            this.nextTarget.image = this.images.straight;
            this.nextTarget.x = this.bg.x;
            this.nextTarget.y = this.bg.y;
        }
    });
    
    TargetDisplay.prototype.addGraphicsToScene = function (scene) {
        scene.addChild(this.bg);
        scene.addChild(this.title);
        scene.addChild(this.nextTarget);
    };
    
    var Board = Class.create(Group, {
        initialize: function (tileimages, options, sounds) {
            var i, j, temp;
            
            Group.call(this);
            
            this.sounds = sounds;
            this.rows = options.rows;
            this.cols = options.cols;
            console.info("rows " + this.rows + " cols " + this.cols);
            this.tilePlaced = false;
            this.lastTypeMatched = 0;
            
            this.tiles = [];
            for (i = 0; i < this.rows; i++) {
                for (j = 0; j < this.cols; j++) {
                    temp = new Tile(tileimages, Constants.tilesize);
                    temp.x = Constants.boardx + (j * Constants.tilesize) - ((this.cols - 1) - (2 * j));
                    temp.y = Constants.boardy + (i * Constants.tilesize) - ((this.rows - 1) - (2 * i));
                    this.tiles.push(temp);
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
    
    Board.prototype.placeTile = function (i, newType) {
        this.tiles[i].change(newType);
        this.sounds.shoonk.play();
        this.tilePlaced = true;
    };
    
    // returns object with two fields representing the number
    // of points to add and an array of tiles to be removed from
    // the board
    Board.prototype.checkState = function () {
        var tilesToRemove, pts;
        if (this.tilePlaced) {
            tilesToRemove = this.checkForShapes();
            pts = this.calculatePoints(tilesToRemove);
            this.tilePlaced = false;
            return {
                points: pts,
                tilesToRemove: tilesToRemove
            };
        } else {
            return {
                points: 0,
                tilesToRemove: []
            };
        }
    };
    
    //returns array of tile indices to be removed from the board
    Board.prototype.checkForShapes = function () {
        var i, shapeData;
        for (i = 0; i < this.tiles.length; i++) {
            shapeData = Shapes.checkALLtheShapes({ tileList: this.tiles,
                                                   ii: i,
                                                   colHeight: this.rows,
                                                   rowWidth: this.cols });
            if (shapeData.needToRemove) {
                return shapeData.tilesToRemove;
            }
        }
        return [];
    };
    
    Board.prototype.removeTiles = function (tilesToRemove) {
        var i;
        for (i = 0; i < tilesToRemove.length; i++) {
            this.tiles[tilesToRemove[i]].reset();
        }
    };
    
    //returns number of points to add to score
    Board.prototype.calculatePoints = function (tilesToRemove) {
        if (tilesToRemove.length > 0) {
            return 1;
        } else { return 0; }
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
            this.board = new Board(images.tiles, options.boardsize, sounds);
            this.scoreboard = new Scoreboard();
            this.targetDisplay = new TargetDisplay(images.shapes);
            this.nextPieces = new NextPiecesDisplay(images.tiles, sounds.click);
            this.nextPieces.generateTiles();
            
            this.board.addGraphicsToScene(this);
            this.nextPieces.addGraphicsToScene(this);
            this.scoreboard.addGraphicsToScene(this);
            this.targetDisplay.addGraphicsToScene(this);
            
            this.clickpoint = new Sprite(2, 2);
//            this.clickpoint.backgroundColor = "white";
            this.clickpoint.reset = function () {
                this.x = 0;
                this.y = 0;
            };
            this.addEventListener(Event.TOUCH_START, function (e) {
//                console.info("x" + e.x + "y" + e.y);
                this.clickpoint.x = e.x;
                this.clickpoint.y = e.y;
            });
            this.addChild(this.clickpoint);
        },
        
        onenterframe: function () {
            var i;
            var boardState = {
                points: 0,
                tilesToRemove: []
            };
            
            if (this.nextPieces.tileActive) {
                for (i = 0; i < this.board.tiles.length; i++) {
                    if ((this.clickpoint.intersect(this.board.tiles[i])) && (this.board.tiles[i].type === 0)) {
                        this.board.placeTile(i, this.nextPieces.newType);
                        this.nextPieces.generateTiles();
                        break;
                    }
                }
            } else {
                for (i = 0; i < this.nextPieces.tiles.length; i++) {
                    if (this.clickpoint.intersect(this.nextPieces.tiles[i])) {
                        this.nextPieces.selectTile(i);
                        break;
                    }
                }
            }
            boardState = this.board.checkState();
            if (boardState.tilesToRemove.length > 0) {
                this.board.removeTiles(boardState.tilesToRemove);
            }
            this.scoreboard.update(boardState.points);
        }
    });
}(window.Scenes = window.Scenes || {}));