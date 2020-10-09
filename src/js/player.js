import Automata from './cellular_automata';

class Synth {

}

export default class Player {
    

    /**
     * 
     * @param {Automata} automata 
     */
    constructor(automata) {
        this._automata = automata;
    }


    
    _gen_loop_cb() {
        this._automata.advanceGeneration();
    }

    /** @type {Automata} */
    _automata

}