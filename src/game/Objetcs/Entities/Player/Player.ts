import HandCardList from "./HandCardList";
import Card from "../Cards/Card";
import HandCardsSpriteList from "./HandCardsSpriteList";
import CardSprite from "../../../../view/sprites/cards/CardSprite";
import PlayerPosition from "./PlayerPosition";

export default class Player {

    private readonly _isActive : boolean;
    private readonly _name : string;
    private readonly _picture : string;
    private readonly _handCards : HandCardList;
    private readonly _positionIndex : number;

    private _handCardsSprite : HandCardsSpriteList;
    private _positions : PlayerPosition;

    /**
     * Constructor of player
     * @param name
     * @param picture
     * @param handCards
     * @param positionIndex
     * @param isActive
     */
    constructor(name: string, picture: string, handCards: HandCardList, positionIndex: number = 0, isActive : boolean = false) {
        this._name = name;
        this._picture = picture;
        this._handCards = handCards;
        this._positionIndex = positionIndex;
        this._isActive = isActive;
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

    get isActive(): boolean {
        return this._isActive;
    }

    get positions(): PlayerPosition {
        return this._positions;
    }

    set positions(value: PlayerPosition) {
        this._positions = value;
    }

    get positionIndex(): number {
        return this._positionIndex;
    }

    get handCardsSprite(): HandCardsSpriteList {
        return this._handCardsSprite;
    }

    set handCardsSprite(value: HandCardsSpriteList) {
        this._handCardsSprite = value;
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

    public findIndex(card : Card) : number {
        return this._handCards.findIndex(card);
    }

    public addToHandCardsSprite(sprite : CardSprite): void {
        this._handCardsSprite.addSprite(sprite);
    }

    public removePlayedCardSprite(sprite : CardSprite): void {
        this._handCardsSprite.removeSprite(sprite);
    }
}