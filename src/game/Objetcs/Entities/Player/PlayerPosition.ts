import {OrientationPlayerEnum} from "../../Enums/Game/PlayerEnum";

export default class PlayerPosition {
    private readonly _cardPositionX: number;
    private readonly _cardPositionY: number;
    private readonly _cardRotation: number;
    private readonly _uiPositionX: number;
    private readonly _uiPositionY: number;
    private readonly _orientation: OrientationPlayerEnum;

    constructor(index: number, scene: Phaser.Scene) {
        const {width, height} = scene.sys.game.canvas;

        switch (index) {
            case 0: {
                this._cardPositionX = width / 2;
                this._cardPositionY = height - 80;
                this._cardRotation = 0;

                this._uiPositionX = 140;
                this._uiPositionY = height - 40;

                this._orientation = OrientationPlayerEnum.HORIZONTAL;

                break;
            }
            case 1: {
                this._cardPositionX = width / 2;
                this._cardPositionY = 80;
                this._cardRotation = 0;

                this._uiPositionX = width - 100;
                this._uiPositionY = 40;

                this._orientation = OrientationPlayerEnum.HORIZONTAL;

                break;
            }
            case 2: {
                this._cardPositionX = width - 80;
                this._cardPositionY = height / 2;
                this._cardRotation = 90;

                this._uiPositionX = width - 80;
                this._uiPositionY = height - 40;

                this._orientation = OrientationPlayerEnum.VERTICAL;

                break;
            }
            case 3: {
                this._cardPositionX = 110;
                this._cardPositionY = height / 2;
                this._cardRotation = 270;

                this._uiPositionX = 140;
                this._uiPositionY = 40;

                this._orientation = OrientationPlayerEnum.VERTICAL;

                break;
            }
            default: {
                throw new Error("The player limit has been reached");
            }
        }
    }

    get cardPositionX(): number {
        return this._cardPositionX;
    }

    get cardPositionY(): number {
        return this._cardPositionY;
    }

    get cardRotation(): number {
        return this._cardRotation;
    }

    get uiPositionX(): number {
        return this._uiPositionX;
    }

    get uiPositionY(): number {
        return this._uiPositionY;
    }

    get orientation(): OrientationPlayerEnum {
        return this._orientation;
    }
}