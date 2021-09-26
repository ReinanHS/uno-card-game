import HandCardList from "./HandCardList";
import Card from "../Cards/Card";

export default class Player {
    private readonly _name : string;
    private readonly _picture : string;
    private readonly _handCards : HandCardList;

    constructor(name: string, picture: string, handCards: HandCardList) {
        this._name = name;
        this._picture = picture;
        this._handCards = handCards;
    }

    get name(): string {
        return this._name;
    }

    get picture(): string {
        return this._picture;
    }

    get handCards(): Array<Card> {
        return this._handCards.cards;
    }

    public addToHandCards(card : Card): void {
        this._handCards.addCard(card);
    }

    public removePlayedCard(card : Card): void {
        this._handCards.removeCard(card);
    }

    public hasHandCard(card : Card) : boolean {
        return this._handCards.hasCard(card);
    }
}