import {CardColor, CardType} from "./CardEnum";

export default interface Card {
    get type(): CardType;
    get color(): CardColor;
}