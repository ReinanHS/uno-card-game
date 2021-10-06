export default interface Controller {
    scene : Phaser.Scene;
    beforeCreate(): void;
    preload(): void;
    created(): void;
    update(time: number, delta: number): void;
}