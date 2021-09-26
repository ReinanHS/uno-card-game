import Card from "./Card";
import {CardColor, CardType} from "../../Enums/Cards/CardEnum";
import NumberCard from "./NumberCard";
import ActionCard from "./ActionCard";
import WildCard from "./WildCard";

export default class CardDeck {
    public cards: Array<Card> = new Array<Card>();

    constructor() {
        this.buildCards();
    }

    protected buildCards(): void {
        this.buildNumberCards();
        this.buildActionCards();
        this.buildWildCards();
    }

    public shuffle(): CardDeck {
        this.cards = Phaser.Utils.Array.Shuffle(this.cards);
        this.firstCardRule();

        return this;
    }

    protected firstCardRule(index: number = 0): void {
        if (this.cards[index] instanceof NumberCard) {
            const cardTemp : Card = this.cards[index];

            this.cards[index] = this.cards[0];
            this.cards[0] = cardTemp;

            return;
        } else if (index >= this.cards.length) {
            throw new Error("The deck is impossible to shuffle with the first Cards rule");
        }

        this.firstCardRule(index + 1);
    }

    protected buildNumberCards(): void {
        for (let cardColorKey in CardColor) {
            if (isNaN(Number(cardColorKey))) {
                const color: CardColor = (<any>CardColor)[cardColorKey];

                for (let i = 0; i <= 9; i++) {
                    const numberCard: NumberCard = new NumberCard(color, i);

                    this.cards.push(numberCard);
                }
            }
        }
    }

    protected buildActionCards(repetition: number = 2): void {
        for (let cardColorKey in CardColor) {
            if (isNaN(Number(cardColorKey))) {
                const color: CardColor = (<any>CardColor)[cardColorKey];

                for (let i = 0; i < repetition; i++) {
                    this.cards.push(new ActionCard(CardType.SKIP, color));
                    this.cards.push(new ActionCard(CardType.REVERSE, color));
                    this.cards.push(new ActionCard(CardType.DRAW_TWO, color));
                }
            }
        }
    }

    protected buildWildCards(repetition: number = 4): void {
        for (let i = 0; i < repetition; i++) {
            this.cards.push(new WildCard(CardType.WILD_COLOR));
            this.cards.push(new WildCard(CardType.WILD_DRAW_FOUR));
        }
    }
}
