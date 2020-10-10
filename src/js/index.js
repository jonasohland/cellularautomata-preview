import * as Tone from 'tone'
import Grid from './grid'

import html from '../app.html'

import '../style/style.css'
import '../style/grid.css'
import '../style/helpers.css'

import '@fortawesome/fontawesome-free/css/all.css'

import { text_de, text_en } from './text';

import 'inconsolata-fontface'

window.onload = () => {

    document.getElementById('root').innerHTML = html;

    const grid_container = document.getElementById('grid');
    const grid = new Grid(grid_container);

    let current_col = 0;
    let last_col = 0;

    setInterval(() => {

        for (let i = 0; i < grid.rows(); ++i) {
            grid.cell(i, last_col).primary(false);
            grid.cell(i, current_col).primary(true);
        }

        last_col = current_col;
        
        if (++current_col == grid.columns()) {
            current_col = 0;
        }

    }, 250);

    window.resetcells = () => {
        grid.killAllCells();
    };

    window.startaudio = () => {
        console.log('startaudio');
    }

    window.stopplayback = () => {
        console.log('stopplayback');
    }

    window.setspeed = function(event) {
        console.log(event);
    }

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