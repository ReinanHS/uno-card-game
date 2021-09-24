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

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.widthScreen = this.scene.sys.game.canvas.width;
        this.heightScreen = this.scene.sys.game.canvas.height;
    }

    public create(): void {
        this.cardDeck.shuffle();
        this.createCardsUnderDeck();

        const deckSpritePositionX : number = this.widthScreen / 4 - (this.numberCardsUnderDeck + 25);
        const deckSpritePositionY : number = this.heightScreen / 2 - 35;

        this.deckSprite = new DeckSprite(this.scene, deckSpritePositionX, deckSpritePositionY);
        this.selectedCardSprite = new SelectedCardSprite(this.scene, this.widthScreen / 2, this.heightScreen / 2, this.cardDeck.cards[0]);
    }

    /**
     * Method for creating the cards under the deck
     * @private
     */
    private createCardsUnderDeck(): void {
        for (let i: number = 10; i > 0; i--) {
            let cardPositionX: number = (this.widthScreen / 4) - (i + Phaser.Math.Between(40, 50));
            let cardPositionY: number = this.heightScreen / 2 - 40;

            this.scene.add.sprite(cardPositionX, cardPositionY, 'Deck').setScale(0.3);
        }
    }
}