import AbstractController from "../AbstractController";
import Bot from "../../Objetcs/Entities/Bot/Bot";
import PlayerPosition from "../../Objetcs/Entities/Player/PlayerPosition";
import HandCardList from "../../Objetcs/Entities/Player/HandCardList";
import LoaderPlugin = Phaser.Loader.LoaderPlugin;
import Image = Phaser.GameObjects.Image;
import Graphics = Phaser.GameObjects.Graphics;
import Text = Phaser.GameObjects.Text;

export default class BotController extends AbstractController {
    private _bots: Array<Bot> = new Array<Bot>();

    private _photoImage: Array<Image> = new Array<Image>();
    private _circleGraphics: Array<Graphics> = new Array<Graphics>();
    private _textName: Array<Text> = new Array<Text>();
    private _textInfo: Array<Text> = new Array<Text>();

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public created(): void {
        this.buildBots();
        this._bots.forEach(bot => this.buildBotGUI(bot));
    }

    private buildBots(): void {
        for (let i = 0; i < 3; i++) {
            this._bots.push(this.buildBot(i+1));
        }
    }

    private buildBot(index: number): Bot {
        const playerPosition: PlayerPosition = new PlayerPosition(index, this.scene);
        let handCard: HandCardList = new HandCardList();

        let bot: Bot = new Bot(`Bot ${index}`, `https://avatars.dicebear.com/api/big-ears-neutral/${index}.svg?size=84`, handCard, index);
        bot.positions = playerPosition;

        return bot;
    }

    private buildBotGUI(bot: Bot){
        const photoPlayerKey = `photo_player_${bot.positionIndex}`;
        const radius: number = Math.min(84, 84) / 2;

        this._circleGraphics[bot.positionIndex]  = this.scene.add.graphics()
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
    }
}