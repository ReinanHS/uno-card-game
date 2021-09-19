import {CardColor, CardType} from "./CardEnum";
import Card from "./Card";

export function validateColor(color: CardColor): void {
    if (color === undefined || color === null) {
        throw new Error("Card color cannot be set to empty");
    }
}

export function validateNumber(number: number): void {
    if (number < 0 || number > 9) {
        throw new Error("Card number should between 0 and 9");
    }
}

export function validateActionType(type: CardType): void {
    if (type === CardType.SKIP || type === CardType.REVERSE || type === CardType.DRAW_TWO) {
        return;
    }

    throw new Error("Invalid action type");
}

export function isWildCard(card: Card): boolean {
    return card.type == CardType.WILD_COLOR || card.type == CardType.WILD_DRAW_FOUR;
}