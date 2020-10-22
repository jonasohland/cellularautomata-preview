import Grid from './grid';
import Cell from './cell';


export class Rules {

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @param {Grid} grid 
     */
    getNeighbours(row, col, grid) {
        let rows = grid.rows();
        let cols = grid.columns();
        let nghbrs = [];

        
        if (row - 1 >= 0) {
            nghbrs.push(grid.cell(row - 1, col));
            if (col - 1 >= 0)
                nghbrs.push(grid.cell(row - 1, col - 1));
            if (col + 1 < cols )
                nghbrs.push(grid.cell(row - 1, col + 1));
        }
        if (row + 1 < rows) {
            nghbrs.push(grid.cell(row + 1, col));
            if (col - 1 >= 0)
                nghbrs.push(grid.cell(row + 1, col - 1));
            if (col + 1 < cols)
                nghbrs.push(grid.cell(row + 1, col + 1));
        }
        if (col - 1 >= 0)
            nghbrs.push(grid.cell(row, col - 1));
        if (col + 1 < cols)
            nghbrs.push(grid.cell(row, col + 1));

        return nghbrs;
    }

    /**
     * @param {number} row 
     * @param {number} col 
     * @param {Grid} grid 
     */
    rule1(row, col, grid) {
        let num_ngh_alive = this.getNeighbours(row, col, grid).filter(cell => cell.isAlive()).length;
        let cell = grid.cell(row, col);

        if (cell.isAlive()) {
            if (num_ngh_alive > 3) 
                cell.setNextState(false);
            if (num_ngh_alive < 2)
                cell.setNextState(false);

            console.log(num_ngh_alive);
        } else {
            if (num_ngh_alive == 3)
                cell.setNextState(true);
        }
    }

    /**
     * 
     * @param {number} row 
     * @param {number} col 
     * @param {Array<Cell>} cells 
     */
    applyRules(row, col, grid) {
        this.rule1(row, col, grid);
    }
}

export default class Automata {

    /** @param {Grid} grid */
    constructor(grid) {
        this._grid = grid;
        this._rules = new Rules();
    }

    /**
     * @param {Grid} grid
     */
    renderToGrid()
    {
    }

    advanceGeneration()
    {
        for (let x = 0; x < this._grid.columns(); ++x) {
            for (let y = 0; y < this._grid.rows(); ++y) {
                this._rules.applyRules(y, x, this._grid);
            }
        }

        this._grid._cells.forEach(cell => cell.commitState());
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

    nextColWithAliveCells(search_start_col, search_bwd)
    {
        if (search_start_col >= this._grid.columns())
            return -1;

        if (search_bwd) {
            for (let i = search_start_col; i <= 0; --i) {
                if (this._grid.col(i).filter(cll => cll.isAlive()).length > 0)
                    return i;
            }
        } else {
            for (let i = search_start_col; i < this._grid.columns(); ++i) {
                if (this._grid.col(i).filter(cll => cll.isAlive()).length > 0)
                    return i;
            }
        } 

        return -1;
    }

    /*
        byte    | size  | desc
        --------------------------------
        0       | 1     | version
        1       | 1     | scale
        2       | 1     | play option bits
        3       | 1     | reserved
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


    /** @type {Grid} */
    _grid
}