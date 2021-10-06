import Controller from "./Controller";

export default abstract class AbstractController implements Controller {
    public scene: Phaser.Scene;

    protected constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.beforeCreate();
    }

    public beforeCreate(): void {}

    public preload(): void {}

    public created(): void {}

    public update(time: number, delta: number): void {}
}