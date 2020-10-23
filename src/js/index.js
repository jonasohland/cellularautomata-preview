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

    window.showruleinfo = () => {
        let modal = document.getElementById("rulemodal");
        let textnode = document.getElementById("rulemodaltext");
        let titlenode = document.getElementById("rulemodaltitle");
        
        textnode.innerHTML = automata._ruleselect.selected().ruletext;
        titlenode.innerText = automata._ruleselect.selected().name;

        if (modal.classList.contains('invisible'))
            modal.classList.remove('invisible');
    }

    window.closerulemodal = () => {
        let rulemodal = document.getElementById("rulemodal");

        if (!rulemodal.classList.contains('invisible')) 
            rulemodal.classList.add('invisible');
    }

    window.onclick = (event) => {

        let sharemodal = document.getElementById("sharemodal");

        if (event.target == sharemodal && !sharemodal.classList.contains('invisible')) 
            sharemodal.classList.add('invisible');

        let rulemodal = document.getElementById("rulemodal");

        if (event.target == rulemodal && !rulemodal.classList.contains('invisible')) 
            rulemodal.classList.add('invisible');
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