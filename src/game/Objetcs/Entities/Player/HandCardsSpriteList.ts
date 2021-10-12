import CardSprite from "../../../../view/sprites/cards/CardSprite";

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
        this._handCardsSprite = this._handCardsSprite.filter(s => {
            return s.x != sprite.x && s.y != sprite.y && s.name != sprite.name;
        });

        sprite.removeInteractive();
        sprite.clearTint();

        return sizeOfArray != this.length();
    }

    public length(): number {
        return this._handCardsSprite.length;
    }
}