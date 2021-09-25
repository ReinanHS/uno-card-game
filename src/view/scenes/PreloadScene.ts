import Card from "../../game/Objetcs/Entities/Cards/Card";
import UniqueCardDeck from "../../game/Objetcs/Entities/Cards/UniqueCardDeck";
import NumberCard from "../../game/Objetcs/Entities/Cards/NumberCard";
import {CardColor, CardType} from "../../game/Objetcs/Enums/Cards/CardEnum";
import ActionCard from "../../game/Objetcs/Entities/Cards/ActionCard";
import WildCard from "../../game/Objetcs/Entities/Cards/WildCard";
import Graphics = Phaser.GameObjects.Graphics;
import Text = Phaser.GameObjects.Text;

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({
            key: "PreloadScene"
        });
    }

    public preload(): void {
        const {width, height} = this.scene.systems.canvas;

        let progressBar: Graphics = this.add.graphics();
        let progressBox: Graphics = this.add.graphics();
        let loadingText: Text = this.make.text({
            x: width / 2,
            y: height - 180,
            text: 'Loading...',
            style: {
                font: '20px monospace',
            }
        });
        let percentText = this.make.text({
            x: width / 2,
            y: height - 150,
            text: '0%',
            style: {
                font: '18px monospace',
            }
        });
        let assetText = this.make.text({
            x: width / 2,
            y: height - 65,
            text: '',
            style: {
                font: '14px monospace',
            }
        });

        loadingText.setOrigin(0.5, 0.5);
        percentText.setOrigin(0.5, 0.5);
        assetText.setOrigin(0.5, 0.5);

        progressBox.fillStyle(0xd9710f, 0.5);
        progressBox.fillRect(40, height - 100, width - 100, 20);

        this.load.on('progress', (percentage: number) => {
            percentText.setText(parseInt(`${percentage * 100}`) + '%');

            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(50, height - 95, (width - 120) * percentage, 10);
        });

        this.load.on('fileprogress', function (file: Phaser.Loader.File) {
            assetText.setText(`Loading asset: ${file.key}`);
        });

        this.load.on('complete', () => {
            percentText.destroy();
            loadingText.destroy();
            assetText.destroy();
            progressBar.destroy();
            progressBox.destroy();
        });

        this.load.image('Logo', 'assets/images/logo/logo-game-developer.png');

        this.load.image('Background', 'assets/images/table/background-game.png');
        this.load.image('Table_0', 'assets/images/table/Table_0.png');
        this.load.image('Table_1', 'assets/images/table/Table_1.png');
        this.load.image('Table_2', 'assets/images/table/Table_2.png');
        this.load.image('Table_3', 'assets/images/table/Table_3.png');
        this.load.image('Table_4', 'assets/images/table/Table_4.png');

        this.load.image('Deck', `assets/images/cards/Deck.png`);

        const cardDeck: UniqueCardDeck = new UniqueCardDeck();
        cardDeck.cards.forEach((card: Card) => {
            const capitalizeName = (text?: string): string => {
                return text.charAt(0).toUpperCase() + text.toLowerCase().substr(1);
            }

            let name: string = "";
            let key: string = "";

            if (card instanceof NumberCard) {
                name = `${capitalizeName(CardColor[card.color])}_${card.number}`;
                key = `${CardColor[card.color]}_${card.number}`;
            } else if (card instanceof ActionCard) {
                let type = CardType[card.type].replace('DRAW_TWO', 'DRAW');

                name = `${capitalizeName(CardColor[card.color])}_${capitalizeName(type)}`;
                key = `${CardColor[card.color]}_${type}`;
            } else if (card instanceof WildCard) {
                name = CardType[card.type]
                    .replace('WILD_COLOR', 'Wild')
                    .replace('WILD_DRAW_FOUR', 'Wild_Draw');
                key = CardType[card.type];
            }

            this.load.image(key, `assets/images/cards/${name}.png`);
        });
    }

    public create() {
        this.scene.start('MainScene');

        // this.add.image(this.scene.systems.canvas.width / 2, this.scene.systems.canvas.height / 2, 'Logo');
        // setTimeout(() => {
        //     this.scene.start('MainScene');
        // }, 2000)
    }
}