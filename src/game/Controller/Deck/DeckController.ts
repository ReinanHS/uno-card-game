import CardDeck from "../../Objetcs/Entities/Cards/CardDeck";
import DeckSprite from "../../../view/sprites/cards/DeckSprite";
import SelectedCardSprite from "../../../view/sprites/cards/SelectedCardSprite";
import Player from "../../Objetcs/Entities/Player/Player";
import HandCardList from "../../Objetcs/Entities/Player/HandCardList";
import PlayerRoundIterator from "../../Objetcs/Entities/Player/PlayerRoundIterator";
import Card from "../../Objetcs/Entities/Cards/Card";
import PlayerGui from "../../Objetcs/Entities/Player/PlayerGui";
import HandCardsSpriteList from "../../Objetcs/Entities/Player/HandCardsSpriteList";
import PlayerPosition from "../../Objetcs/Entities/Player/PlayerPosition";
import CardSprite from "../../../view/sprites/cards/CardSprite";
import {OrientationPlayerEnum} from "../../Objetcs/Enums/Game/PlayerEnum";
import Sprite = Phaser.GameObjects.Sprite;
import Text = Phaser.GameObjects.Text;
import Image = Phaser.GameObjects.Image;
import NumberCard from "../../Objetcs/Entities/Cards/NumberCard";
import ActionCard from "../../Objetcs/Entities/Cards/ActionCard";
import {isWildCard} from "../../Utilitys/CardUtil";

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
    protected selectedCard: Card;

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
        this.createMidCircle();
        this.createCardsUnderDeck();
        this.createFirstCardGame();
        this.renderPlayersGui();

        this.playerRoundIterator.players.map((player: Player, index: number) => {
            let handCardSprite: HandCardsSpriteList = new HandCardsSpriteList();

            player.handCards.map((card, index) => {

                const isHorizontal: boolean = player.positions.orientation.valueOf() == OrientationPlayerEnum.HORIZONTAL;

                const spaceInCards = 200 / player.handCards.length;
                let positionX = player.positions.cardPositionX + (isHorizontal ? index * spaceInCards : 0);
                let positionY = player.positions.cardPositionY + (!isHorizontal ? index * spaceInCards : 0);

                let cardSprite: CardSprite = new CardSprite(this.scene, positionX, positionY, card);
                cardSprite.setAngle(player.positions.cardRotation);

                if (player.isActive) {
                    cardSprite.setInteractive({
                        cursor: 'pointer'
                    });

                    cardSprite.on('pointerover', function () {
                        this.setTint(0xff0000);
                    });

                    cardSprite.on('pointerout', function () {
                        this.clearTint();
                    });

                    cardSprite.on('pointerdown', () => {

                        if (this.playerRoundIterator.currentPlayerIndex == player.positionIndex) {
                            if (DeckController.validatePlayCardInGame(this.selectedCard, cardSprite.card)) {
                                this.selectedCard = cardSprite.card;
                                player.removePlayedCard(cardSprite.card);
                                player.removePlayedCardSprite(cardSprite);
                                cardSprite.setDepth(1);

                                this.scene.tweens.add({
                                    targets: cardSprite,
                                    angle: Phaser.Math.Between(cardSprite.angle - 90, cardSprite.angle + 90),
                                    x: this.selectedCardSprite.x,
                                    y: this.selectedCardSprite.y,
                                    duration: 500,
                                });

                                this.nextPlayer();
                            } else {
                                alert("You cannot play this card");
                            }
                        } else {
                            alert("It's not your turn to play yet")
                        }
                    });
                }

                handCardSprite.addSprite(cardSprite);
            });

            player.handCardsSprite = handCardSprite;
        });
    }

    public nextPlayer(): void {
        this.playerRoundIterator.nextPlayer();
        console.log(this.playerRoundIterator.currentPlayer)

        if (!this.playerRoundIterator.currentPlayer.isActive) {
            let cardsSprite = this.playerRoundIterator.currentPlayer.handCardsSprite.sprites;
            let isFindCardToPlay: boolean = false;

            for (let i = 0; i < cardsSprite.length; i++) {
                if (DeckController.validatePlayCardInGame(this.selectedCard, cardsSprite[i].card) && !isFindCardToPlay) {
                    isFindCardToPlay = true;

                    setTimeout(() => {
                        this.selectedCard = cardsSprite[i].card;
                        this.playerRoundIterator.currentPlayer.removePlayedCard(cardsSprite[i].card);
                        this.playerRoundIterator.currentPlayer.removePlayedCardSprite(cardsSprite[i]);
                        cardsSprite[i].setDepth(1);

                        this.scene.tweens.add({
                            targets: cardsSprite[i],
                            angle: Phaser.Math.Between(cardsSprite[i].angle - 90, cardsSprite[i].angle + 90),
                            x: this.selectedCardSprite.x,
                            y: this.selectedCardSprite.y,
                            duration: 500,
                        });

                        console.log('Is player')

                        this.nextPlayer();
                        return;
                    }, Phaser.Math.Between(500, 2000))
                }
            }

            if (!isFindCardToPlay) {
                console.log('Não tem carta')
                console.log(this.selectedCard)
                console.log(this.playerRoundIterator.currentPlayer.hasHandCard(this.selectedCard))
                console.log(this.playerRoundIterator.currentPlayer.handCards)
                this.nextPlayer();
            }
        }
    }

    private renderPlayersGui(): void {
        this.playerRoundIterator.gui = this.playerRoundIterator.players.map((player: Player, index: number) => {
            let textName: Text = this.scene.make.text({
                x: player.positions.uiPositionX,
                y: player.positions.uiPositionY,
                text: player.name,
                style: {
                    font: '20px monospace',
                }
            }).setOrigin(0.5, 0.5);

            let photo: Image = this.scene.add.image(player.positions.uiPositionX - 80, player.positions.uiPositionY, `player_user_photo_${index}`).setScale(0.1);

            return new PlayerGui(textName, photo);
        });
    }

    private createFirstCardGame(): void {
        let shadow = this.scene.add.sprite((this.widthScreen / 2 + 80) + 3, (this.heightScreen / 2 + 15) + 3, 'Deck');
        shadow.tint = 0x000000;
        shadow.alpha = 0.6;
        shadow.setScale(this._cardSize);

        this.selectedCard = this.cardDeck.cards[0];
        this.selectedCardSprite = new SelectedCardSprite(this.scene, this.widthScreen / 2 + 80, this.heightScreen / 2 + 15, this.cardDeck.cards[0]);
        this.selectedCardSprite.setScale(this._cardSize);
    }

    /**
     * Method for creating mid circle
     * @private
     */
    private createMidCircle(): void {
        this.midCircle = this.scene.add.sprite(this.widthScreen / 2 + 24, this.heightScreen / 2 + 15, 'white-circle');
        this.midCircle.setScale(1.4);
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
            const playerConfig = {
                isActive: i === 0,
                positionIndex: i,
                name: `Player ${i}`,
                image: 'https://i1.wp.com/terracoeconomico.com.br/wp-content/uploads/2019/01/default-user-image.png',
            }

            const playerPosition: PlayerPosition = new PlayerPosition(playerConfig.positionIndex, this.scene);

            let handCard: HandCardList = new HandCardList();

            this.cardDeck.cards.splice(0, 7).map(card => handCard.addCard(card));

            let player: Player = new Player(playerConfig.name, playerConfig.image, handCard, playerConfig.positionIndex, playerConfig.isActive);
            player.positions = playerPosition;

            this.cardDeck.cards = this.cardDeck.cards.splice(7, this.cardDeck.cards.length);

            playersArray.push(player);
        }

        return playersArray;
    }

    private static validatePlayCardInGame(cardBase: Card, cardPlay: Card): boolean {
        if (isWildCard(cardPlay)) {
            return true;
        } else if (cardBase instanceof NumberCard) {
            if (cardPlay instanceof NumberCard && cardPlay.number === cardBase.number) {
                return true;
            }

            return cardPlay.color === cardBase.color;
        } else if (cardBase instanceof ActionCard) {
            if (!isWildCard(cardBase)) {
                return cardBase.color === cardPlay.color || cardPlay.type === cardBase.type;
            }

            // TODO: perform implementation for validation
            return true;
        }

        return true;
    }
}