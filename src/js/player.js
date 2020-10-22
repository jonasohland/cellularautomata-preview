import Automata from './cellular_automata';
import * as Tone from 'tone';
import scales from '../scales.json'

console.log(scales);

export const PlayMode = {
    NORMAL: 0,  
    CONSTRAINED: 1 
}

export const PlayDirection = {
    FORWARD: 0,
    PALINDROME: 1
}

class Synth {

}

console.log(scales[0]);

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
        }).toDestination();
    }

    startPlaying() {
        if (this._play_timeout == null) {
            Tone.context.resume().then(() => {
                this._play_cb();
            });
        }
    }

    stopPlaying() 
    {
        if (this._play_timeout) {
            clearTimeout(this._play_timeout);
            this._play_timeout = null;
        }
    }

    /** @param {number} mode */
    setPlayMode(mode) 
    {
        this._play_mode = mode;
    }

    enablePalindrome() 
    {
        this._palindrome = 1;
    } 

    disablePalindrome() 
    {
        this._palindrome = 0;
    } 

    playMode()
    {
        return this._play_mode;
    }

    isPlaying()
    {
        return this._play_timeout != null;
    }

    setSpeed(speed) {
        this._tick_time = Math.pow(20, (100 - speed) / 100) * 50;
        console.log(this._tick_time);
    }

    reset()
    {
        this._clear_play_head();
        this._current_col = 0;
        this._render_play_head();
    }

    _play_cb() {

        console.log("play");
        this._advance_play_head();

        let cells_to_play = this._automata._grid.col(this._current_col).filter(cll => cll.isAlive());
        let notes_to_play = cells_to_play.map(cl => cl.row()).map(num => scales[this._selected_scale].scale[num]);

        console.log(notes_to_play);

        this._synth.triggerAttackRelease(notes_to_play, 2.);

        this._play_timeout = setTimeout(this._play_cb.bind(this), this._tick_time);
    }

    _advance_play_head() {
        
        this._clear_play_head();

        if (this._play_mode == PlayMode.CONSTRAINED) {

            if (this._palindrome) {

            }
            else {
                // next alive cells ahead
                if (this._automata.nextColWithAliveCells(this._current_col + 1) != -1) 
                    ++this._current_col;
                else {
                    let first_alive = this._automata.nextColWithAliveCells(0);
                    if (first_alive != -1) {
                        this._current_col = first_alive;
                        this._gen_loop();
                    }
                    else
                        this._advance_play_head_default();
                }
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
    _palindrome = 0;
    
    /** @type */
    _play_timeout = null;

    _tick_time = 200;

    _current_direction = 1;
    _current_col = 0;

    /** @type {Automata} */
    _automata

    _synth; 

    _selected_scale = 0;
}