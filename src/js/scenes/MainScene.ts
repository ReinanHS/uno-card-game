import CardDeck from "../objects/card/CardDeck";

export default class MainScene extends Phaser.Scene {

    constructor() {
        super({
            key: "MainScene",
        });
    }

    public create(){
        console.log("create main")

        let cardDeck : CardDeck = new CardDeck();
        console.log(cardDeck.cards)
    }
}