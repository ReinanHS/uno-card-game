import Card from "../../../game/Objetcs/Entities/Cards/Card";


export default class CardSprite extends Phaser.GameObjects.Sprite {
    private _card : Card;

    constructor(scene: Phaser.Scene, x: number, y: number, card?: Card) {
        super(scene, x, y, card === null ? 'Deck' : card.key);

        scene.add.existing(this);
        this.setScale(0.2);
        this.setDepth(2);

        this._card = card;
    }

    get card(): Card {
        return this._card;
    }

    set card(value: Card) {
        this._card = value;
    }
}