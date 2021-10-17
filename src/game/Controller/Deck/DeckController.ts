import AbstractController from "../AbstractController";
import CardDeck from "../../Objetcs/Entities/Cards/CardDeck";
import DeckSprite from "../../../view/sprites/cards/DeckSprite";
import EventDispatcher from "../../Events/EventDispatcher";
import Player from "../../Objetcs/Entities/Player/Player";
import Card from "../../Objetcs/Entities/Cards/Card";
import PlayerRoundIterator from "../../Objetcs/Entities/Player/PlayerRoundIterator";
import Image = Phaser.GameObjects.Image;
import CardSprite from "../../../view/sprites/cards/CardSprite";
import Layer = Phaser.GameObjects.Layer;

export default class DeckController extends AbstractController {
    private _cardDeck: CardDeck;

    /**
     * Game Objects
     */
    private _backgroundImage: Image;
    private _midCircleImage: Image;
    private _deckSprite: DeckSprite;
    private _startCardSprite : CardSprite;
    private _selectCard : Card;
    private _cardOffDeck: Array<CardSprite> = new Array<CardSprite>();

    private _layerBackground: Layer;
    private _layerCards: Layer;

    private _playerRoundIterator: PlayerRoundIterator;
    private _isGamePlayStart: boolean = false;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    /**
     * Method called when creating controller
     */
    public beforeCreate(): void {
        this._cardDeck = new CardDeck();
        this._cardDeck.shuffle();

        this._playerRoundIterator = new PlayerRoundIterator([]);
    }

    /**
     * Method for adding events
     * @private
     */
    protected callEvents(): void {
        this._deckSprite.on('pointerdown', () => {
            EventDispatcher.getInstance().emit('clickDeckSprite', this._cardDeck.removeCard(), this._deckSprite.x, this._deckSprite.y);
        });

        EventDispatcher.getInstance().on('playCard', (player: Player, card: Card) => {
            console.log(player, card);
        });

        EventDispatcher.getInstance().on('addPlayer', (player: Player) => {
            this._playerRoundIterator.players.push(player);
        });

        EventDispatcher.getInstance().on('endPlay', (player: Player, cardSprite : CardSprite) => {
            if(cardSprite !== undefined && cardSprite !== null){
                this._cardOffDeck.push(cardSprite);
                this._layerCards.add(cardSprite);
                cardSprite.setDepth(this._cardOffDeck.length);

                console.log(this._cardOffDeck.map((c) => c.card));
            }

            this._playerRoundIterator.nextPlayer();
            this.callPlayerToPlay();

            return true;
        });
    }

    /**
     * Method for creating the elements
     * @private
     */
    protected buildElements(): void {
        this._layerBackground = this.scene.add.layer();
        this._layerCards = this.scene.add.layer();

        this._backgroundImage = this.buildBackgroundImage();
        this._midCircleImage = this.buildMidCircleImage();
        this._deckSprite = this.buildDeckSprite();
        this._startCardSprite = this.buildStartCardSprite();
    }

    /**
     * Method for creating the on-screen elements
     */
    public created(): void {
        super.created();

        this._layerBackground.add(this._backgroundImage);
        this._layerBackground.add(this._midCircleImage);

        this._layerCards.add(this._deckSprite);
        this._layerCards.add(this._startCardSprite);

        this.scene.scene.systems.canvas.style.transform = 'rotateX(30deg)';
    }

    /**
     * Method that is called on each frame
     * @param time
     * @param delta
     */
    public update(time: number, delta: number): void {
        if (this._playerRoundIterator.players.length === 4 && this._isGamePlayStart) {
            this._isGamePlayStart = false;
            this.addCardsToAllPlayers().then(() => {
                this.callPlayerToPlay();
            });
        }
    }

    /**
     * Method for calling the next player to play
     * @private
     */
    private callPlayerToPlay(): boolean {
        return EventDispatcher.getInstance().emit('startPlay', this._playerRoundIterator.currentPlayer, this._selectCard, this._startCardSprite.x, this._startCardSprite.y, this._layerCards);
    }

    /**
     * Method for adding starting cards for players
     * @param limitCards
     * @private
     */
    private async addCardsToAllPlayers(limitCards: number = 7): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            for (let player of this._playerRoundIterator.players) {
                await this.addStartCards(player, limitCards);
            }

            resolve(true);
        });
    }

    /**
     * Method for adding starting cards for a player
     * @param player
     * @param limitCards
     * @param index
     * @private
     */
    private async addStartCards(player: Player, limitCards: number, index: number = 0): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await this.addCardToPlayer(player);

            if (index < limitCards) {
                const result: boolean = await this.addStartCards(player, limitCards, index + 1);

                resolve(result);
            }

            resolve(true);
        });
    }

    /**
     * Method for adding player cards
     * @param player
     * @private
     */
    private async addCardToPlayer(player: Player): Promise<CardSprite> {

        return new Promise((resolve, reject) => {
            const isEventDispatche: boolean = EventDispatcher.getInstance()
                .emit('clickDeckSprite', player, this._cardDeck.removeCard(), this._deckSprite.x, this._deckSprite.y);

            if (isEventDispatche) {

                EventDispatcher.getInstance().on('addCardFinished', (player: Player, cardSprite: CardSprite) => {
                    return resolve(cardSprite);
                });

            } else {
                reject();
            }
        });
    }

    /**
     * Method for creating the desktop background image
     * @private
     */
    private buildBackgroundImage(): Image {
        let backgroundImage: Image = this.scene.add.image(0, 0, 'Background').setOrigin(0, 0);
        backgroundImage.displayWidth = this._widthScreen;
        backgroundImage.displayHeight = this._heightScreen;

        return backgroundImage;
    }

    /**
     * Method for creating the circle in the middle of the table
     * @private
     */
    private buildMidCircleImage(): Image {
        let midCircleImage: Image = this.scene.add.sprite(this._widthScreen / 2 + 24, this._heightScreen / 2 + 15, 'white-circle');
        midCircleImage.setScale(1.4);

        return midCircleImage;
    }

    /**
     * Method for creating the deck
     */
    public buildDeckSprite(): DeckSprite {
        const cardPositionX = (this._widthScreen / 2) - 40;
        const cardPositionY = this._heightScreen / 2;

        return new DeckSprite(this.scene, cardPositionX, cardPositionY);
    }

    /**
     * Method for creating the initial letter
     * @private
     */
    private buildStartCardSprite(): CardSprite {
        this._selectCard = this._cardDeck.removeCard();
        let cardSprite = new CardSprite(this.scene, this._deckSprite.x, this._deckSprite.y, this._selectCard);
        this._cardOffDeck.push(cardSprite);

        this.scene.tweens.add({
            targets: cardSprite,
            x: this._deckSprite.x + 130,
            y: this._deckSprite.y + 28,
            ease: 'Power1',
            duration: 500,
            onComplete: () => {
                this._isGamePlayStart = true;
            }
        });

        return cardSprite;
    }
}