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


/*
    byte    | size  | desc
    --------------------------------
    0       | 1     | version
    1       | 1     | scale
    2       | 1     | rules
    3       | 1     | play option bits
    4       | 4     | (float) playback_speed
    8       | 4     | (uint32) rows
    12      | 4     | (uint32) cols
    16      | (r*c) | data

    play options: 
    
    bit     | desc
    -----------------
    0       | palindrome
    1       | constrain
*/

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

        let play_options = 0;

        if (this._player._constrainbutton.get())
            play_options = setbits(play_options, PlayOptionBits.CONSTRAIN);

        if (this._player._palindromebutton.get())
            play_options = setbits(play_options, PlayOptionBits.PALINDROME);

        view.setUint8(0, PROTOCOL_VERSION);

        view.setUint8(1, this._player._scaleselect.index());
        view.setUint8(2, this._automata._ruleselect.index());
        view.setUint8(3, play_options);

        view.setFloat32(4, this._player._speedslider.get());

        view.setUint32(8, this._grid.rows());
        view.setUint32(12, this._grid.columns());

        for (let i = 0; i < this._grid._cells.length; ++i) {

            let byte = Math.floor(i / 8);
            let bit = i - (byte * 8);

            if (this._grid._cells[i].isAlive())
                view.setUint8(16 + byte, setbits(view.getUint8(16 + byte), bit));
        }

        let url = new URL(window.location);

        for (let pr of url.searchParams.keys())
            url.searchParams.delete(pr);

        url.searchParams.append('p', base64url.stringify(new Uint8Array(data)));
        
        return url.toString();
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

        this._player._scaleselect.setIndex(view.getUint8(1));
        this._automata._ruleselect.setIndex(view.getUint8(2));

        let play_options = view.getUint8(3);

        if (getbit(play_options, PlayOptionBits.CONSTRAIN))
            this._player._constrainbutton.set(true);
        else
            this._player._constrainbutton.set(false);

        if (getbit(play_options, PlayOptionBits.PALINDROME))
            this._player._palindromebutton.set(true);
        else
            this._player._palindromebutton.set(false);

        this._player._speedslider.set(view.getFloat32(4));
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