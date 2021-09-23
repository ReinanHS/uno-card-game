import CardDeck from "../../game/Objetcs/Entities/Cards/CardDeck";
import Sprite = Phaser.GameObjects.Sprite;

export default class MainScene extends Phaser.Scene {
    public cardDeck : CardDeck = new CardDeck();

    constructor() {
        super({
            key: "MainScene",
        });

        this.cardDeck.shuffle();
    }

    public create(): void {
        let {width, height} = this.sys.game.canvas;

        const limitDeck: number = 10;

        for (let i: number = 10; i > 0; i--) {
            this.add
                .sprite((width / 4) - (i + Phaser.Math.Between(40, 50)), height / 2 - 40, 'Deck')
                .setScale(0.3);
        }

        const deck: Sprite = this.add
            .sprite(width / 4 - (limitDeck + 25), height / 2 - 35, 'Deck')
            .setScale(0.3)
            .setInteractive({
                cursor: 'pointer'
            });

        const floppyStack: Sprite = this.add
            .sprite(width / 2, height / 2, this.cardDeck.cards[0].key)
            .setScale(0.3);
    }
}