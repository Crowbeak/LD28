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
            ShapeDefinitions*/


(function (Shapes) {
    "use strict";
    
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
            for (i = 0; i < ShapeDefinitions.allTheOrientations.length; i++) {
                if ((ShapeDefinitions.allTheOrientations[i].nonOrientedShape === currentTarget.shapeObject) && (shapeCheck.test(params, ShapeDefinitions.allTheOrientations[i]))) {
                    returnObj.setReturnData(params, ShapeDefinitions.allTheOrientations[i], testTile.type);
                }
            }
        }
        
        return returnObj;
    };
}(window.Shapes = window.Shapes || {}));
