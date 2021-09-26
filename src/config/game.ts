import 'phaser';
import {scenes} from "./scenes";

export const config : object = {
    type: Phaser.AUTO,
    backgroundColor: '#c52a10',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.CENTER_BOTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720
    },
    pixelArt: true,
    scene: scenes,
}