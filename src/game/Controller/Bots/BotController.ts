import AbstractController from "../AbstractController";
import Bot from "../../Objetcs/Entities/Bot/Bot";
import PlayerPosition from "../../Objetcs/Entities/Player/PlayerPosition";
import HandCardList from "../../Objetcs/Entities/Player/HandCardList";
import EventDispatcher from "../../Events/EventDispatcher";
import Card from "../../Objetcs/Entities/Cards/Card";
import CardSprite from "../../../view/sprites/cards/CardSprite";
import {addCard, findBestCardToPlay} from "../../Utilitys/helpers";
import HandCardsSpriteList from "../../Objetcs/Entities/Player/HandCardsSpriteList";
import Player from "../../Objetcs/Entities/Player/Player";
import {CardColor} from "../../Objetcs/Enums/Cards/CardEnum";
import WildCard from "../../Objetcs/Entities/Cards/WildCard";
import LoaderPlugin = Phaser.Loader.LoaderPlugin;
import Image = Phaser.GameObjects.Image;
import Graphics = Phaser.GameObjects.Graphics;
import Text = Phaser.GameObjects.Text;
import Layer = Phaser.GameObjects.Layer;

export default class BotController extends AbstractController {
    private _bots: Array<Bot> = new Array<Bot>();

    /**
     * Game Objects
     * @private
     */
    private _photoImage: Array<Image> = new Array<Image>();
    private _circleGraphics: Array<Graphics> = new Array<Graphics>();
    private _textName: Array<Text> = new Array<Text>();
    private _textInfo: Array<Text> = new Array<Text>();

    private _layerGUI: Layer;
    private _layerCards: Layer;

    public readonly startTimeToPlay: number = 5;
    private _timeToPlay: number = 10;
    private _intervalIdTimePlay: NodeJS.Timer;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    /**
     * Method for creating the elements
     * @protected
     */
    protected buildElements() {
        this._layerCards = this.scene.add.layer();
        this._layerGUI = this.scene.add.layer();

        this.buildBots();
        this._bots.forEach(bot => this.buildBotGUI(bot));
    }

    /**
     * Method for adding events
     * @protected
     */
    protected callEvents() {
        this._bots.forEach(bot => EventDispatcher.getInstance().emit('addPlayer', bot));

        EventDispatcher.getInstance().on('clickDeckSprite', (player: Player, card: Card, x: number, y: number) => {
            this.onClickDeckSprite(player, card, x, y);

            return true;
        });

        EventDispatcher.getInstance().on('startPlay', (player: Player, card: Card, x: number, y: number, layerCards: Layer) => {
            this.onStartPlay(player, card, x, y, layerCards);

            return true;
        });
    }

    /**
     * Method is called when bot gets a new card.
     * @param player
     * @param card
     * @param x
     * @param y
     * @private
     */
    private onClickDeckSprite(player: Player, card: Card, x: number, y: number): boolean {
        this._bots.forEach(bot => {
            if (bot.positionIndex == player.positionIndex) {
                bot.handCards.push(card);
                this.addHandCardsSprite(bot, card, x, y);

                return true;
            }
        });

        return false;
    }

    /**
     * Method that is called when it is the bot turn to play
     * @param player
     * @param card
     * @param x
     * @param y
     * @param layerCards
     * @private
     */
    private onStartPlay(player: Player, card: Card, x: number, y: number, layerCards: Layer): boolean {
        if (this._bots.find(bot => bot.positionIndex === player.positionIndex) !== undefined) {

            this._timeToPlay = this.startTimeToPlay;
            this._textInfo[player.positionIndex].text = "Playing";
            this._intervalIdTimePlay = setInterval(() => this.updateTimeToPlay(player), 1000);

            this.checkBestCardToPlay(player, card, x, y, layerCards);
        }

        return true;
    }

    /**
     * Method to check the best card to play
     * @param player
     * @param card
     * @param x
     * @param y
     * @param layerCards
     * @private
     */
    private checkBestCardToPlay(player: Player, card: Card, x: number, y: number, layerCards: Layer): void {
        const bestCardToPlay: Card = findBestCardToPlay(card, player.handCards);

        if (bestCardToPlay !== undefined) {
            clearInterval(this._intervalIdTimePlay);

            const cardSprite: CardSprite = player.handCardsSprite.findCardSprite(bestCardToPlay);
            player.removePlayedCard(bestCardToPlay);
            player.removePlayedCardSprite(cardSprite);

            if(bestCardToPlay instanceof WildCard){
                cardSprite.card = new WildCard(cardSprite.card.type, CardColor.RED);
                cardSprite.setTint(0xff0000);
            }

            this.scene.tweens.add({
                targets: cardSprite,
                x: x,
                y: y,
                angle: Phaser.Math.Between(cardSprite.angle - 90, cardSprite.angle + 90),
                duration: 500,
                ease: 'Power1',
                onComplete: () => {
                    EventDispatcher.getInstance().emit('endPlay', player, cardSprite);
                }
            });

            console.log('Tem a carta');
        } else {
            console.log('Não tem a carta');
        }
    }

