import 'phaser'
import PreloadScene from "./scenes/PreloadScene";
import MainScene from "./scenes/MainScene";

const DEFAULT_WIDTH: number = 1280
const DEFAULT_HEIGHT: number = 720

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#131313',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT
    },
    pixelArt: true,
    scene: [
        PreloadScene,
        MainScene,
    ],
}

window.addEventListener('load', () => {
    const game = new Phaser.Game(config)
})