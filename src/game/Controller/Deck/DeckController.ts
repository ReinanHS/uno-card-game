import AbstractController from "../AbstractController";
import CardDeck from "../../Objetcs/Entities/Cards/CardDeck";
import Image = Phaser.GameObjects.Image;

export default class DeckController extends AbstractController {
    private _cardDeck : CardDeck;

    private _widthScreen : number;
    private _heightScreen : number;

    /**
     * Game Objects
     */
    private _backgroundImage : Image;
    private _midCircleImage : Image;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public beforeCreate() : void {
        this._cardDeck = new CardDeck();
        this._cardDeck.shuffle();
    }

    public created() : void {
        this._widthScreen = this.scene.sys.game.canvas.width;
        this._heightScreen = this.scene.sys.game.canvas.height;

        this._backgroundImage = this.buildBackgroundImage();
        this._midCircleImage = this.buildMidCircleImage();
    }

    private buildBackgroundImage(): Image {
        let backgroundImage : Image = this.scene.add.image(0, 0, 'Background').setOrigin(0,0);
        backgroundImage.displayWidth = this._widthScreen;
        backgroundImage.displayHeight = this._heightScreen;

        return backgroundImage;
    }

    private buildMidCircleImage(): Image {
        let midCircleImage : Image = this.scene.add.sprite(this._widthScreen / 2 + 24, this._heightScreen / 2 + 15, 'white-circle');
        midCircleImage.setScale(1.4);

        return midCircleImage;
    }
}