import Cell from './cell'

export default class Grid {

    /**
     * @param {HTMLDivElement} container 
     */
    constructor(container) 
    {
        let computed_style = getComputedStyle(container)
        let columns = computed_style['grid-template-columns'].split(" ").length;
        let rows = computed_style['grid-template-rows'].split(" ").length;

        for (let i = 0; i < rows * columns; ++i) {

            let new_element = document.createElement('div');
            new_element.classList.add('grid-item');

            container.appendChild(new_element);
            this._cells.push(new Cell(new_element));
        }

        this._width = columns;
    }

    /**
     * @param {number} row
     * @param {number} column 
     */
    cell(row, column) {
        return this._cells[row * this._width + column];
    }

    columns() {
        return this._width;
    }

    rows() {
        return Math.floor(this._cells.length / this._width);;
    }

    /** @type {Array<Cell>} */
    _cells = [];
}