import AbstractController from "../AbstractController";
import CardDeck from "../../Objetcs/Entities/Cards/CardDeck";
import DeckSprite from "../../../view/sprites/cards/DeckSprite";
import Image = Phaser.GameObjects.Image;
import EventDispatcher from "../../Events/EventDispatcher";

export default class DeckController extends AbstractController {
    private _cardDeck : CardDeck;

    private _widthScreen : number;
    private _heightScreen : number;

    /**
     * Game Objects
     */
    private _backgroundImage : Image;
    private _midCircleImage : Image;
    private _deckSprite : DeckSprite;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public beforeCreate() : void {
        this._cardDeck = new CardDeck();
        this._cardDeck.shuffle();
    }

    public created() : void {
        this.scene.scene.systems.canvas.style.transform = 'rotateX(30deg)';

        this._widthScreen = this.scene.sys.game.canvas.width;
        this._heightScreen = this.scene.sys.game.canvas.height;

        this._backgroundImage = this.buildBackgroundImage();
        this._midCircleImage = this.buildMidCircleImage();
        this._deckSprite = this.buildDeckSprite();

        this._deckSprite.on('pointerdown', () => {
           EventDispatcher.getInstance().emit('clickDeckSprite', this._cardDeck.removeCard(), this._deckSprite.x, this._deckSprite.y);
        });
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

    public buildDeckSprite(): DeckSprite {
        const cardPositionX = this._widthScreen / 2;
        const cardPositionY = this._heightScreen / 2;

        return new DeckSprite(this.scene, cardPositionX, cardPositionY);
    }
}