    /**
     * Method to update the time the bot has left to play
     * @param player
     * @private
     */
    private updateTimeToPlay(player: Player): void {
        this._timeToPlay -= 1;
        this._textInfo[player.positionIndex].text = `Playing (${this._timeToPlay})`;

        if (this._timeToPlay <= 0) {
            clearInterval(this._intervalIdTimePlay);
            this._textInfo[player.positionIndex].text = `Waiting`;

            EventDispatcher.getInstance().emit('endPlay', player, null);
        }
    }

    /**
     * Method for creating the on-screen elements
     */
    public created() {
        super.created();
    }

    /**
     * Method for creating the bots
     * @private
     */
    private buildBots(): void {
        for (let i = 0; i < 3; i++) {
            this._bots.push(this.buildBot(i + 1));
        }
    }

    /**
     * Method for creating a bot
     * @param index
     * @private
     */
    private buildBot(index: number): Bot {
        const playerPosition: PlayerPosition = new PlayerPosition(index, this.scene);
        let handCard: HandCardList = new HandCardList();

        let bot: Bot = new Bot(`Bot ${index}`, `https://avatars.dicebear.com/api/big-ears-neutral/${index}.svg?size=84`, handCard, index);
        bot.positions = playerPosition;
        bot.handCardsSprite = new HandCardsSpriteList();

        return bot;
    }

    /**
     * Method for creating the GUI interface to bots
     * @param bot
     * @private
     */
    private buildBotGUI(bot: Bot) {
        const photoPlayerKey = `photo_player_${bot.positionIndex}`;
        const radius: number = Math.min(84, 84) / 2;

        this._circleGraphics[bot.positionIndex] = this.scene.add.graphics()
            .setPosition(bot.positions.uiPositionX - 40, bot.positions.uiPositionY + (bot.positionIndex == 2 ? -40 : +40))
            .fillCircle(0, 0, radius);

        this._photoImage[bot.positionIndex] = this.scene.add.image(this._circleGraphics[bot.positionIndex].x, this._circleGraphics[bot.positionIndex].y, null);
        this._photoImage[bot.positionIndex].displayWidth = 84;
        this._photoImage[bot.positionIndex].displayHeight = 84;
        this._photoImage[bot.positionIndex].setMask(this._circleGraphics[bot.positionIndex].createGeometryMask());

        let loader: LoaderPlugin = new Phaser.Loader.LoaderPlugin(this.scene);
        loader.svg(photoPlayerKey, bot.picture);

        loader.once(Phaser.Loader.Events.COMPLETE, () => {
            this._photoImage[bot.positionIndex].setTexture(photoPlayerKey);
            this._photoImage[bot.positionIndex].displayWidth = 84;
            this._photoImage[bot.positionIndex].displayHeight = 84;
            this._photoImage[bot.positionIndex].setSize(84, 84);
        });

        loader.start();

        this._textName[bot.positionIndex] = this.scene.make.text({
            x: this._photoImage[bot.positionIndex].x + (bot.positionIndex >= 3 ? 140 : -140),
            y: this._photoImage[bot.positionIndex].y - 15,
            text: bot.name,
            style: {
                font: '20px monospace',
            }
        }).setOrigin(0.5, 0.5);

        this._textInfo[bot.positionIndex] = this.scene.make.text({
            x: this._textName[bot.positionIndex].x,
            y: this._textName[bot.positionIndex].y + 25,
            text: 'Waiting',
            style: {
                font: '16px monospace',
            }
        }).setOrigin(0.5, 0.5);

        this._layerGUI.add(this._circleGraphics[bot.positionIndex]);
        this._layerGUI.add(this._photoImage[bot.positionIndex]);
        this._layerGUI.add(this._textName[bot.positionIndex]);
        this._layerGUI.add(this._textInfo[bot.positionIndex]);
    }

    /**
     * Method for adding cards to the bot hand
     * @param bot
     * @param card
     * @param x
     * @param y
     * @private
     */
    private addHandCardsSprite(bot: Bot, card: Card, x: number, y: number): void {
        let cardSprite: CardSprite = new CardSprite(this.scene, x, y, card);
        this._layerCards.add(cardSprite);

        addCard(this.scene, cardSprite, bot, bot.handCardsSprite.sprites).then(() => {
            EventDispatcher.getInstance().emit('addCardFinished', bot, cardSprite);
        });

        bot.handCardsSprite.addSprite(cardSprite);
    }
}