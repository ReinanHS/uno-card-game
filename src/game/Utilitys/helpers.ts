import CardSprite from "../../view/sprites/cards/CardSprite";
import Player from "../Objetcs/Entities/Player/Player";
import {OrientationPlayerEnum} from "../Objetcs/Enums/Game/PlayerEnum";

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