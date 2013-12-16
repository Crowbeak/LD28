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
            
            this.height = 40;
            this.width = Constants.cdisplayWidth;
            this.color = Constants.cdisplayColor;
            this.font = "40px arial,sans-serif";
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
        initialize: function (images) {
            var i, temp;
            
            Group.call(this);
            
            this.tileActive = false;
            this.newType = 0;
            
            this.bg = new UIBackground("center");
            
            this.tiles = [];
            for (i = 0; i < Constants.numberOfChoices; i++) {
                temp = new Tile(images.tiles, Constants.tilesize);
                temp.x = this.bg.x + (Constants.padding * (i + 1)) + (i * Constants.tilesize);
                temp.y = this.bg.y + Constants.padding;
                this.tiles.push(temp);
            }
            
            this.clickHereBG = new Sprite(432, 218);
            this.clickHereBG.x = (Constants.stageWidth / 2) - (this.clickHereBG.width / 2);
            this.clickHereBG.y = Constants.stageHeight - this.clickHereBG.height;
            this.clickHereBG.image = images.centerui.one;
            
            this.clickHere = new Sprite(432, 218);
            this.clickHere.x = (Constants.stageWidth / 2) - (this.clickHere.width / 2);
            this.clickHere.y = Constants.stageHeight - this.clickHere.height;
            this.clickHere.image = images.centerui.two;
            this.clickHere.opacityDecreasing = true;
            this.clickHere.addEventListener(Event.ENTER_FRAME, function () {
                if (this.opacityDecreasing) {
                    if (this.opacity > Constants.opacityMinimum) {
                        this.opacity -= Constants.opacityROC;
                    } else {
                        this.opacityDecreasing = false;
                        this.opacity += Constants.opacityROC;
                    }
                } else {
                    if (this.opacity < 1) {
                        this.opacity += Constants.opacityROC;
                    } else {
                        this.opacityDecreasing = true;
                        this.opacity -= Constants.opacityROC;
                    }
                }
            });
        }
    });
    
    NextPiecesDisplay.prototype.addGraphicsToScene = function (scene) {
        var i;
        scene.addChild(this.clickHereBG);
        scene.addChild(this.clickHere);
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
        console.info("active tile " + num);
    };
    
    NextPiecesDisplay.prototype.markSelectable = function () {
        this.clickHereBG.visible = true;
        this.clickHere.visible = true;
    };
    
    NextPiecesDisplay.prototype.markUnselectable = function () {
        this.clickHereBG.visible = false;
        this.clickHere.visible = false;
    };
    
    
    var Scoreboard = Class.create(Group, {
        initialize: function () {
            Group.call(this);
            
            this.score = 0;
            
            this.scoreDisplay = new UIBackground("left");
            this.scoreDisplay.font = "170px arial,sans-serif";
            this.scoreDisplay.textAlign = "center";
            this.scoreDisplay.color = "white";
            this.scoreDisplay.text = 0;
            
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
        }
    });
    
    NextTarget.prototype.changeImage = function (newImg) {
        this.image = newImg;
    };
    
    
    var TargetDisplay = Class.create(Group, {
        initialize: function (images, shapeList, targetOptions) {
            Group.call(this);
            
            var i;
            
            this.images = images;
            this.bg = new UIBackground("right");
            this.title = new UITitle("MAKE THIS", "right");
            
            this.possibleTargets = [];
            for (i = targetOptions.startIndex; i < targetOptions.numberOfPatterns; i++) {
                this.possibleTargets.push({
                    shapeObject: shapeList[i],
                    imgFile: this.images[shapeList[i].img]
                });
            }
            this.target = 0;
            this.targetUpdated = false;
            
            this.nextTarget = new NextTarget(this.images, this.bg.x, this.bg.y);
        }
    });
    
    TargetDisplay.prototype.addGraphicsToScene = function (scene) {
        scene.addChild(this.bg);
        scene.addChild(this.title);
        scene.addChild(this.nextTarget);
    };
    
    TargetDisplay.prototype.generateNextTarget = function () {
        this.target = Math.floor(Math.random() * this.possibleTargets.length);
        this.targetUpdated = true;
    };
    
    TargetDisplay.prototype.update = function () {
        var possibleTargets = this.possibleTargets;
        var i = this.target;
        this.nextTarget.changeImage(possibleTargets[i].imgFile);
        this.targetUpdated = false;
    };
    
    TargetDisplay.prototype.getCurrentTarget = function () {
        var temp = this.possibleTargets[this.target];
        return temp;
    };
    
    
    var Board = Class.create(Group, {
        initialize: function (tileimages, options) {
            var i, j, temp;
            
            Group.call(this);
            
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
            
            this.clickHere = new Label();
            this.clickHere.width = 1240;
            this.clickHere.height = 832;
            this.clickHere.backgroundColor = "#180a94";
            this.clickHere.x = this.tiles[0].x - 10;
            this.clickHere.y = this.tiles[0].y - 10;
            this.clickHere.opacityDecreasing = true;
            this.clickHere.addEventListener(Event.ENTER_FRAME, function () {
                if (this.opacityDecreasing) {
                    if (this.opacity > Constants.opacityMinimum) {
                        this.opacity -= Constants.opacityROC;
                    } else {
                        this.opacityDecreasing = false;
                        this.opacity += Constants.opacityROC;
                    }
                } else {
                    if (this.opacity < 1) {
                        this.opacity += Constants.opacityROC;
                    } else {
                        this.opacityDecreasing = true;
                        this.opacity -= Constants.opacityROC;
                    }
                }
            });
            this.clickHere.visible = false;
            
            this.clickHereEyeSaver = new Label();
            this.clickHereEyeSaver.width = 1220;
            this.clickHereEyeSaver.height = 812;
            this.clickHereEyeSaver.backgroundColor = Constants.gamebgc;
            this.clickHereEyeSaver.x = this.tiles[0].x;
            this.clickHereEyeSaver.y = this.tiles[0].y;
        }
    });
    
    Board.prototype.addGraphicsToScene = function (scene) {
        var i;
        scene.addChild(this.clickHere);
        scene.addChild(this.clickHereEyeSaver);
        for (i = 0; i < this.tiles.length; i++) {
            scene.addChild(this.tiles[i]);
        }
    };
    
    Board.prototype.placeTile = function (i, newType) {
        this.tiles[i].change(newType);
        this.tilePlaced = true;
        this.markUnselectable();
    };
    
    // returns object with two fields representing the number
    // of points to add and an array of tiles to be removed from
    // the board
    Board.prototype.checkState = function (currentTarget) {
        var tilesToRemove, pts, temp;
        if (this.tilePlaced) {
            tilesToRemove = this.checkForShapes(currentTarget);
            pts = this.calculatePoints(tilesToRemove);
            if (pts > 0) {
                temp = true;
            } else {
                temp = false;
            }
            this.tilePlaced = false;
            return {
                points: pts,
                tilesToRemove: tilesToRemove.indices,
                shapeFound: temp
            };
        } else {
            return {
                points: 0,
                tilesToRemove: [],
                shapeFound: false
            };
        }
    };
    
    //returns array of tile indices to be removed from the board
    Board.prototype.checkForShapes = function (currentTarget) {
        var i, shapeData;
        for (i = 0; i < this.tiles.length; i++) {
            shapeData = Shapes.checkALLtheShapes({ tileList: this.tiles,
                                                   ii: i,
                                                   colHeight: this.rows,
                                                   rowWidth: this.cols }, currentTarget);
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
    
    Board.prototype.markSelectable = function () {
        this.clickHere.visible = true;
    };
    
    Board.prototype.markUnselectable = function () {
        this.clickHere.visible = false;
    };
    
    
    /**
     * The scene where all the gaming happens.
     */
    Scenes.gameplay = Class.create(Scene, {
        initialize: function (images, options) {
            console.info("init game scene");
            Scene.call(this);
            
            this.backgroundColor = Constants.gamebgc;
            this.isTouched = false;
            this.board = new Board(images.tiles, options.boardsize);
            this.scoreboard = new Scoreboard();
            this.targetDisplay = new TargetDisplay(images.shapes, Shapes.shapeObjectList, options.targets);
            this.nextPieces = new NextPiecesDisplay(images);
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
            boardState = this.board.checkState(this.targetDisplay.getCurrentTarget());
            while (boardState.shapeFound) {
                this.board.removeTiles(boardState.tilesToRemove);
                this.scoreboard.update(boardState.points);
                this.targetDisplay.generateNextTarget();
                boardState = this.board.checkState(this.targetDisplay.getCurrentTarget());
            }
            if (this.targetDisplay.targetUpdated) {
                this.targetDisplay.update();
            }
        }
    });
}(window.Scenes = window.Scenes || {}));