import Player from "./Player";

export default class PlayerRoundIterator{
    private readonly _players : Array<Player> = new Array<Player>();

    constructor(players: Array<Player>) {
        this._players = players;
    }

    get players(): Array<Player> {
        return this._players;
    }
}