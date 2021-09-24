export default class DeckSprite extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'Deck');

        scene.add.existing(this);
        this.setScale(0.3);
        this.setInteractive({
            cursor: 'pointer'
        });
    }
}