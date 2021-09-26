import DeckController from "../../game/Controller/Deck/DeckController";
import Image = Phaser.GameObjects.Image;

export default class MainScene extends Phaser.Scene {
    private deckController: DeckController;
    private _backgroundImage : Image;

    constructor() {
        super({
            key: "MainScene",
        });
    }

    public create(): void {
        this.scene.systems.canvas.style.transform = 'rotateX(30deg)';

        this._backgroundImage = this.add.image(0, 0, 'Background')
            .setSize(this.scene.systems.canvas.width, this.scene.systems.canvas.height)
            .setScale(0.7)
            .setOrigin(0,0);

        this.deckController = new DeckController(this);
        this.deckController.create();
    }
}