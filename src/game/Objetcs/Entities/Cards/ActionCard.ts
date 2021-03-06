import AbstractCard from "./AbstractCard";
import {CardColor, CardType} from "../../Enums/Cards/CardEnum";
import {validateActionType} from "../../../Utilitys/CardUtil";

export default class ActionCard extends AbstractCard {

    constructor(type: CardType, color: CardColor) {
        super(type, color);
        validateActionType(type);
    }

    get key(): string {
        let type = CardType[this.type].replace('DRAW_TWO', 'DRAW');

        return `${CardColor[this.color]}_${type}`;
    }
}