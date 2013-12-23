// LD28 YOGO
// by Lena LeRay
//
// A puzzley strategy game in which the player only gets one of two
// possible pieces.

/*jslint    browser:true,
            devel:true,
            plusplus:true,
            vars:true */


(function (ShapeDefinitions) {
    "use strict";
    
    ShapeDefinitions.shapeObjectList = [];
    ShapeDefinitions.allTheOrientations = [];
    
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
    ShapeDefinitions.allTheOrientations.push(square.only);
    ShapeDefinitions.shapeObjectList.push(square);
    
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
    ShapeDefinitions.allTheOrientations.push(straight.horizontal);
    ShapeDefinitions.allTheOrientations.push(straight.vertical);
    ShapeDefinitions.shapeObjectList.push(straight);
    
    
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
    ShapeDefinitions.allTheOrientations.push(zblock.horizontal);
    ShapeDefinitions.allTheOrientations.push(zblock.vertical);
    ShapeDefinitions.shapeObjectList.push(zblock);
    
    
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
    ShapeDefinitions.allTheOrientations.push(sblock.horizontal);
    ShapeDefinitions.allTheOrientations.push(sblock.vertical);
    ShapeDefinitions.shapeObjectList.push(sblock);
    
    
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
    ShapeDefinitions.allTheOrientations.push(lgun.up);
    ShapeDefinitions.allTheOrientations.push(lgun.down);
    ShapeDefinitions.allTheOrientations.push(lgun.left);
    ShapeDefinitions.allTheOrientations.push(lgun.right);
    ShapeDefinitions.shapeObjectList.push(lgun);
    
    
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
    ShapeDefinitions.allTheOrientations.push(rgun.up);
    ShapeDefinitions.allTheOrientations.push(rgun.down);
    ShapeDefinitions.allTheOrientations.push(rgun.left);
    ShapeDefinitions.allTheOrientations.push(rgun.right);
    ShapeDefinitions.shapeObjectList.push(rgun);
    
    
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
    ShapeDefinitions.allTheOrientations.push(tblock.up);
    ShapeDefinitions.allTheOrientations.push(tblock.down);
    ShapeDefinitions.allTheOrientations.push(tblock.left);
    ShapeDefinitions.allTheOrientations.push(tblock.right);
    ShapeDefinitions.shapeObjectList.push(tblock);
}(window.ShapeDefinitions = window.ShapeDefinitions || {}));
