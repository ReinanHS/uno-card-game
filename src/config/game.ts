import 'phaser';
import {scenes} from "./scenes";

export const config : object = {
    type: Phaser.AUTO,
    backgroundColor: '#131313',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720
    },
    pixelArt: true,
    scene: scenes,
}