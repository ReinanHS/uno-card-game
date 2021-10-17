import CardSprite from "../../../../view/sprites/cards/CardSprite";
import Card from "../Cards/Card";

export default class HandCardsSpriteList {
    private _handCardsSprite: Array<CardSprite> = new Array<CardSprite>();

    get sprites(): Array<CardSprite> {
        return this._handCardsSprite;
    }

    public addSprite(sprite: CardSprite): void {
        this._handCardsSprite.push(sprite);
    }

    public removeSprite(sprite: CardSprite): boolean {
        const sizeOfArray: number = this.length();

        this._handCardsSprite = this._handCardsSprite.filter(s => s.card != sprite.card);

        sprite.removeInteractive();
        sprite.clearTint();

        return sizeOfArray != this.length();
    }

    public findCardSprite(card: Card): CardSprite {
        return this._handCardsSprite.find(s => s.card == card);
    }

    public length(): number {
        return this._handCardsSprite.length;
    }
}