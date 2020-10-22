import * as scales from '../scales.json';
import { getbit, setbits } from './util';
import { base64url } from 'rfc4648';

import {Player, PlayMode} from './player';
import Grid from './grid';
import Automata from './cellular_automata';

const SUPPORTED_PROTOCOL_VERSIONS = [ 0 ];
const PROTOCOL_VERSION = 0;

const PlayOptionBits = {
    CONSTRAIN: 1,
    PALINDROME: 2
};

export default class Sharing {

    constructor(player, automata, grid) {
        this._player = player;
        this._automata = automata;
        this._grid = grid;
    }

    export()
    {
        let cells = this._grid.rows() * this._grid.columns();
        let bytes = Math.floor(cells / 8);
        
        if ((cells / 8) - bytes > 0)
            ++bytes;

        let data = new ArrayBuffer(16 + bytes);
        let view = new DataView(data);

        view.setUint8(0, PROTOCOL_VERSION);
        view.setUint32(8, this._grid.rows());
        view.setUint32(12, this._grid.columns());

        for (let i = 0; i < this._grid._cells.length; ++i) {

            let byte = Math.floor(i / 8);
            let bit = i - (byte * 8);

            if (this._grid._cells[i].isAlive())
                view.setUint8(16 + byte, setbits(view.getUint8(16 + byte), bit));
        }

        return window.location + "?p=" + base64url.stringify(new Uint8Array(data));
    }

    import(b64string) 
    {
        let data = base64url.parse(b64string);
        let view = new DataView(data.buffer);

        if (view.byteLength < 13)
            return console.log("Not enough data to parse");

        let version = view.getUint8(0);

        if (!SUPPORTED_PROTOCOL_VERSIONS.includes(version))
            return console.log("Unsupported protocol version");

        let scale = view.getUint8(1);

        if (scale >= scales.length)
            return console.log("Value for scale out of range");

        let play_options = view.getUint8(2);

        if (getbit(play_options, PlayOptionBits.CONSTRAIN))
            this._player.setPlayMode(PlayMode.CONSTRAINED);
        else
            this._player.setPlayMode(PlayMode.NORMAL);

        if (getbit(play_options, PlayOptionBits.PALINDROME))
            this._player.enablePalindrome();
        else
            this._player.disablePalindrome();

        let playback_speed = view.getFloat32(4);
        let rows = view.getUint32(8);
        let cols = view.getUint32(12);

        if (rows != this._grid.rows())
            throw "Row count mismatch";

        if (cols != this._grid.columns())
            throw "Column count mismatch";
        
        let cells = this._grid.rows() * this._grid.columns();
        let bytes = Math.floor(cells / 8);

        if ((cells / 8) - bytes > 0)
            ++bytes;

        if (!(16 + bytes == data.length))
            return console.log("Size mismatch");

        for (let i = 0; i < this._grid._cells.length; ++i) {
            let byte = Math.floor(i / 8);
            let bit = i - (byte * 8);

            this._grid._cells[i].setNextState(getbit(view.getUint8(16 + byte), bit));
        }

        this._grid._cells.forEach(cell => cell.commitState());
    }

    /** @type {Player} */
    _player;

    /** @type {Automata} */
    _automata;
    /** @type {Grid} */
    _grid;
}