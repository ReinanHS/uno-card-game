import Card from "../../../game/Objetcs/Entities/Cards/Card";

export default class SelectedCardSprite extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number, card : Card) {
        super(scene, x, y, card.key);

        scene.add.existing(this);
        this.setScale(0.3);
    }
}