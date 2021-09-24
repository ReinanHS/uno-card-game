import DeckController from "../../game/Controller/Deck/DeckController";

export default class MainScene extends Phaser.Scene {
    private deckController: DeckController;

    constructor() {
        super({
            key: "MainScene",
        });
    }

    public create(): void {
        this.deckController = new DeckController(this);
        this.deckController.create();
    }
}