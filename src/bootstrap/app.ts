import 'phaser'
import {config} from "../config/game";

window.addEventListener('load', () => {
    new Phaser.Game(config)
});