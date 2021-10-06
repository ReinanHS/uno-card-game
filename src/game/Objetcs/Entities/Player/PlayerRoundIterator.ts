import Player from "./Player";
import PlayerGui from "./PlayerGui";

export default class PlayerRoundIterator{
    private readonly _players : Array<Player> = new Array<Player>();
    private _gui : Array<PlayerGui> = new Array<PlayerGui>();
    private _currentPlayerIndex: number = 0;

    constructor(players: Array<Player>) {
        this._players = players;
    }

    get players(): Array<Player> {
        return this._players;
    }

    get gui(): Array<PlayerGui> {
        return this._gui;
    }

    set gui(value: Array<PlayerGui>) {
        this._gui = value;
    }

    get currentPlayerIndex(): number {
        return this._currentPlayerIndex;
    }

    get currentPlayer(): Player {
        return this._players[this._currentPlayerIndex];
    }

    public nextPlayer(){
        this._currentPlayerIndex = (this.currentPlayerIndex + 1) % this._players.length;
    }
}