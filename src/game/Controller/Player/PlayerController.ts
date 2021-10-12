import AbstractController from "../AbstractController";
import Player from "../../Objetcs/Entities/Player/Player";
import EventDispatcher from "../../Events/EventDispatcher";
import PlayerPosition from "../../Objetcs/Entities/Player/PlayerPosition";
import HandCardList from "../../Objetcs/Entities/Player/HandCardList";
import Card from "../../Objetcs/Entities/Cards/Card";
import CardSprite from "../../../view/sprites/cards/CardSprite";
import Image = Phaser.GameObjects.Image;
import Graphics = Phaser.GameObjects.Graphics;
import LoaderPlugin = Phaser.Loader.LoaderPlugin;
import Text = Phaser.GameObjects.Text;
import {addCard} from "../../Utilitys/helpers";
import Layer = Phaser.GameObjects.Layer;

export default class PlayerController extends AbstractController {
    private _player: Player;
    private _handCardsSprite: Array<CardSprite> = new Array<CardSprite>();

    private _photoImage: Image;
    private _circleGraphics: Graphics;
    private _textName: Text;
    private _textInfo: Text;

    private _isActionActive: boolean = false;

    private _layerGUI : Layer;
    private _layerCards : Layer;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public created(): void {
        this._player = this.buildPlayer();
        this._layerCards = this.scene.add.layer();
        this._layerGUI = this.scene.add.layer();

        this.buildPlayerGUI(this._player);

        EventDispatcher.getInstance().on('clickDeckSprite', (card: Card, x: number, y: number) => {
            if (!this._isActionActive) {
                this._player.handCards.push(card);
                this.addHandCardsSprite(card, x, y);
            }
        });
    }

    public update(time: number, delta: number): void {
        this._textInfo.text = `${this._player.handCards.length} cards`;
    }

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
        cardSprite.on('pointerout',  () => {
            cardSprite.clearTint();
            cardSprite.setScale(0.2)
            cardSprite.setDepth(this._player.handCards.findIndex(item => cardSprite.card == item));
        });

        setTimeout(() => {
            cardSprite.setInteractive({ cursor: 'Pointer'})
            this._isActionActive = false;
        }, 1000);

        addCard(this.scene, cardSprite, this._player, this._handCardsSprite);

        this._handCardsSprite.push(cardSprite);
    }

    private buildPlayer(): Player {
        const playerPosition: PlayerPosition = new PlayerPosition(0, this.scene);
        let handCard: HandCardList = new HandCardList();

        let player: Player = new Player('Reinan Gabriel', `https://avatars.dicebear.com/api/big-ears-neutral/reinan.svg?size=84`, handCard, 0, true);
        player.positions = playerPosition;

        return player;
    }

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