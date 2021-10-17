import Player from "../Player/Player";
import HandCardList from "../Player/HandCardList";

export default class Bot extends Player {
    constructor(name: string, picture: string, handCards: HandCardList, positionIndex: number, isActive: boolean = false) {
        super(name, picture, handCards, positionIndex, isActive);
    }
}