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
            
            if (((i % rw) < 3) && (tiles[i].type === tiles[i + 1].type) && (tiles[i].type === tiles[i + 2].type) && (tiles[i].type === tiles[i + 3].type)) {
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
            var r = params.rowWidth;
            return [i, i + r, i + (2 * r), i + (3 * r)];
        }
    };
    
    // returns object with two fields indicating whether or not to remove
    // tiles and if so which ones
    Shapes.checkALLtheShapes = function (params) {
        var temp = {
            needToRemove: false,
            tilesToRemove: []
        };
        var i = params.ii;
        var testTile = params.tileList[i];
        
        if (testTile.type === 0) {
            return temp;
        } else if (straight.horizontal(params)) {
            temp.needToRemove = true;
            temp.tilesToRemove = straight.htiles(params);
        } else if (straight.vertical(params)) {
            temp.needToRemove = true;
            temp.tilesToRemove = straight.vtiles(params);
        }
        
        return temp;
    };
}(window.Shapes = window.Shapes || {}));