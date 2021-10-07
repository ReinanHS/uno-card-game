import AbstractController from "../AbstractController";
import Player from "../../Objetcs/Entities/Player/Player";
import EventDispatcher from "../../Events/EventDispatcher";

export default class PlayerController extends AbstractController {
    private player: Player;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    beforeCreate() {
        this.player = new Player('Reinan', '', null, 0);
    }

    public created() {
        EventDispatcher.getInstance().emit('teste');
    }
}