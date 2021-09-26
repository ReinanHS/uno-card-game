import Card from "./Card";
import {CardColor, CardType} from "../../Enums/Cards/CardEnum";
import {validateColor} from "../../../Utilitys/CardUtil";

export default abstract class AbstractCard implements Card {
    private readonly _type: CardType;
    private readonly _color: CardColor;

    protected constructor(type: CardType, color?: CardColor, ignoreValidation: boolean = false) {
        this._type = type;
        this._color = color;

        if (!ignoreValidation) {
            validateColor(color);
        }
    }

    get type(): CardType {
        return this._type;
    }

    get color(): CardColor {
        return this._color;
    }

    abstract get key(): string;
}