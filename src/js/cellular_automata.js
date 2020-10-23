import Grid from './grid';
import Cell from './cell';
import { Select } from './ui';

const gol_ruletext = `
<p>if (cell = alive AND neighbours > 3)<br>
&nbsp;cell = dead<br></p>
<p>if (cell = alive AND neighbours < 2)<br>
&nbsp;cell = dead<br></p>
<p>if (cell = dead AND neighbours = 3)<br>
&nbsp;cell = alive</p>`;


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

        } else {
            if (num_ngh_alive == 3)
                cell.setNextState(true);
        }
    }

    /**
     * @param {number} row 
     * @param {number} col 
     * @param {Grid} grid 
     */
    rule2(row, col, grid) {
        if (Math.random() < 0.15)
            grid.cell(row, col).setNextState(true);
        else
            grid.cell(row, col).setNextState(false);
    }

    staticRule()
    {}

    rules() {
        return [
            { name: "game of life", ruletext: gol_ruletext, function: this.rule1.bind(this) },
            { name: "random", ruletext: "this is just here to debug stuff", function: this.rule2.bind(this) },
            { name: "static", ruletext: "this is just here to debug stuff", function: this.staticRule.bind(this) },
        ];
    }
}

export default class Automata {

    /** @param {Grid} grid */
    constructor(grid) {
        this._grid = grid;
        this._rules = new Rules();
        this._ruleselect = new Select("ruleselect");

        this._rules.rules().forEach(rule => this._ruleselect.addItem(rule));
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
            for (let y = 0; y < this._grid.rows(); ++y)
                this._ruleselect.selected().function(y, x, this._grid);
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

    /** @type {Select} */
    _ruleselect = null;

    /** @type {Grid} */
    _grid
}