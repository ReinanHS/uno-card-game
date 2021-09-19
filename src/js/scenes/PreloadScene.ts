import Card from "../objects/card/Card";
import UniqueCardDeck from "../objects/card/UniqueCardDeck";
import NumberCard from "../objects/card/NumberCard";
import {CardColor, CardType} from "../objects/card/CardEnum";
import ActionCard from "../objects/card/ActionCard";
import WildCard from "../objects/card/WildCard";

export default class PreloadScene extends Phaser.Scene {

    constructor() {
        super({
            key: "PreloadScene"
        });
    }

    public preload(): void {
        this.load.image('Table_0', 'assets/images/table/Table_0.png');
        this.load.image('Table_1', 'assets/images/table/Table_1.png');
        this.load.image('Table_2', 'assets/images/table/Table_2.png');
        this.load.image('Table_3', 'assets/images/table/Table_3.png');
        this.load.image('Table_4', 'assets/images/table/Table_4.png');

        const cardDeck: UniqueCardDeck = new UniqueCardDeck();
        cardDeck.cards.forEach((card: Card) => {
            const capitalizeName = (text?: string): string => {
                return text.charAt(0).toUpperCase() + text.toLowerCase().substr(1);
            }

            let name : string = "";
            let key : string = "";

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

        this.load.on('progress', this.updateBar);
        this.load.on('complete', this.complete);
    }

    public updateBar(percentage: number): void {
        console.log(`Loading ${percentage}%`);
    }

    public complete(): void {
        console.log(`Complete`);
    }

    public create() {
        this.scene.start('MainScene');
    }
}