export default class EventDispatcher extends Phaser.Events.EventEmitter {
    private static instance: Phaser.Events.EventEmitter;

    constructor() {
        super();
    }

    static getInstance(): EventDispatcher {
        if (this.instance == null) {
            this.instance = new EventDispatcher();
        }

        return this.instance;
    }
}