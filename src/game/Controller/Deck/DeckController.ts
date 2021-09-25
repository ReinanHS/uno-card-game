import CardDeck from "../../Objetcs/Entities/Cards/CardDeck";
import DeckSprite from "../../../view/sprites/cards/DeckSprite";
import SelectedCardSprite from "../../../view/sprites/cards/SelectedCardSprite";

export default class DeckController {

    /**
     * Game scene
     * @protected
     */
    protected scene: Phaser.Scene;

    /**
     * Entity to handle the deck
     * @protected
     */
    protected cardDeck: CardDeck = new CardDeck();

    /**
     * Number which cards are under the deck
     * @protected
     */
    protected readonly numberCardsUnderDeck: number = 10;

    protected widthScreen: number;
    protected heightScreen: number;

    protected deckSprite: DeckSprite;
    protected selectedCardSprite : SelectedCardSprite;

    private readonly _cardSize : number = 0.2;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.widthScreen = this.scene.sys.game.canvas.width;
        this.heightScreen = this.scene.sys.game.canvas.height;
    }

    public create(): void {
        this.cardDeck.shuffle();
        this.createCardsUnderDeck();

        let shadow = this.scene.add.sprite((this.widthScreen / 2 + 80) + 3, (this.heightScreen / 2 + 15) + 3, 'Deck');
        shadow.tint = 0x000000;
        shadow.alpha = 0.6;
        shadow.setScale(this._cardSize);

        this.selectedCardSprite = new SelectedCardSprite(this.scene, this.widthScreen / 2 + 80, this.heightScreen / 2 + 15, this.cardDeck.cards[0]);
        this.selectedCardSprite.setScale(this._cardSize);
    }

    /**
     * Method for creating the cards under the deck
     * @private
     */
    private createCardsUnderDeck(): void {
        const limitCardsInUnderDeck = 4;

        let cardPositionX: number = 0;
        let cardPositionY: number = 0;

        for (let i: number = limitCardsInUnderDeck; i > 0; i--) {
            cardPositionX = this.widthScreen / 2 - 30;
            cardPositionY = ((this.heightScreen / 2) + 5) + (4 * i);

            let shadow = this.scene.add.sprite(cardPositionX + 3, cardPositionY + 3, 'Deck');
            shadow.tint = 0x000000;
            shadow.alpha = 0.6;
            shadow.setScale(this._cardSize);

            if(i == 1){
                this.deckSprite = new DeckSprite(this.scene, cardPositionX, cardPositionY);
                this.deckSprite.setScale(this._cardSize);
            } else {
                this.scene.add.sprite(cardPositionX, cardPositionY, 'Deck').setScale(this._cardSize);
            }
        }
    }
}