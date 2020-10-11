import Automata from './cellular_automata';
import * as Tone from 'tone';

export const PlayMode = {
    NORMAL: 0,  
    CONSTRAINED: 1 
}

class Synth {

}

export class Player {
    

    /**
     * 
     * @param {Automata} automata 
     */
    constructor(automata) {
        this._automata = automata;

        this._synth = new Tone.Sampler({
            urls: {
                A1: "A1.mp3",
                A2: "A2.mp3",
            },
            baseUrl: "https://tonejs.github.io/audio/casio/",
            onload: () => {
                sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
            }
        }).toDestination();
    }

    startPlaying(play_mode) {
        this._play_cb();
    }

    stopPlaying() {

    }

    /** @param {number} mode */
    setPlayMode(mode) {
        this._play_mode = mode;
    }

    playMode()
    {
        return this._play_mode;
    }

    setSpeed(speed) {
        this._tick_time = Math.pow(20, (100 - speed) / 100) * 50;
        console.log(this._tick_time);
    }

    _play_cb() {
        console.log("play");
        this._advance_play_head();

        let cells_to_play = this._automata._grid.col(this._current_col).filter(cll => cll.isAlive());
        let notes_to_play = cells_to_play.map(cl => cl.row()).map(num => this._scale[num]);
        
        console.log(notes_to_play);

        this._synth.triggerAttackRelease(notes_to_play, 2.)

        this._play_timeout = setTimeout(this._play_cb.bind(this), this._tick_time);
    }

    _advance_play_head() {
        
        this._clear_play_head();

        if (this._play_mode == PlayMode.CONSTRAINED) {
            if (this._automata.nextColWithAliveCells(this._current_col + 1) != -1) 
                ++this._current_col;
            else {
                let first_alive = this._automata.nextColWithAliveCells(0);
                if (first_alive != -1)
                    this._current_col = first_alive;
                else
                    this._advance_play_head_default();
            }
        } else 
            this._advance_play_head_default();
        
        this._render_play_head();
    }

    _advance_play_head_default()
    {
        ++this._current_col;
        if (this._current_col >= this._automata._grid.columns()) {
            this._current_col = 0;
            this._gen_loop();
        }
    }

    _clear_play_head() {
        this._automata._grid.col(this._current_col).forEach(cll => cll.primary(false));
    }

    _render_play_head() {
        this._automata._grid.col(this._current_col).forEach(cll => cll.primary(true));
    }
    
    _gen_loop() {
        this._automata.advanceGeneration();
    }

    _play_mode = 0;
    _play_timeout = null;

    _tick_time = 200;
    _current_col = 0;

    /** @type {Automata} */
    _automata

    _synth; 

    _scale = ['C3', 'Eb3', 'F3', 'G3', 'B3', 'C4', 'Eb4', 'F4', 'G4', 'B4', 'C5', 'Eb5', 'F5', 'G5', 'B5'];

}