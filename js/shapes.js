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
        square: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (((i % rw) < (rw - 1)) && (i < ((ch - 1) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + 1 + rw].type)) {
                return true;
            } else { return false; }
        },
        sTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + 1, i + rw, i + 1 + rw];
        }
    };
    
    var straight = {
        horizontal: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var rw = params.rowWidth;
            
            if (((i % rw) < (rw - 3)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 2].type) && (tiles[i].type === tiles[i + 3].type)) {
                return true;
            } else { return false; }
        },
        //
        hTiles: function (params) {
            var i = params.ii;
            return [i, i + 1, i + 2, i + 3];
        },
        
        vertical: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if ((i < ((ch - 3) * rw)) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + (2 * rw)].type) && (tiles[i].type === tiles[i + (3 * rw)].type)) {
                return true;
            } else { return false; }
        },
        vTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + rw, i + (2 * rw), i + (3 * rw)];
        }
    };
    
    
    var zblock = {
        horizontal: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (((i % rw) < (rw - 2)) && (i < ((ch - 1) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 1 + rw].type) && (tiles[i].type === tiles[i + 2 + rw].type)) {
                return true;
            } else { return false; }
        },
        //
        hTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + 1, i + 1 + rw, i + 2 + rw];
        },
        
        vertical: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (((i % rw) > 0) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i - 1 + rw].type) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i - 1 + (2 * rw)].type)) {
                return true;
            } else { return false; }
        },
        vTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i - 1 + rw, i + rw, i - 1 + (2 * rw)];
        }
    };
    
    
    var sblock = {
        horizontal: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (((i % rw) < (rw - 2)) && (i >= rw) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 1 - rw].type) && (tiles[i].type === tiles[i + 2 - rw].type)) {
                return true;
            } else { return false; }
        },
        //
        hTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + 1, i + 1 - rw, i + 2 - rw];
        },
        
        vertical: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (((i % rw) < (rw - 1)) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + 1 + rw].type) && (tiles[i].type === tiles[i + 1 + (2 * rw)].type)) {
                return true;
            } else { return false; }
        },
        vTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + rw, i + 1 + rw, i + 1 + (2 * rw)];
        }
    };
    
    
    var lgun = {
        //barrel pointing left, etc.
        left: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (((i % rw) < (rw - 2)) && (i < ((ch - 1) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 2].type) && (tiles[i].type === tiles[i + 2 + rw].type)) {
                return true;
            } else { return false; }
        },
        lTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + 1, i + 2, i + 2 + rw];
        },
        
        up: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (((i % rw) > 0) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + (2 * rw)].type) && (tiles[i].type === tiles[i + (2 * rw) - 1].type)) {
                return true;
            } else { return false; }
        },
        uTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + rw, i + (2 * rw), i + (2 * rw) - 1];
        },
        
        right: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (((i % rw) < (rw - 2)) && (i < ((ch - 1) * rw)) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + 1 + rw].type) && (tiles[i].type === tiles[i + 2 + rw].type)) {
                return true;
            } else { return false; }
        },
        rTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + rw, i + 1 + rw, i + 2 + rw];
        },
        
        down: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (((i % rw) < (rw - 1)) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + (2 * rw)].type)) {
                return true;
            } else { return false; }
        },
        dTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + 1, i + rw, i + (2 * rw)];
        }
    };
    
    
    var rgun = {
        //barrel pointing left, etc.
        left: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (((i % rw) < (rw - 2)) && (i >= rw) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 2].type) && (tiles[i].type === tiles[i + 2 - rw].type)) {
                return true;
            } else { return false; }
        },
        lTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + 1, i + 2, i + 2 - rw];
        },
        
        up: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (((i % rw) < (rw - 1)) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + (2 * rw)].type) && (tiles[i].type === tiles[i + (2 * rw) + 1].type)) {
                return true;
            } else { return false; }
        },
        uTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + rw, i + (2 * rw), i + (2 * rw) + 1];
        },
        
        right: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (((i % rw) < (rw - 2)) && (i < ((ch - 1) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 2].type) && (tiles[i].type === tiles[i + rw].type)) {
                return true;
            } else { return false; }
        },
        rTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + 1, i + 2, i + rw];
        },
        
        down: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if (((i % rw) < (rw - 1)) && (i < ((ch - 2) * rw)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 1 + rw].type) && (tiles[i].type === tiles[i + 1 + (2 * rw)].type)) {
                return true;
            } else { return false; }
        },
        dTiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + 1, i + 1 + rw, i + 1 + (2 * rw)];
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
        var i = params.ii;
        var testTile = params.tileList[i];
        
        if (testTile.type === 0) {
            return returnObj;
        } else if (square.square(params)) {
            returnObj.tilesToRemove.indices = square.sTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (straight.horizontal(params)) {
            returnObj.tilesToRemove.indices = straight.hTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (straight.vertical(params)) {
            returnObj.tilesToRemove.indices = straight.vTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (zblock.horizontal(params)) {
            returnObj.tilesToRemove.indices = zblock.hTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (zblock.vertical(params)) {
            returnObj.tilesToRemove.indices = zblock.vTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (sblock.horizontal(params)) {
            returnObj.tilesToRemove.indices = sblock.hTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (sblock.vertical(params)) {
            returnObj.tilesToRemove.indices = sblock.vTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (lgun.left(params)) {
            returnObj.tilesToRemove.indices = lgun.lTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (lgun.up(params)) {
            returnObj.tilesToRemove.indices = lgun.uTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (lgun.right(params)) {
            returnObj.tilesToRemove.indices = lgun.rTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (lgun.down(params)) {
            returnObj.tilesToRemove.indices = lgun.dTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (rgun.left(params)) {
            returnObj.tilesToRemove.indices = rgun.lTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (rgun.up(params)) {
            returnObj.tilesToRemove.indices = rgun.uTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (rgun.right(params)) {
            returnObj.tilesToRemove.indices = rgun.rTiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (rgun.down(params)) {
            returnObj.tilesToRemove.indices = rgun.dTiles(params);
            returnObj.flagForRemoval(testTile.type);
        }
        
        return returnObj;
    };
}(window.Shapes = window.Shapes || {}));