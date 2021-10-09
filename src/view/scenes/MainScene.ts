import Controller from "../../game/Controller/Controller";
import PlayerController from "../../game/Controller/Player/PlayerController";
import DeckController from "../../game/Controller/Deck/DeckController";

export default class MainScene extends Phaser.Scene {
    public controllers: Controller[] = [];

    constructor() {
        super({
            key: "MainScene",
        });

        this.controllers = this.buildControllers();
    }

    private buildControllers(): Controller[] {
        return [
            new DeckController(this),
            new PlayerController(this),
        ];
    }

    public preload(): void {
        this.controllers.map(controller => controller.preload());
    }

    public create(): void {
        this.controllers.map(controller => controller.created());
    }

    public update(time: number, delta: number) {
        this.controllers.map(controller => controller.update(time, delta));
    }
}