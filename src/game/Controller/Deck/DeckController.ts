import AbstractController from "../AbstractController";
import CardDeck from "../../Objetcs/Entities/Cards/CardDeck";
import EventDispatcher from "../../Events/EventDispatcher";


export default class DeckController extends AbstractController{
    private cardDeck : CardDeck;

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    public beforeCreate() {
        this.cardDeck = new CardDeck();
    }

    public created() {
        EventDispatcher.getInstance().on('teste', () => {
            console.log('Teste')
        });
    }
}