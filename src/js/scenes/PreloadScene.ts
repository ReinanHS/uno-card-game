export default class PreloadScene extends Phaser.Scene {

    constructor() {
        super({
            key: "PreloadScene"
        });
    }

    public preload(): void {
        this.load.image('Table_0', 'assets/images/table/Table_0.png');
        this.load.image('Table_1', 'assets/images/table/Table_1.png');
        this.load.image('Table_2', 'assets/images/table/Table_2.png');
        this.load.image('Table_3', 'assets/images/table/Table_3.png');
        this.load.image('Table_4', 'assets/images/table/Table_4.png');

        this.load.on('progress', this.updateBar);
        this.load.on('complete', this.complete);
    }

    public updateBar(percentage: number): void {
        console.log(`Loading ${percentage}%`);
    }

    public complete(): void {
        console.log(`Complete`);
    }

    public create() {
        this.scene.start('MainScene');
    }
}