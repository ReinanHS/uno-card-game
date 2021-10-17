import Sprite = Phaser.GameObjects.Sprite;


export default class DeckSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'Deck');
        this.setScale(0.2);
        this.setInteractive({
            cursor: 'pointer'
        });

        this.buildCards(scene);

        scene.add.existing(this);
    }

    private buildCards(scene: Phaser.Scene): void {
        for (let i: number = 7; i > 0; i--) {
            let shadow: Sprite = scene.add.sprite(this.x + 3, this.y + (4 * i) + 3, 'Deck');
            shadow.tint = 0x000000;
            shadow.alpha = 0.6;
            shadow.setScale(this.scale);

            scene.add.sprite(this.x, this.y + (4 * i), 'Deck').setScale(this.scale);
        }
    }
}