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
                Event,
                Group,
                Label,
                Sprite */
                
(function (GameUI) {
    "use strict";
    
    GameUI.Title = Class.create(Label, {
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
    
    
    GameUI.Background = Class.create(Label, {
        initialize: function (location) {
            Label.call(this);
            
            if (location === "center") {
                this.width = (Constants.tilesize * Constants.numberOfChoices) + (Constants.padding * (Constants.numberOfChoices + 1));
                this.height = Constants.tilesize + (Constants.numberOfChoices * Constants.padding);
                this.backgroundColor = "black";
                this.x = (Constants.stageWidth / 2) - (this.width / 2);
                this.y = Constants.stageHeight - this.height;
            } else if (location === "board") {
                this.width = 1220;
                this.height = 812;
                this.backgroundColor = Constants.gamebgc;
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
    
    GameUI.Background.prototype.setCoords = function (xCoord, yCoord) {
        this.x = xCoord;
        this.y = yCoord;
    };
    
    
    GameUI.ClickHere = Class.create(Group, {
        initialize: function (uiElement, images) {
            Group.call(this);
            
            var xCoord = uiElement.bg.x - Constants.interactiveBorderWidth;
            var yCoord = uiElement.bg.y - Constants.interactiveBorderWidth;
            
            this.chBack = new Sprite(images.back.width, images.back.height);
            this.chBack.x = xCoord;
            this.chBack.y = yCoord;
            this.chBack.image = images.back;
            
            this.chFront = new Sprite(images.front.width, images.front.height);
            this.chFront.x = xCoord;
            this.chFront.y = yCoord;
            this.chFront.image = images.front;
            
            this.chFront.opacityDecreasing = true;
            this.chFront.addEventListener(Event.ENTER_FRAME, function () {
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
    
    GameUI.ClickHere.prototype.makeVisible = function () {
        this.chBack.visible = true;
        this.chFront.visible = true;
    };
    
    GameUI.ClickHere.prototype.makeInvisible = function () {
        this.chBack.visible = false;
        this.chFront.visible = false;
    };
}(window.GameUI = window.GameUI || {}));