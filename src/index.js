import * as Tone from 'tone'
import Grid from './grid'

import html from './app.html'

import './style/style.css'
import './style/grid.css'


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
        
        if (++current_col == grid.columns()) 
            current_col = 0;

    }, 250);
    
}

window.startaudio = function() {

}