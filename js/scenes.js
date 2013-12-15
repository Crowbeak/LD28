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
    
    var UITitle = Class.create(Label, {
        initialize: function (text, textAlign) {
            Label.call(this, text);
            
            this.height = 20;
            this.width = 180;
            this.color = Constants.cdisplayColor;
            this.font = "20px arial,sans-serif";
            if (textAlign === "left") {
                this.x = Constants.padding;
            } else if (textAlign === "right") {
                this.x = Constants.stageWidth - Constants.cdisplayWidth - Constants.padding;
            }
            this.y = Constants.stageHeight - Constants.cdisplayHeight - this.height;
            this.textAlign = textAlign;
            
        }
    });
    
    
    var UIBackground = Class.create(Label, {
        initialize: function (location) {
            Label.call(this);
            
            if (location === "center") {
                this.width = (Constants.tilesize * Constants.numberOfChoices) + (Constants.padding * (Constants.numberOfChoices + 1));
                this.height = Constants.tilesize + (Constants.numberOfChoices * Constants.padding);
                this.backgroundColor = "black";
                this.x = (Constants.stageWidth / 2) - (this.width / 2);
                this.y = Constants.stageHeight - this.height;
            } else {
                this.height = Constants.cdisplayHeight;
                this.width = Constants.cdisplayWidth;
                this.backgroundColor = Constants.cdisplayColor;
                if (location === "left") {
                    this.x = 0;
                } else if (location === "right") {
                    this.x = Constants.stageWidth - this.width;
                }
                this.y = Constants.stageHeight - this.height;
            }
        }
    });
    
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
            
            this.bg = new UIBackground("center");
            
            this.tiles = [];
            for (i = 0; i < Constants.numberOfChoices; i++) {
                temp = new Tile(tileimages, Constants.tilesize);
                temp.x = this.bg.x + (Constants.padding * (i + 1)) + (i * 100);
                temp.y = this.bg.y + Constants.padding;
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
            
            this.scoreDisplay = new UIBackground("left");
            this.scoreDisplay.font = "80px arial,sans-serif";
            this.scoreDisplay.textAlign = "center";
            this.scoreDisplay.color = "white";
            
            this.title = new UITitle("SCORE", "left");
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
    
    
    var NextTarget = Class.create(Sprite, {
        initialize: function (images, xCoord, yCoord) {
            Sprite.call(this, Constants.cdisplayWidth, Constants.cdisplayHeight);
            
            this.image = images.square;
            this.x = xCoord;
            this.y = yCoord;
            
            this.target = 0;
        }
    });
    
    
    var TargetDisplay = Class.create(Group, {
        initialize: function (images) {
            Group.call(this);
            
            this.images = images;
            this.bg = new UIBackground("right");
            this.title = new UITitle("MAKE THIS", "right");
            
            this.nextTarget = new NextTarget(this.images, this.bg.x, this.bg.y);
        }
    });
    
    TargetDisplay.prototype.addGraphicsToScene = function (scene) {
        scene.addChild(this.bg);
        scene.addChild(this.title);
        scene.addChild(this.nextTarget);
    };
    
    TargetDisplay.prototype.generateNextTarget = function () {
        console.error("TargetDisplay.generateNextTarget");
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
                    temp.x = Constants.boardx + (j * Constants.tilesize) - ((this.cols - 1) - (Constants.padding * j));
                    temp.y = Constants.boardy + (i * Constants.tilesize) - ((this.rows - 1) - (Constants.padding * i));
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
                tilesToRemove: tilesToRemove.indices
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
        return Shapes.noTilesToRemove();
    };
    
    Board.prototype.removeTiles = function (tilesToRemove) {
        var i;
        for (i = 0; i < tilesToRemove.length; i++) {
            this.tiles[tilesToRemove[i]].reset();
        }
    };
    
    //returns number of points to add to score
    Board.prototype.calculatePoints = function (tilesToRemove) {
        if (tilesToRemove.indices.length > 0) {
            if ((tilesToRemove.tileType === this.lastTypeMatched) || (this.lastTypeMatched === 0)) {
                this.lastTypeMatched = tilesToRemove.tileType;
                return 1;
            } else {
                this.lastTypeMatched = tilesToRemove.tileType;
                return 2;
            }
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
            this.targetDisplay.generateNextTarget();
            
            this.clickpoint = new Sprite(Constants.padding, Constants.padding);
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