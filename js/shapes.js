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


(function (Shapes) {
    "use strict";
    
    Shapes.shapeObjectList = [];
    var allTheOrientations = [];
    
    
    // ----------------------------------------------------------------
    // BEGIN SHAPE DEFINITIONS
    // ----------------------------------------------------------------
    // All shape objects assume 4+ rows and 6+ columns.
    // Each shape has a boolean function for each possible orientation.
    // Each shape has a function which returns an array of tile indices.
    // New shapes must be manually added to the allTheOrientations array.
    var square = {
        only: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 1)) && (i < ((ch - 1) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + 1 + rw].type));
            },
            pattern: function (i, rw) {
                return [i, i + 1, i + rw, i + 1 + rw];
            }
        },
        img: "square"
    };
    square.only.nonOrientedShape = square;
    allTheOrientations.push(square.only);
    Shapes.shapeObjectList.push(square);
    
    var straight = {
        horizontal: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 3)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 2].type) && (tiles[i].type === tiles[i + 3].type));
            },
            pattern: function (i, rw) {
                return [i, i + 1, i + 2, i + 3];
            }
        },
        
        vertical: {
            test: function (tiles, i, ch, rw) {
                return ((i < ((ch - 3) * rw)) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + (2 * rw)].type) && (tiles[i].type === tiles[i + (3 * rw)].type));
            },
            pattern: function (i, rw) {
                return [i, i + rw, i + (2 * rw), i + (3 * rw)];
            }
        },
        img: "straight"
    };
    straight.horizontal.nonOrientedShape = straight;
    straight.vertical.nonOrientedShape = straight;
    allTheOrientations.push(straight.horizontal);
    allTheOrientations.push(straight.vertical);
    Shapes.shapeObjectList.push(straight);
    
    
    var zblock = {
        horizontal: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 2)) && (i < ((ch - 1) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 1 + rw].type) && (tiles[i].type === tiles[i + 2 + rw].type));
            },

            pattern: function (i, rw) {
                return [i, i + 1, i + 1 + rw, i + 2 + rw];
            }
        },
        
        vertical: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) > 0) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i - 1 + rw].type) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i - 1 + (2 * rw)].type));
            },
            pattern: function (i, rw) {
                return [i, i - 1 + rw, i + rw, i - 1 + (2 * rw)];
            }
        },
        img: "zblock"
    };
    zblock.horizontal.nonOrientedShape = zblock;
    zblock.vertical.nonOrientedShape = zblock;
    allTheOrientations.push(zblock.horizontal);
    allTheOrientations.push(zblock.vertical);
    Shapes.shapeObjectList.push(zblock);
    
    
    var sblock = {
        horizontal: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 2)) && (i >= rw) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 1 - rw].type) && (tiles[i].type === tiles[i + 2 - rw].type));
            },
            
            pattern: function (i, rw) {
                return [i, i + 1, i + 1 - rw, i + 2 - rw];
            }
        },
        
        vertical:  {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 1)) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + 1 + rw].type) && (tiles[i].type === tiles[i + 1 + (2 * rw)].type));
            },
            pattern: function (i, rw) {
                return [i, i + rw, i + 1 + rw, i + 1 + (2 * rw)];
            }
        },
        img: "sblock"
    };
    sblock.horizontal.nonOrientedShape = sblock;
    sblock.vertical.nonOrientedShape = sblock;
    allTheOrientations.push(sblock.horizontal);
    allTheOrientations.push(sblock.vertical);
    Shapes.shapeObjectList.push(sblock);
    
    
    var lgun = {
        //barrel pointing left, etc.
        left: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 2)) && (i < ((ch - 1) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 2].type) && (tiles[i].type === tiles[i + 2 + rw].type));
            },
            pattern: function (i, rw) {
                return [i, i + 1, i + 2, i + 2 + rw];
            }
        },
        
        up: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) > 0) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + (2 * rw)].type) && (tiles[i].type === tiles[i + (2 * rw) - 1].type));
            },
            pattern: function (i, rw) {
                return [i, i + rw, i + (2 * rw), i + (2 * rw) - 1];
            }
        },
        
        right: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 2)) && (i < ((ch - 1) * rw)) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + 1 + rw].type) && (tiles[i].type === tiles[i + 2 + rw].type));
            },
            pattern: function (i, rw) {
                return [i, i + rw, i + 1 + rw, i + 2 + rw];
            }
        },
        
        down: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 1)) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + (2 * rw)].type));
            },
            pattern: function (i, rw) {
                return [i, i + 1, i + rw, i + (2 * rw)];
            }
        },
        img: "lgun"
    };
    lgun.up.nonOrientedShape = lgun;
    lgun.down.nonOrientedShape = lgun;
    lgun.left.nonOrientedShape = lgun;
    lgun.right.nonOrientedShape = lgun;
    allTheOrientations.push(lgun.up);
    allTheOrientations.push(lgun.down);
    allTheOrientations.push(lgun.left);
    allTheOrientations.push(lgun.right);
    Shapes.shapeObjectList.push(lgun);
    
    
    var rgun = {
        //barrel pointing left, etc.
        left: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 2)) && (i >= rw) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 2].type) && (tiles[i].type === tiles[i + 2 - rw].type));
            },
            pattern: function (i, rw) {
                return [i, i + 1, i + 2, i + 2 - rw];
            }
        },
        
        up: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 1)) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + (2 * rw)].type) && (tiles[i].type === tiles[i + (2 * rw) + 1].type));
            },
            pattern: function (i, rw) {
                return [i, i + rw, i + (2 * rw), i + (2 * rw) + 1];
            }
        },
        
        right: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 2)) && (i < ((ch - 1) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 2].type) && (tiles[i].type === tiles[i + rw].type));
            },
            pattern: function (i, rw) {
                return [i, i + 1, i + 2, i + rw];
            }
        },
        
        down: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 1)) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 1 + rw].type) && (tiles[i].type === tiles[i + 1 + (2 * rw)].type));
            },
            pattern: function (i, rw) {
                return [i, i + 1, i + 1 + rw, i + 1 + (2 * rw)];
            }
        },
        img: "rgun"
    };
    rgun.up.nonOrientedShape = rgun;
    rgun.down.nonOrientedShape = rgun;
    rgun.left.nonOrientedShape = rgun;
    rgun.right.nonOrientedShape = rgun;
    allTheOrientations.push(rgun.up);
    allTheOrientations.push(rgun.down);
    allTheOrientations.push(rgun.left);
    allTheOrientations.push(rgun.right);
    Shapes.shapeObjectList.push(rgun);
    
    
    var tblock = {
        //stem pointing left, etc.
        left: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) > 0) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i - 1 + rw].type) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + (2 * rw)].type));
            },
            pattern: function (i, rw) {
                return [i, i - 1 + rw, i + rw, i + (2 * rw)];
            }
        },
        
        up: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 2)) && (i >= rw) && (tiles[i].type === tiles[i + 1 - rw].type) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 2].type));
            },
            pattern: function (i, rw) {
                return [i, i + 1 - rw, i + 1, i + 2];
            }
        },
        
        right: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 1)) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + 1 + rw].type) && (tiles[i].type === tiles[i + (2 * rw)].type));
            },
            pattern: function (i, rw) {
                return [i, i + rw, i + 1 + rw, i + (2 * rw)];
            }
        },
        
        down: {
            test: function (tiles, i, ch, rw) {
                return (((i % rw) < (rw - 2)) && (i < ((ch - 1) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 1 + rw].type) && (tiles[i].type === tiles[i + 2].type));
            },
            pattern: function (i, rw) {
                return [i, i + 1, i + 1 + rw, i + 2];
            }
        },
        img: "tblock"
    };
    tblock.up.nonOrientedShape = tblock;
    tblock.down.nonOrientedShape = tblock;
    tblock.left.nonOrientedShape = tblock;
    tblock.right.nonOrientedShape = tblock;
    allTheOrientations.push(tblock.up);
    allTheOrientations.push(tblock.down);
    allTheOrientations.push(tblock.left);
    allTheOrientations.push(tblock.right);
    Shapes.shapeObjectList.push(tblock);
    
    // ----------------------------------------------------------------
    // END SHAPE DEFINITIONS
    // ----------------------------------------------------------------
    
    
    var shapeCheck = {
        test: function (params, orientedShape) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (orientedShape.test(tiles, i, ch, rw)) {
                return true;
            } else { return false; }
        },
        
        returnValues: function (params, orientedShape) {
            var i = params.ii;
            var rw = params.rowWidth;
            return orientedShape.pattern(i, rw);
        }
    };
    
    
    function ReturnObject() {
        this.needToRemove = false;
        this.tilesToRemove = {
            indices: [],
            tileType: 0
        };
    }
    
    ReturnObject.prototype.flagForRemoval = function (type) {
        this.needToRemove = true;
        this.tilesToRemove.tileType = type;
    };
    
    ReturnObject.prototype.setReturnData = function (params, orientedShape, type) {
        this.tilesToRemove.indices = shapeCheck.returnValues(params, orientedShape);
        this.flagForRemoval(type);
        
    };
    
    
    Shapes.noTilesToRemove = function () {
        var temp = new ReturnObject();
        return temp.tilesToRemove;
    };
    
    // returns object with three fields indicating whether or not to remove
    // tiles, if so which ones, and their type.
    Shapes.checkALLtheShapes = function (params, currentTarget) {
        var returnObj = new ReturnObject();
        var i;
        var testTile = params.tileList[params.ii];
        
        if (testTile.type === 0) {
            return returnObj;
        } else {
            for (i = 0; i < allTheOrientations.length; i++) {
                if ((allTheOrientations[i].nonOrientedShape === currentTarget.shapeObject) && (shapeCheck.test(params, allTheOrientations[i]))) {
                    returnObj.setReturnData(params, allTheOrientations[i], testTile.type);
                }
            }
        }
        
        return returnObj;
    };
}(window.Shapes = window.Shapes || {}));