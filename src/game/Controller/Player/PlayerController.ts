import AbstractController from "../AbstractController";
import Player from "../../Objetcs/Entities/Player/Player";
import EventDispatcher from "../../Events/EventDispatcher";
import PlayerPosition from "../../Objetcs/Entities/Player/PlayerPosition";
import HandCardList from "../../Objetcs/Entities/Player/HandCardList";
import Card from "../../Objetcs/Entities/Cards/Card";
import CardSprite from "../../../view/sprites/cards/CardSprite";
import {addCard} from "../../Utilitys/helpers";
import Image = Phaser.GameObjects.Image;
import Graphics = Phaser.GameObjects.Graphics;
import LoaderPlugin = Phaser.Loader.LoaderPlugin;
import Text = Phaser.GameObjects.Text;
import Layer = Phaser.GameObjects.Layer;

export default class PlayerController extends AbstractController {
    private _player: Player;
    private _handCardsSprite: Array<CardSprite> = new Array<CardSprite>();

    private _photoImage: Image;
    private _circleGraphics: Graphics;
    private _textName: Text;
    private _textInfo: Text;

    private _isActionActive: boolean = false;
    private _isSelect: boolean = false;

    private _layerGUI: Layer;
    private _layerCards: Layer;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    /**
     * Method for adding events
     * @private
     */
    protected callEvents() {
        EventDispatcher.getInstance().on('clickDeckSprite', (player: Player, card: Card, x: number, y: number) => {
            if (!this._isActionActive && player.positionIndex == this._player.positionIndex) {
                this._player.handCards.push(card);
                this.addHandCardsSprite(card, x, y);
            }

            return true;
        });

        EventDispatcher.getInstance().emit('addPlayer', this._player);
        EventDispatcher.getInstance().on('startPlay', (player: Player) => {
            if (this._player.positionIndex === player.positionIndex) {
                this._isSelect = true;
                this._textInfo.text = "Playing";
                let time = 10;

                let refreshIntervalId = setInterval(() => {
                    time -= 1;
                    this._textInfo.text = `Playing (${time})`;

                    if (time <= 0) {
                        clearInterval(refreshIntervalId);
                        this._isSelect = false;
                        EventDispatcher.getInstance().emit('nextPlay')
                    }

                }, 1000)
            }
        });
    }

    /**
     * Method for creating the elements
     * @private
     */
    protected buildElements() {
        this._layerCards = this.scene.add.layer();
        this._layerGUI = this.scene.add.layer();
        this._player = this.buildPlayer();

        this.buildPlayerGUI(this._player);
    }

    /**
     * Method that is called on each frame
     * @param time
     * @param delta
     */
    public update(time: number, delta: number): void {
        if (!this._isSelect) {
            this._textInfo.text = `${this._player.handCards.length} cards`;
        }
    }

    /**
     * Method for adding a card to the player's hand
     * @param card
     * @param x
     * @param y
     * @private
     */
    private addHandCardsSprite(card: Card, x: number, y: number): void {
        this._isActionActive = true;

        let cardSprite: CardSprite = new CardSprite(this.scene, x, y, card);
        this._layerCards.add(cardSprite);

        cardSprite.on('pointerdown', () => {
            EventDispatcher.getInstance().emit('playCard', this._player, cardSprite.card);
        });
        cardSprite.on('pointerover', () => {
            cardSprite.setDepth(this._player.handCards.length);
            cardSprite.setScale(0.25)
        });
        cardSprite.on('pointerout', () => {
            cardSprite.clearTint();
            cardSprite.setScale(0.2)
            cardSprite.setDepth(this._player.handCards.findIndex(item => cardSprite.card == item));
        });

        addCard(this.scene, cardSprite, this._player, this._handCardsSprite).then(() => {
            cardSprite.setInteractive({cursor: 'Pointer'});
            this._isActionActive = false;

            EventDispatcher.getInstance().emit('addCardFinished', this._player, cardSprite);
        });

        this._handCardsSprite.push(cardSprite);
    }

    /**
     * Method to create a player
     * @private
     */
    private buildPlayer(): Player {
        const playerPosition: PlayerPosition = new PlayerPosition(0, this.scene);
        let handCard: HandCardList = new HandCardList();

        let player: Player = new Player('Reinan Gabriel', `https://avatars.dicebear.com/api/big-ears-neutral/reinan.svg?size=84`, handCard, 0, true);
        player.positions = playerPosition;

        return player;
    }

    /**
     * Method for creating the interface for the player
     * @param player
     * @private
     */
    private buildPlayerGUI(player: Player): void {
        const photoPlayerKey = `photo_player_${player.positionIndex}`;
        const radius: number = Math.min(84, 84) / 2;

        this._circleGraphics = this.scene.add.graphics()
            .setPosition(player.positions.uiPositionX - 40, player.positions.uiPositionY - 40)
            .fillCircle(0, 0, radius);

        this._photoImage = this.scene.add.image(this._circleGraphics.x, this._circleGraphics.y, null);
        this._photoImage.displayWidth = 84;
        this._photoImage.displayHeight = 84;

        this._photoImage.setMask(this._circleGraphics.createGeometryMask());

        let loader: LoaderPlugin = new Phaser.Loader.LoaderPlugin(this.scene);
        loader.svg(photoPlayerKey, player.picture);

        loader.once(Phaser.Loader.Events.COMPLETE, () => {
            this._photoImage.setTexture(photoPlayerKey);
            this._photoImage.displayWidth = 84;
            this._photoImage.displayHeight = 84;
            this._photoImage.setSize(84, 84);
        });

        loader.start();

        this._textName = this.scene.make.text({
            x: this._photoImage.x + 140,
            y: this._photoImage.y - 15,
            text: player.name,
            style: {
                font: '20px monospace',
            }
        }).setOrigin(0.5, 0.5);

        this._textInfo = this.scene.make.text({
            x: this._textName.x,
            y: this._textName.y + 25,
            text: '0 cards',
            style: {
                font: '16px monospace',
            }
        }).setOrigin(0.5, 0.5);

        this._layerGUI.add(this._circleGraphics);
        this._layerGUI.add(this._photoImage);
        this._layerGUI.add(this._textName);
        this._layerGUI.add(this._textInfo);
    }
}