import * as Tone from 'tone'
import Grid from './grid'

import html from '../app.html'

import '../style/style.css'
import '../style/grid.css'
import '../style/helpers.css'

import '@fortawesome/fontawesome-free/css/all.css'

import { text_de, text_en } from './text';

import 'inconsolata-fontface'
import Automata from './cellular_automata'
import { Player, PlayMode } from './player'

window.onload = () => {

    document.getElementById('root').innerHTML = html;

    const grid_container = document.getElementById('grid');
    const grid = new Grid(grid_container);
    const automata = new Automata(grid);
    const player = new Player(automata);

    player.setPlayMode(1);
    player.startPlaying();

    const constrainbutton = document.getElementById('constrainbutton');
    window.toggleplaymode = () => {
        if (player.playMode() == PlayMode.NORMAL) {
            player.setPlayMode(PlayMode.CONSTRAINED);
            constrainbutton.classList.add('b-toggle-on');
        }
        else {
            player.setPlayMode(PlayMode.NORMAL);
            if (constrainbutton.classList.contains('b-toggle-on'))
                constrainbutton.classList.remove('b-toggle-on');
        }
    }

    /* left-side control elements */
    
    window.resetcells = () => {
        grid.killAllCells();
    };

    window.startaudio = () => {
        console.log('startaudio');
    }

    window.stopplayback = () => {
        console.log('stopplayback');
    }

    window.setspeed = function(speed) {
        player.setSpeed(speed);
    }


    /* right-side text element language selection */

    let newp = document.createElement('p');
    newp.innerText = text_de;

    document.getElementById('maintextnode').appendChild(newp);

    window.textselect_de = () => {
        newp.innerText = text_de;
    }

    window.textselect_en = () => {
        newp.innerText = text_en;
    }
}