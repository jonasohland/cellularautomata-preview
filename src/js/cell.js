import Grid from './grid';

export default class Cell {
    
    /**
     * @param {HTMLDivElement} element
     * @param {Grid} grid 
     */
    constructor(element, grid) {
        this._element = element
        this._grid = grid;
        this._element.onclick = () => {
            this.secondary(true);
        }
    }

    /**
     * 
     * @param {paper.Rectangle} bounds 
     */
    setBounds(bounds) {
        this._bounds = bounds;
    }

    /**
     * @param {boolean} active 
     */
    primary(active) {
        this._modify_class(active, 'grid-item--active-primary');
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

    
    _alive = false;

    /** @type {Grid} */
    _grid

    /** @type {HTMLDivElement} */
    _element
}