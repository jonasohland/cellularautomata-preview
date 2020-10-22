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
            this._alive_next = true;
        }
    }

    kill() {
        if (this._alive) {
            this.secondary(false);
            this._alive = false;
            this._alive_next = false;
        }
    }

    /** @param {boolean} alive */
    setNextState(alive) {
        this._alive_next = alive;
    }

    commitState() {
        if (this._alive_next) {
            if (!this.isAlive())
                this.revive()
        } else {
            if (this.isAlive())
                this.kill();
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

    pushBackup() {
        this._alive_backup = this._alive;
    }

    getBackup() {
        return this._alive_backup;
    }

    popBackup() {
        if (this._alive_backup)
            this.revive();
        else
            this.kill();
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
    _alive_next = false;
    _alive_backup = false;

    /** @type {Grid} */
    _grid

    /** @type {HTMLDivElement} */
    _element
}