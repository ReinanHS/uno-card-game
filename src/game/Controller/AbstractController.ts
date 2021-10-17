import Controller from "./Controller";

export default abstract class AbstractController implements Controller {
    public scene: Phaser.Scene;
    protected _widthScreen: number;
    protected _heightScreen: number;

    protected constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.beforeCreate();
    }

    /**
     * Method for adding events
     * @private
     */
    protected callEvents(): void {}

    /**
     * Method for creating the elements
     * @private
     */
    protected buildElements(): void {}

    /**
     * Method called when creating controller
     */
    public beforeCreate(): void {}

    /**
     * Method for loading elements
     */
    public preload(): void {}

    /**
     * Method for creating the on-screen elements
     */
    public created(): void {
        this._widthScreen = this.scene.sys.game.canvas.width;
        this._heightScreen = this.scene.sys.game.canvas.height;

        this.buildElements();
        this.callEvents();
    }

    /**
     * Method that is called on each frame
     * @param time
     * @param delta
     */
    public update(time: number, delta: number): void {}
}