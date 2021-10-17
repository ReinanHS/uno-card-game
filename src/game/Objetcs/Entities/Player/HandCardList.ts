import Card from "../Cards/Card";
import {isWildCard} from "../../../Utilitys/CardUtil";
import {CardType} from "../../Enums/Cards/CardEnum";
import ActionCard from "../Cards/ActionCard";
import NumberCard from "../Cards/NumberCard";

export default class HandCardList {
    private _handCards: Array<Card> = new Array<Card>();

    get cards(): Array<Card> {
        return this._handCards;
    }

    public addCard(card: Card): void {
        this._handCards.push(card);
    }

    public removeCard(card: Card): boolean {
        const cardToRemove = isWildCard(card) ? this.findCardOfType(card.type) : card;
        const sizeOfArray = this.length();

        this._handCards = this._handCards.filter(c => c != cardToRemove);

        return sizeOfArray != this.length();
    }

    public findCardOfType(cardType: CardType): Card {
        this._handCards.forEach(c => {
            if (c.type == cardType) {
                return c;
            }
        })

        return null;
    }

    public findIndex(card: Card): number {
        for (let i = 0; i < this._handCards.length; i++) {
            if (isWildCard(card) && this._handCards[i].type == card.type || card instanceof ActionCard && (this._handCards[i].color == card.color || this._handCards[i].type == card.type)) {
                return i;
            } else if (card instanceof NumberCard) {

                if (card.color == this._handCards[i].color) {
                    return i;
                } else if (this._handCards[i] instanceof NumberCard) {
                    let numberCard: NumberCard = this._handCards[i] as NumberCard;

                    if (numberCard.number == card.number) {
                        return i;
                    }
                }
            }
        }

        return -1;
    }

    public hasCard(card: Card): boolean {
        return this.findIndex(card) >= 0;
    }

    public length(): number {
        return this._handCards.length;
    }
}