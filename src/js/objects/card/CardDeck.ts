import Card from "./Card";
import {CardColor, CardType} from "./CardEnum";
import NumberCard from "./NumberCard";
import ActionCard from "./ActionCard";
import WildCard from "./WildCard";

export default class CardDeck {
    public cards : Array<Card> = new Array<Card>();

    constructor() {
        this.buildCards();
    }

    private buildCards() : void {
        this.buildNumberCards();
        this.buildActionCards();
        this.buildWildCards();
    }

    private buildNumberCards() : void {
        for (let cardColorKey in CardColor) {
            if (isNaN(Number(cardColorKey))) {
                const color : CardColor = (<any>CardColor)[cardColorKey];

                for (let i = 0; i <= 9; i++) {
                    const numberCard : NumberCard = new NumberCard(color, i);

                    this.cards.push(numberCard);
                }
            }
        }
    }

    private buildActionCards() : void {
        for (let cardColorKey in CardColor) {
            if (isNaN(Number(cardColorKey))) {
                const color : CardColor = (<any>CardColor)[cardColorKey];

                for (let i = 0; i < 2; i++) {
                    this.cards.push(new ActionCard(CardType.SKIP, color));
                    this.cards.push(new ActionCard(CardType.REVERSE, color));
                    this.cards.push(new ActionCard(CardType.DRAW_TWO, color));
                }
            }
        }
    }

    private buildWildCards(): void {
        for (let i = 0; i < 4; i++) {
            this.cards.push(new WildCard(CardType.WILD_COLOR));
            this.cards.push(new WildCard(CardType.WILD_DRAW_FOUR));
        }
    }
}
