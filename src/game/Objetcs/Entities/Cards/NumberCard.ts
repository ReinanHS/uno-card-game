import AbstractCard from "./AbstractCard";
import {CardColor, CardType} from "../../Enums/Cards/CardEnum";
import {validateNumber} from "../../../Utilitys/CardUtil";

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

    get key(): string {
        return `${CardColor[this.color]}_${this.number}`;
    }
}