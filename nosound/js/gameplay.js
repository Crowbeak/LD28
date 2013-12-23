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
                Group,
                Sprite,
            GameUI,
            Shapes */
            

(function (Game) {
    "use strict";
    
    // CLICK POINT ----------------------------------------------------
    Game.ClickPoint = Class.create(Sprite, {
        initialize: function () {
            Sprite.call(this, Constants.padding, Constants.padding);
            
//            this.backgroundColor = "white";
        }
    });
    
    Game.ClickPoint.prototype.reset = function () {
        this.x = 0;
        this.y = 0;
    };
    
    
    // TILE -----------------------------------------------------------
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
    
    
    // NEXT PIECE DISPLAY ---------------------------------------------
    Game.NextPiecesDisplay = Class.create(Group, {
        initialize: function (images) {
            Group.call(this);
            var i, temp;
            
            this.tileActive = false;
            this.newType = 0;
            
            this.bg = new GameUI.Background("center");
            
            this.tiles = [];
            for (i = 0; i < Constants.numberOfChoices; i++) {
                temp = new Tile(images.tiles, Constants.tilesize);
                temp.x = this.bg.x + (Constants.padding * (i + 1)) + (i * Constants.tilesize);
                temp.y = this.bg.y + Constants.padding;
                this.tiles.push(temp);
            }
            
            this.clickHere = new GameUI.ClickHere(this, images.centerui);
        }
    });
    
    Game.NextPiecesDisplay.prototype.addGraphicsToScene = function (scene) {
        var i;
        scene.addChild(this.clickHere.chBack);
        scene.addChild(this.clickHere.chFront);
        scene.addChild(this.bg);
        for (i = 0; i < this.tiles.length; i++) {
            scene.addChild(this.tiles[i]);
        }
    };
    
    Game.NextPiecesDisplay.prototype.generateTiles = function () {
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
    
    Game.NextPiecesDisplay.prototype.selectTile = function (num) {
        this.tiles[num].active = true;
        this.tileActive = true;
        this.newType = this.tiles[num].type;
        console.info("active tile " + num);
    };
    
    Game.NextPiecesDisplay.prototype.markSelectable = function () {
        this.clickHere.makeVisible();
    };
    
    Game.NextPiecesDisplay.prototype.markUnselectable = function () {
        this.clickHere.makeInvisible();
    };
    
    
    // SCOREBOARD -----------------------------------------------------
    Game.Scoreboard = Class.create(Group, {
        initialize: function () {
            Group.call(this);
            
            this.score = 0;
            
            this.scoreDisplay = new GameUI.Background("left");
            this.scoreDisplay.font = "170px arial,sans-serif";
            this.scoreDisplay.textAlign = "center";
            this.scoreDisplay.color = "white";
            this.scoreDisplay.text = 0;
            
            this.title = new GameUI.Title("SCORE", "left");
        }
    });
    
    Game.Scoreboard.prototype.addGraphicsToScene = function (scene) {
        scene.addChild(this.scoreDisplay);
        scene.addChild(this.title);
    };
    
    Game.Scoreboard.prototype.update = function (points) {
        this.score += points;
        this.scoreDisplay.text = this.score;
    };
    
    
    // NEXT TARGET ----------------------------------------------------
    Game.NextTarget = Class.create(Sprite, {
        initialize: function (images, xCoord, yCoord) {
            Sprite.call(this, Constants.cdisplayWidth, Constants.cdisplayHeight);
            
            this.image = images.square;
            this.x = xCoord;
            this.y = yCoord;
        }
    });
    
    Game.NextTarget.prototype.changeImage = function (newImg) {
        this.image = newImg;
    };
    
    
    // TARGET DISPLAY -------------------------------------------------
    Game.TargetDisplay = Class.create(Group, {
        initialize: function (images, shapeList, targetOptions) {
            Group.call(this);
            
            var i;
            
            this.images = images;
            this.bg = new GameUI.Background("right");
            this.title = new GameUI.Title("MAKE THIS", "right");
            
            this.possibleTargets = [];
            for (i = targetOptions.startIndex; i < targetOptions.numberOfPatterns; i++) {
                this.possibleTargets.push({
                    shapeObject: shapeList[i],
                    imgFile: this.images[shapeList[i].img]
                });
            }
            this.target = 0;
            this.targetUpdated = false;
            
            this.nextTarget = new Game.NextTarget(this.images, this.bg.x, this.bg.y);
        }
    });
    
    Game.TargetDisplay.prototype.addGraphicsToScene = function (scene) {
        scene.addChild(this.bg);
        scene.addChild(this.title);
        scene.addChild(this.nextTarget);
    };
    
    Game.TargetDisplay.prototype.generateNextTarget = function () {
        this.target = Math.floor(Math.random() * this.possibleTargets.length);
        this.targetUpdated = true;
    };
    
    Game.TargetDisplay.prototype.update = function () {
        var possibleTargets = this.possibleTargets;
        var i = this.target;
        this.nextTarget.changeImage(possibleTargets[i].imgFile);
        this.targetUpdated = false;
    };
    
    Game.TargetDisplay.prototype.getCurrentTarget = function () {
        var temp = this.possibleTargets[this.target];
        return temp;
    };
    
    
    // BOARD ----------------------------------------------------------
    Game.Board = Class.create(Group, {
        initialize: function (images, options) {
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
                    temp = new Tile(images.tiles, Constants.tilesize);
                    temp.x = Constants.boardx + (j * Constants.tilesize) - ((this.cols - 1) - (Constants.padding * j));
                    temp.y = Constants.boardy + (i * Constants.tilesize) - ((this.rows - 1) - (Constants.padding * i));
                    this.tiles.push(temp);
                }
            }
            
            this.bg = new GameUI.Background("board");
            this.bg.setCoords(this.tiles[0].x, this.tiles[0].y);
            this.clickHere = new GameUI.ClickHere(this, images.boardui);
            this.clickHere.makeInvisible();
        }
    });
    
    Game.Board.prototype.addGraphicsToScene = function (scene) {
        var i;
        scene.addChild(this.clickHere.chBack);
        scene.addChild(this.clickHere.chFront);
        scene.addChild(this.bg);
        for (i = 0; i < this.tiles.length; i++) {
            scene.addChild(this.tiles[i]);
        }
    };
    
    Game.Board.prototype.placeTile = function (i, newType) {
        this.tiles[i].change(newType);
        this.markUnselectable();
    };
    
    // returns object with two fields representing the number
    // of points to add and an array of tiles to be removed from
    // the board
    Game.Board.prototype.checkState = function (currentTarget) {
        var tilesToRemove, pts, shapeFound;
        tilesToRemove = this.checkForShapes(currentTarget);
        pts = this.calculatePoints(tilesToRemove);
        if (pts > 0) {
            shapeFound = true;
        } else {
            shapeFound = false;
        }
        return {
            points: pts,
            tilesToRemove: tilesToRemove.indices,
            shapeFound: shapeFound
        };
    };
    
    //returns array of tile indices to be removed from the board
    Game.Board.prototype.checkForShapes = function (currentTarget) {
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
    
    Game.Board.prototype.removeTiles = function (tilesToRemove) {
        var i;
        for (i = 0; i < tilesToRemove.length; i++) {
            this.tiles[tilesToRemove[i]].reset();
        }
    };
    
    //returns number of points to add to score
    Game.Board.prototype.calculatePoints = function (tilesToRemove) {
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
    
    Game.Board.prototype.markSelectable = function () {
        this.clickHere.makeVisible();
    };
    
    Game.Board.prototype.markUnselectable = function () {
        this.clickHere.makeInvisible();
    };
}(window.Game = window.Game || {}));
