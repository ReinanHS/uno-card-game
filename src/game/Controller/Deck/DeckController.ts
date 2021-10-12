import AbstractController from "../AbstractController";
import CardDeck from "../../Objetcs/Entities/Cards/CardDeck";
import DeckSprite from "../../../view/sprites/cards/DeckSprite";
import Image = Phaser.GameObjects.Image;
import EventDispatcher from "../../Events/EventDispatcher";
import Player from "../../Objetcs/Entities/Player/Player";
import Card from "../../Objetcs/Entities/Cards/Card";
import PlayerRoundIterator from "../../Objetcs/Entities/Player/PlayerRoundIterator";
import Bot from "../../Objetcs/Entities/Bot/Bot";

export default class DeckController extends AbstractController {
    private _cardDeck: CardDeck;

    private _widthScreen: number;
    private _heightScreen: number;

    /**
     * Game Objects
     */
    private _backgroundImage: Image;
    private _midCircleImage: Image;
    private _deckSprite: DeckSprite;

    private _playerRoundIterator: PlayerRoundIterator;

    private _isGamePlayStart: boolean = false;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public beforeCreate(): void {
        this._cardDeck = new CardDeck();
        this._cardDeck.shuffle();

        this._playerRoundIterator = new PlayerRoundIterator([]);
    }

    public created(): void {
        this.scene.scene.systems.canvas.style.transform = 'rotateX(30deg)';

        this._widthScreen = this.scene.sys.game.canvas.width;
        this._heightScreen = this.scene.sys.game.canvas.height;

        this._backgroundImage = this.buildBackgroundImage();
        this._midCircleImage = this.buildMidCircleImage();
        this._deckSprite = this.buildDeckSprite();

        this._deckSprite.on('pointerdown', () => {
            EventDispatcher.getInstance().emit('clickDeckSprite', this._cardDeck.removeCard(), this._deckSprite.x, this._deckSprite.y);
        });

        EventDispatcher.getInstance().on('playCard', (player: Player, card: Card) => {
            console.log(player, card);
        });

        EventDispatcher.getInstance().on('addPlayer', (player: Player) => {
            this._playerRoundIterator.players.push(player);
        });

        EventDispatcher.getInstance().on('nextPlay', () => {
            this._playerRoundIterator.nextPlayer();
            this.sendNextPlayEvent();

            return true;
        });
    }

    public update(time: number, delta: number): void {
        if (this._playerRoundIterator.players.length === 4 && !this._isGamePlayStart) {
            this._isGamePlayStart = true;
            this.addCardToPlayer();
        }
    }

    private sendNextPlayEvent(): void {
        EventDispatcher.getInstance().emit('startPlay', this._playerRoundIterator.currentPlayer);
    }

    private addCardToPlayer(index: number = 0): void {
        setTimeout(() => {
            EventDispatcher.getInstance().emit('clickDeckSprite', this._cardDeck.removeCard(), this._deckSprite.x, this._deckSprite.y);

            if (index === 5) {
                this.sendNextPlayEvent();
            }

            if (index < 6) {
                this.addCardToPlayer(index + 1);
            }

        }, 1100);
    }


    private buildBackgroundImage(): Image {
        let backgroundImage: Image = this.scene.add.image(0, 0, 'Background').setOrigin(0, 0);
        backgroundImage.displayWidth = this._widthScreen;
        backgroundImage.displayHeight = this._heightScreen;

        return backgroundImage;
    }

    private buildMidCircleImage(): Image {
        let midCircleImage: Image = this.scene.add.sprite(this._widthScreen / 2 + 24, this._heightScreen / 2 + 15, 'white-circle');
        midCircleImage.setScale(1.4);

        return midCircleImage;
    }

    public buildDeckSprite(): DeckSprite {
        const cardPositionX = this._widthScreen / 2;
        const cardPositionY = this._heightScreen / 2;

        return new DeckSprite(this.scene, cardPositionX, cardPositionY);
    }
}