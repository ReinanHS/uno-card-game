import CardDeck from "../../Objetcs/Entities/Cards/CardDeck";
import DeckSprite from "../../../view/sprites/cards/DeckSprite";
import SelectedCardSprite from "../../../view/sprites/cards/SelectedCardSprite";
import Player from "../../Objetcs/Entities/Player/Player";
import HandCardList from "../../Objetcs/Entities/Player/HandCardList";
import PlayerRoundIterator from "../../Objetcs/Entities/Player/PlayerRoundIterator";
import Sprite = Phaser.GameObjects.Sprite;
import Text = Phaser.GameObjects.Text;
import Image = Phaser.GameObjects.Image;

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
    protected selectedCardSprite: SelectedCardSprite;

    private readonly _cardSize: number = 0.2;
    private midCircle: Sprite;

    private playerRoundIterator: PlayerRoundIterator;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.widthScreen = this.scene.sys.game.canvas.width;
        this.heightScreen = this.scene.sys.game.canvas.height;
    }

    public start(): void {
        this.cardDeck.shuffle();
        this.playerRoundIterator = new PlayerRoundIterator(this.createPlayers());

        this.playerRoundIterator.players.map((player: Player, index: number) => {
            this.scene.load.image(`player_user_photo_${index}`, player.picture);
        });
    }

    public create(): void {
        this.midCircle = this.scene.add.sprite(this.widthScreen / 2 + 24, this.heightScreen / 2 + 15, 'white-circle');
        this.midCircle.setScale(1.4);

        this.createCardsUnderDeck();

        let shadow = this.scene.add.sprite((this.widthScreen / 2 + 80) + 3, (this.heightScreen / 2 + 15) + 3, 'Deck');
        shadow.tint = 0x000000;
        shadow.alpha = 0.6;
        shadow.setScale(this._cardSize);

        this.selectedCardSprite = new SelectedCardSprite(this.scene, this.widthScreen / 2 + 80, this.heightScreen / 2 + 15, this.cardDeck.cards[0]);
        this.selectedCardSprite.setScale(this._cardSize);


        this.playerRoundIterator.players.map((player: Player, index: number) => {

            let cardPositionX, cardPositionY, cardRotation = 0;
            let uiPositionX, uiPositionY;

            if (index === 0) {
                cardPositionX = this.widthScreen / 2;
                cardPositionY = this.heightScreen - 80;
                cardRotation = 0;

                uiPositionX = 140;
                uiPositionY = this.heightScreen - 40;

            } else if (index === 1) {
                cardPositionX = this.widthScreen / 2;
                cardPositionY = 80;
                cardRotation = 0;

                uiPositionX = this.widthScreen - 100;
                uiPositionY = 40;

            } else if (index === 2) {
                cardPositionX = this.widthScreen - 80;
                cardPositionY = this.heightScreen / 2;
                cardRotation = 90;

                uiPositionX = this.widthScreen - 80;
                uiPositionY = this.heightScreen - 40;

            } else if (index === 3) {
                cardPositionX = 110;
                cardPositionY = this.heightScreen / 2;
                cardRotation = 270;

                uiPositionX = 140;
                uiPositionY = 40;

            }

            let playerText: Text = this.scene.make.text({
                x: uiPositionX,
                y: uiPositionY,
                text: player.name,
                style: {
                    font: '20px monospace',
                }
            });

            playerText.setOrigin(0.5, 0.5);
            let playerImage: Image = this.scene.add.image(uiPositionX - 80, uiPositionY, `player_user_photo_${index}`);
            playerImage.setScale(0.1);

            let card: Sprite = this.scene.add.sprite(cardPositionX, cardPositionY, 'Deck');
            card.setAngle(cardRotation);
            card.setScale(this._cardSize);
        });
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

            let shadow: Sprite = this.scene.add.sprite(cardPositionX + 3, cardPositionY + 3, 'Deck');
            shadow.tint = 0x000000;
            shadow.alpha = 0.6;
            shadow.setScale(this._cardSize);

            if (i == 1) {
                this.deckSprite = new DeckSprite(this.scene, cardPositionX, cardPositionY);
                this.deckSprite.setScale(this._cardSize);
            } else {
                this.scene.add.sprite(cardPositionX, cardPositionY, 'Deck').setScale(this._cardSize);
            }
        }
    }

    private createPlayers(): Array<Player> {
        let playersArray: Array<Player> = new Array<Player>();

        for (let i = 0; i < 4; i++) {
            let handCard: HandCardList = new HandCardList();

            this.cardDeck.cards.splice(0, 7).map(c => {
                handCard.addCard(c);
            });

            this.cardDeck.cards = this.cardDeck.cards.splice(7, this.cardDeck.cards.length);

            playersArray.push(new Player(`Player ${i}`, 'https://i1.wp.com/terracoeconomico.com.br/wp-content/uploads/2019/01/default-user-image.png', handCard));
        }

        return playersArray;
    }
}