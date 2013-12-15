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
    
    // bool
    Shapes.straight = function (tilelist, i) {
        var type = tilelist[i].type;
        if ((type === tilelist[i + 1].type) && (type === tilelist[i + 2].type) && (type === tilelist[i + 3].type)) {
            return true;
        } else { return false; }
    };
}(window.Shapes = window.Shapes || {}));