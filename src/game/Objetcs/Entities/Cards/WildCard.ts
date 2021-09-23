import AbstractCard from "./AbstractCard";
import {CardColor, CardType} from "./CardEnum";

export default class WildCard extends AbstractCard {

    constructor(type: CardType, color?: CardColor) {
        super(type, color, true);
    }

    get key(): string {
        return CardType[this.type];
    }
}