import Grid from './grid';

export default class Cell {
    
    /**
     * @param {HTMLDivElement} element
     * @param {Grid} grid 
     */
    constructor(element, grid, row, col) {

        this._element = element
        this._grid = grid;

        this._row = row;
        this._col = col;

        this._element.onclick = () => {
            if (this.isAlive()) 
                this.kill();
            else
                this.revive();
        }
    }

    revive() {
        if (!this._alive) {
            this.secondary(true);
            this._alive = true;
        }
    }

    kill() {
        if (this._alive) {
            this.secondary(false);
            this._alive = false;
        }
    }

    isAlive() {
        return this._alive;
    }

    row() {
        return this._row;
    }

    col() {
        return this._col;
    }

    /**
     * @param {boolean} active 
     */
    primary(active) {
        if (active) {
            if (this._alive)
                this._modify_class(true, 'grid-item--active-full');
            else
                this._modify_class(true, 'grid-item--active-primary');
        } else {
            this._modify_class(false, 'grid-item--active-full');
            this._modify_class(false, 'grid-item--active-primary');
        }
    }

    /**
     * @param {boolean} active 
     */
    secondary(active) {
        this._modify_class(active, 'grid-item--active-secondary');
    }

    /**
     * @param {boolean} set 
     * @param {string} cssclass 
     */
    _modify_class(set, cssclass) {
        if (set) { 
            if (!this._element.classList.contains(cssclass))
                this._element.classList.add(cssclass);
        } 
        else {
            if (this._element.classList.contains(cssclass))
                this._element.classList.remove(cssclass);
        }
    }

    _row = -1;
    _col = -1;
    
    _alive = false;

    /** @type {Grid} */
    _grid

    /** @type {HTMLDivElement} */
    _element
}