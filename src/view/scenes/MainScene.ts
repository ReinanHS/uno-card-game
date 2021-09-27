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

    public preload(): void {
        this.deckController = new DeckController(this);
        this.deckController.start();
    }

    public create(): void {
        this.scene.systems.canvas.style.transform = 'rotateX(30deg)';

        this._backgroundImage = this.add.image(0, 0, 'Background').setOrigin(0,0);

        this._backgroundImage.displayWidth = this.sys.canvas.width;
        this._backgroundImage.displayHeight = this.sys.canvas.height;

        this.deckController.create();
    }
}