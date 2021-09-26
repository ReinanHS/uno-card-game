import {CardColor, CardType} from "../../Enums/Cards/CardEnum";

export default interface Card {
    get type(): CardType;
    get color(): CardColor;
    get key(): string;
}