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

/*
var tiles = params.tileList;
var i = params.ii;
var ch = params.colHeight;
var rw = params.rowWidth;
*/

(function (Shapes) {
    "use strict";
    
    // All shape objects assume 4+ rows and 6+ columns.
    // Each shape has a boolean function for each possible orientation.
    // Each shape has a function which returns an array of tile indices.
    
    var square = {
        test: function (tiles, i, ch, rw) {
            return (((i % rw) < (rw - 1)) && (i < ((ch - 1) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + 1 + rw].type));
        },
        pattern: function (i, rw) {
            return [i, i + 1, i + rw, i + 1 + rw];
        }
    };
    
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
        }
    };
    
    
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
        }
    };
    
    
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
        }
    };
    
    
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
        }
    };
    
    
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
        }
    };
    
    
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
        }
    };
    
    var allTheShapes = [
        square,
        straight.horizontal,
        straight.vertical,
        zblock.horizontal,
        zblock.vertical,
        sblock.horizontal,
        sblock.vertical,
        lgun.down,
        lgun.left,
        lgun.right,
        lgun.up,
        rgun.down,
        rgun.left,
        rgun.right,
        rgun.up,
        tblock.down,
        tblock.left,
        tblock.right,
        tblock.up
    ];
    
    
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
    
    Shapes.noTilesToRemove = function () {
        var temp = new ReturnObject();
        return temp.tilesToRemove;
    };
    
    // returns object with three fields indicating whether or not to remove
    // tiles, if so which ones, and their type.
    Shapes.checkALLtheShapes = function (params) {
        var returnObj = new ReturnObject();
        var i;
        var testTile = params.tileList[params.ii];
        
        if (testTile.type === 0) {
            return returnObj;
        } else {
            for (i = 0; i < allTheShapes.length; i++) {
                if(shapeCheck.test(params, allTheShapes[i])) {
                    returnObj.tilesToRemove.indices = shapeCheck.returnValues(params, allTheShapes[i]);
                    returnObj.flagForRemoval(testTile.type);
                }
            }
        }
        
        return returnObj;
    };
}(window.Shapes = window.Shapes || {}));