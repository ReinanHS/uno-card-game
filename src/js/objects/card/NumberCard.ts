import AbstractCard from "./AbstractCard";
import {CardColor, CardType} from "./CardEnum";
import {validateNumber} from "./CardUtil";

export default class NumberCard extends AbstractCard {
    private readonly _number : number;

    constructor(color: CardColor, number: number) {
        super(CardType.NUMBER, color);
        this._number = number;

        validateNumber(number);
    }

    get number(): number {
        return this._number;
    }
}