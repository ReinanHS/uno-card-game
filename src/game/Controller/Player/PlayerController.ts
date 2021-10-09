import AbstractController from "../AbstractController";
import Player from "../../Objetcs/Entities/Player/Player";
import EventDispatcher from "../../Events/EventDispatcher";
import PlayerPosition from "../../Objetcs/Entities/Player/PlayerPosition";
import HandCardList from "../../Objetcs/Entities/Player/HandCardList";
import Image = Phaser.GameObjects.Image;

export default class PlayerController extends AbstractController {
    private player: Player;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public created() {
        this.player = this.buildPlayer();
        this.buildPlayerGUI(this.player);
    }

    public update(time: number, delta: number) {
        EventDispatcher.getInstance().on('sendHandCards', (player : Player) => {
           console.log(player);
        });
    }

    private buildPlayer(): Player {
        const playerPosition: PlayerPosition = new PlayerPosition(0, this.scene);
        let handCard: HandCardList = new HandCardList();

        let player: Player = new Player('Reinan Gabriel', `https://avatars.dicebear.com/api/big-ears-neutral/reinan.svg?size=84`, handCard, 0, true);
        player.positions = playerPosition;

        return player;
    }

    private buildPlayerGUI(player : Player): void {
        const photoPlayerKey = `photo_player_${player.positionIndex}`;
        const radius : number = Math.min(84,   84) / 2;

        let circle = this.scene.add.graphics()
            .setPosition(player.positions.uiPositionX - 40, player.positions.uiPositionY - 40)
            .fillCircle(0, 0, radius);

        let photoImage : Image = this.scene.add.image(circle.x, circle.y, null);
        photoImage.displayWidth = 84;
        photoImage.displayHeight = 84;

        photoImage.setMask(circle.createGeometryMask());

        let loader = new Phaser.Loader.LoaderPlugin(this.scene);
        loader.svg(photoPlayerKey, player.picture);

        loader.once(Phaser.Loader.Events.COMPLETE, () => {
            photoImage.setTexture(photoPlayerKey);
            photoImage.displayWidth = 84;
            photoImage.displayHeight = 84;
            photoImage.setSize(84, 84);
        });

        loader.start();

        this.scene.make.text({
            x: photoImage.x + 140,
            y: photoImage.y - 15,
            text: player.name,
            style: {
                font: '20px monospace',
            }
        }).setOrigin(0.5, 0.5);
    }
}