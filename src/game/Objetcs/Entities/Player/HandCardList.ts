import Card from "../Cards/Card";
import {isWildCard} from "../../../Utilitys/CardUtil";
import {CardType} from "../../Enums/Cards/CardEnum";

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
            if(c.type == cardType){
                return c;
            }
        })

        return null;
    }

    public hasCard(card: Card): boolean {
        return isWildCard(card)
            ? this._handCards.find(c => c.type == card.type) != undefined
            : this._handCards.find(c => c == card) != undefined;
    }

    public length(): number {
        return this._handCards.length;
    }
}