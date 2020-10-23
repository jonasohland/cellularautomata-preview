import '../style/button.css'
import '../style/select.css'

export class ToggleButton {
    
    /**
     * @param {HTMLElement} element_id 
     */
    constructor(element_id) {
        this._el = document.getElementById(element_id);
        this._el.onclick = this._onclick.bind(this);
        this._update();
    }

    /**
     * @param {boolean} value 
     */
    set(value) {
        this.setSilent(value);
        this.onclick();
        this.onchange(value);
    }

    get() {
        return this._value;
    }

    /**
     * @param {boolean} value 
     */
    setSilent(value) {
        this._value = value;
        this._update();
    }

    _onclick() {
        this._value = !this._value;
        this._update();
        this.onclick();
        this.onchange(this._value);
    }

    _update() {
        if (this._value) {
            if (!this._el.classList.contains('b-toggle-on'))
                this._el.classList.add('b-toggle-on');
        }
        else {
            if (this._el.classList.contains('b-toggle-on'))
                this._el.classList.remove('b-toggle-on');
        }
    }

    /** @type {() => void} */
    onclick = () => {};

    /** @type {(value: boolean) => void} */
    onchange = (value) => {};

    /** @type {HTMLButtonElement} */
    _el = null;

    /** @type {boolean} */
    _value = false;
};

export class Select {

    /**
     * 
     * @param {string} wrapperid 
     */
    constructor (selectid) {
        this._el = document.getElementById(selectid);
        this._el.onchange = this._onchange.bind(this);
    }   

    clear() {

    }

    addItem(item) {
        let newitem = document.createElement("option");
        newitem.innerText = item.name;
        this._values.push(item);
        this._el.appendChild(newitem);
    }

    removeItem(item) {
        let rmv_el = Array.from(this._el.childNodes.values()).find(el => el.innerText === item.name);
        if (rmv) {
            this._el.removeChild(rmv_el);
            let item_idx = this._values.findIndex(x => x.name === text);
            if (item_idx != -1) {
                this._values.splice(item_idx, 1);
            }
        }
    }

    removeItemByName(itemName) {
        let rmv_el = Array.from(this._el.childNodes.values()).find(el => el.innerText === itemName);
        if (rmv) {
            this._el.removeChild(rmv_el);
            let item_idx = this._values.findIndex(x => x.name === itemName);
            if (item_idx != -1) {
                this._values.splice(item_idx, 1);
            }
        }
    }

    index() {
        return this._values.findIndex(x => x.name === this._el.value);
    }   

    setIndex(idx) {
        let el = this._values[idx];
        if (el) {
            this._el.value = el.name;
        }
    }

    selected() {
        let text = this._el.value;
        return this._values.find(x => x.name === text);
    }

    _onchange() {
        this.onchange();
    }

    _values = [];

    onchange = (newvalue) => {};

    /** @type {HTMLSelectElement} */
    _el
};

export class Slider {

    constructor(sliderid) {
        this._el = document.getElementById(sliderid);
        this._el.oninput = this._onchange.bind(this); 
    }

    get() {
        return Number.parseFloat(this._el.value);
    }

    set(value) {
        this._el.value = value;
        this._onchange();
    }

    _onchange() {
        console.log(this._el.value);
        this.onchange();
    }

    onchange = () => {};

    /** @type {HTMLInputElement} */
    _el = null;

}