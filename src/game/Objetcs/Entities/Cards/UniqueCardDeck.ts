import CardDeck from "./CardDeck";

export default class UniqueCardDeck extends CardDeck {

    constructor() {
        super();
    }

    protected buildCards() : void {
        super.buildNumberCards();
        super.buildActionCards(1);
        super.buildWildCards(1);
    }
}