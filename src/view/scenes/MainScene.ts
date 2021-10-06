import Controller from "../../game/Controller/Controller";
import PlayerController from "../../game/Controller/Player/PlayerController";

export default class MainScene extends Phaser.Scene {
    protected controllers: Controller[] = [];

    constructor() {
        super({
            key: "MainScene",
        });

        this.controllers = this.buildControllers();
    }

    private buildControllers(): Controller[] {
        return [
            new PlayerController(this),
        ];
    }

    public preload(): void {
        this.controllers.map(controller => controller.preload());
    }

    public create(): void {
        this.controllers.map(controller => controller.created());
    }
}