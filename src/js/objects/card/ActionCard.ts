import AbstractCard from "./AbstractCard";
import {CardColor, CardType} from "./CardEnum";
import {validateActionType} from "./CardUtil";

export default class ActionCard extends AbstractCard {

    constructor(type: CardType, color: CardColor) {
        super(type, color);
        validateActionType(type);
    }
}