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
    
    var straight = {
        //returns a boolean value
        horizontal: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var rw = params.rowWidth;
            
            if (((i % rw) < (rw - 3)) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 2].type) && (tiles[i].type === tiles[i + 3].type)) {
                return true;
            } else { return false; }
        },
        //
        htiles: function (params) {
            var i = params.ii;
            return [i, i + 1, i + 2, i + 3];
        },
        
        //returns a boolean value
        //assumes at least 4 rows
        vertical: function (params) {
            var tiles = params.tileList;
            var i = params.ii;
            var ch = params.colHeight;
            var rw = params.rowWidth;
            
            if ((i < ((ch - 3) * rw)) && (tiles[i].type === tiles[i + rw].type) && (tiles[i].type === tiles[i + (2 * rw)].type) && (tiles[i].type === tiles[i + (3 * rw)].type)) {
                return true;
            } else { return false; }
        },
        vtiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + rw, i + (2 * rw), i + (3 * rw)];
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
        ltiles: function (params) {
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
        utiles: function (params) {
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
        rtiles: function (params) {
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
        dtiles: function (params) {
            var i = params.ii;
            var rw = params.rowWidth;
            return [i, i + 1, i + rw, i + (2 * rw)];
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
        // straight block
        } else if (straight.horizontal(params)) {
            returnObj.tilesToRemove.indices = straight.htiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (straight.vertical(params)) {
            returnObj.tilesToRemove.indices = straight.vtiles(params);
            returnObj.flagForRemoval(testTile.type);
        //lgun block
        } else if (lgun.left(params)) {
            returnObj.tilesToRemove.indices = lgun.ltiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (lgun.up(params)) {
            returnObj.tilesToRemove.indices = lgun.utiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (lgun.right(params)) {
            returnObj.tilesToRemove.indices = lgun.rtiles(params);
            returnObj.flagForRemoval(testTile.type);
        } else if (lgun.down(params)) {
            returnObj.tilesToRemove.indices = lgun.dtiles(params);
            returnObj.flagForRemoval(testTile.type);
        }
        
        return returnObj;
    };
}(window.Shapes = window.Shapes || {}));