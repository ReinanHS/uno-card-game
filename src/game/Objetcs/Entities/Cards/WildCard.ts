import AbstractCard from "./AbstractCard";
import {CardColor, CardType} from "../../Enums/Cards/CardEnum";

export default class WildCard extends AbstractCard {

    constructor(type: CardType, color?: CardColor) {
        super(type, color, true);
    }

    get key(): string {
        return CardType[this.type];
    }
}