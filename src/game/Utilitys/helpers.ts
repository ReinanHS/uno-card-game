import CardSprite from "../../view/sprites/cards/CardSprite";
import Player from "../Objetcs/Entities/Player/Player";
import {OrientationPlayerEnum} from "../Objetcs/Enums/Game/PlayerEnum";
import Card from "../Objetcs/Entities/Cards/Card";
import WildCard from "../Objetcs/Entities/Cards/WildCard";
import {isWildCard} from "./CardUtil";
import ActionCard from "../Objetcs/Entities/Cards/ActionCard";
import NumberCard from "../Objetcs/Entities/Cards/NumberCard";

export function isPrime(num: number): boolean {
    for (let i = 2; i < num; i++)
        if (num % i === 0) {
            return false;
        }
    return num > 1;
}

export function addCard(scene: Phaser.Scene, cardSprite: CardSprite, player: Player, handCardsSprite: Array<CardSprite>): Promise<void> {
    return new Promise((resolve, reject) => {
        if (handCardsSprite.length === 0) {
            scene.tweens.add({
                targets: cardSprite,
                x: player.positions.cardPositionX,
                y: player.positions.cardPositionY,
                angle: player.positions.cardRotation,
                ease: 'Power1',
                duration: 500,
                onComplete: () => {
                    resolve();
                },
            });
        } else {
            let {x, y, displayWidth} = handCardsSprite.length % 2 === 0 ?
                handCardsSprite.at(handCardsSprite.length - 2) :
                handCardsSprite.at(handCardsSprite.length - 2);

            displayWidth = (handCardsSprite.length + 20) - displayWidth;
            x = player.positions.orientation == OrientationPlayerEnum.HORIZONTAL
                ? handCardsSprite.length % 2 === 0 ? x - displayWidth : x + displayWidth
                : x + Phaser.Math.Between(-4, 4);
            y = player.positions.orientation == OrientationPlayerEnum.HORIZONTAL
                ? y + Phaser.Math.Between(-4, 4)
                : handCardsSprite.length % 2 === 0 ? y - displayWidth : y + displayWidth;

            scene.tweens.add({
                targets: cardSprite,
                x: x,
                y: y,
                angle: player.positions.cardRotation,
                ease: 'Power1',
                duration: 500,
                onComplete: () => {
                    resolve();
                }
            });
        }
    });
}

export function findBestCardToPlay(card: Card, handCards: Card[]): Card {
    let orderHandCardsByType: Array<Card> = handCards.sort((cardA, cardB) => {
        if (cardA.type > cardB.type) {
            return 1;
        } else if (cardA.type < cardB.type) {
            return -1;
        }

        return 0;
    });

    for (let handCard of orderHandCardsByType) {
        if(handCard instanceof WildCard && !isWildCard(card)){
            console.log(0, handCard);
            return handCard;
        }
        if (handCard.color == card.color) {
            console.log(1, handCard);
            return handCard;
        } else if (card instanceof WildCard && isWildCard(handCard) && card.type == handCard.type) {
            console.log(2, handCard);
            return handCard;
        } else if (card instanceof ActionCard && handCard instanceof ActionCard && handCard.type == card.type) {
            console.log(3, handCard);
            return handCard;
        } else if (card instanceof NumberCard && handCard instanceof NumberCard && handCard.number == card.number) {
            console.log(4, handCard);
            return handCard;
        }
    }

    console.log(5, undefined);

    return undefined;
}