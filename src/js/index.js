import Grid from './grid';

import html from '../app.html';

import '../style/style.css';
import '../style/grid.css';
import '../style/helpers.css';

import '@fortawesome/fontawesome-free/css/all.css';

import 'inconsolata-fontface';
import Automata from './cellular_automata';
import Sharing from './sharing';

import { Player, PlayMode } from './player'

window.onload = () => {

    document.getElementById('root').innerHTML = html;

    const grid_container = document.getElementById('grid');
    const grid = new Grid(grid_container);
    const automata = new Automata(grid);
    const player = new Player(automata);
    const sharing = new Sharing(player, automata, grid);

    player.setPlayMode(PlayMode.CONSTRAINED);

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

    let url = new URL(document.URL);

    if(url.searchParams.get('p')) {
        sharing.import(url.searchParams.get('p'))
    }


    /* left-side control elements */
    
    window.resetcells = () => {
        grid.reset();
    };

    window.clearcells = () => {
        grid.clear();
    }

    window.startaudio = () => {
        if (!player.isPlaying()) {
            grid.backup();
            player.startPlaying();
        }
    }

    window.stopplayback = () => {
        player.stopPlaying();
        player.reset();
    }

    window.setspeed = function(speed) {
        player.setSpeed(speed);
    }

    window.exportgrid = function() {

        let modal = document.getElementById("sharemodal");
        if (modal.classList.contains('invisible'))
            modal.classList.remove('invisible')

        let textarea = document.getElementById('presetlinkarea');
        textarea.value = sharing.export();
    }

    window.closesharedialog = () => {
        let modal = document.getElementById("sharemodal");

        if (!modal.classList.contains('invisible'))
            modal.classList.add('invisible')
    }   

    window.onclick = (event) => {

        let modal = document.getElementById("sharemodal");

        if (event.target == modal && !modal.classList.contains('invisible')) 
            modal.classList.add('invisible');
    }

    /* right-side text element language selection */

    /*let newp = document.createElement('p');
    newp.innerText = text_de;

    document.getElementById('maintextnode').appendChild(newp);

    window.textselect_de = () => {
        newp.innerText = text_de;
    }

    window.textselect_en = () => {
        newp.innerText = text_en;
    }*/
}