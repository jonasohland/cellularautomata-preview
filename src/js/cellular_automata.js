import Grid from './grid';
import Cell from './cell';

export class Rules {

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @param {Array<Cell>} cells 
     */
    applyRules(row, col, cells) {
        
    }
}

export default class Automata {

    /** @param {Grid} grid */
    constructor(grid) {
        this._grid = grid
    }

    /**
     * @param {Grid} grid
     */
    renderToGrid()
    {
    }

    advanceGeneration()
    {
    }

    /**
     * @param {number} col 
     */
    activeCellsInColumn(col)
    {

    }

    hasAliveCells()
    {
        return this._grid._cells.filter(cell => cell.isAlive()).length > 0;
    }

    nextColWithAliveCells(search_start_col)
    {
        if (search_start_col >= this._grid.columns())
            return -1;

        for (let i = search_start_col; i < this._grid.columns(); ++i) {
            if (this._grid.col(i).filter(cll => cll.isAlive()).length > 0)
                return i;
        }

        return -1;
    }

    /** @type {Grid} */
    _grid
}