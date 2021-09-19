import CardDeck from "../objects/card/CardDeck";
import Sprite = Phaser.GameObjects.Sprite;

export default class MainScene extends Phaser.Scene {

    constructor() {
        super({
            key: "MainScene",
        });
    }

    public create(){
        let { width, height } = this.sys.game.canvas;
        console.log("create main")

        let cardDeck : CardDeck = new CardDeck();
        cardDeck.cards = Phaser.Utils.Array.Shuffle(cardDeck.cards);

        const limitDeck : number = 10;

        for (let i : number = 10; i > 0; i--) {
            this.add
                .sprite((width/4) - (i + Phaser.Math.Between(40,50)),height/2 - 40, 'Deck')
                .setScale(0.3);
        }

        const deck : Sprite = this.add
            .sprite(width/4 - (limitDeck+25),height/2 - 35, 'Deck')
            .setScale(0.3)
            .setInteractive({
                cursor: 'pointer'
            });

        const floppyStack : Sprite = this.add
            .sprite(width/2,height/2, cardDeck.cards[0].key)
            .setScale(0.3);
    }
}