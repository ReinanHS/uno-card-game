import Text = Phaser.GameObjects.Text;
import Image = Phaser.GameObjects.Image;

export default class PlayerGui {
    private _textName : Text;
    private _photo: Image;

    constructor(textName: Phaser.GameObjects.Text, photo: Phaser.GameObjects.Image) {
        this._textName = textName;
        this._photo = photo;
    }

    get textName(): Phaser.GameObjects.Text {
        return this._textName;
    }

    set textName(value: Phaser.GameObjects.Text) {
        this._textName = value;
    }

    get photo(): Phaser.GameObjects.Image {
        return this._photo;
    }

    set photo(value: Phaser.GameObjects.Image) {
        this._photo = value;
    }
}