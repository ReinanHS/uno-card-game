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

export default class PlayerController extends AbstractController {
    private _player: Player;
    private _handCardsSprite: Array<CardSprite> = new Array<CardSprite>();

    private _photoImage: Image;
    private _circleGraphics: Graphics;
    private _textName: Text;
    private _textInfo: Text;

    private _isActionActive: boolean = false;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public created(): void {
        this._player = this.buildPlayer();
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
        let cardSprite: CardSprite = new CardSprite(this.scene, x, y, card);

        if (this._handCardsSprite.length === 0) {
            this.scene.tweens.add({
                targets: cardSprite,
                x: this._player.positions.cardPositionX,
                y: this._player.positions.cardPositionY,
                angle: this._player.positions.cardRotation,
                ease: 'Power1',
                duration: 1000,
                onStart: () => {
                    this._isActionActive = true;
                },
                onComplete: () => {
                    this._isActionActive = false;
                },
            });
        } else {
            let {x, y, displayWidth} = this._handCardsSprite.length % 2 === 0 ?
                this._handCardsSprite.at(this._handCardsSprite.length - 2) :
                this._handCardsSprite.at(this._handCardsSprite.length - 2);

            displayWidth = (this._handCardsSprite.length + 20) - displayWidth;
            x = this._handCardsSprite.length % 2 === 0 ? x - displayWidth : x + displayWidth;
            y += Phaser.Math.Between(-4, 4);

            this.scene.tweens.add({
                targets: cardSprite,
                x: x,
                y: y,
                angle: this._player.positions.cardRotation,
                ease: 'Power1',
                duration: 1000,
                onStart: () => {
                    this._isActionActive = true;
                },
                onComplete: () => {
                    this._isActionActive = false;
                },
            });
        }

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
    }
}