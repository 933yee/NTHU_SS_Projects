import Component from './component.js';
import Mode from './mode.js';

import './navbar.css';

/*
 * [Event name: params]
 * none
 */
export default class Navbar extends Component {
    static getRootClass() {
        return '.navbar';
    }

    constructor(root) {
        super(root);
        let els = root.querySelectorAll(".mode");
        this.easy = els[0];
        this.hard = els[1];
        this.nightmare = els[2];
        // easy
        let mode = new Mode(this.easy);
        mode.on('click', this.handleEasyClick.bind(this));
        this.easy.style.color = "white";
        this.easy.style.backgroundColor = "steelblue";

        // hard
        mode = new Mode(this.hard);
        mode.on('click', this.handleHardClick.bind(this));

        // nightmare
        mode = new Mode(this.nightmare);
        mode.on('click', this.handleNightmareClick.bind(this));

        this.brand = root.querySelector('.brand');
        this.reset();
    }

    reset() {
        clearInterval(this.id);
    }

    handleEasyClick() {
        this.easy.style.color = "white";
        this.easy.style.backgroundColor = "steelblue";
        this.hard.style.color = "#484848";
        this.hard.style.backgroundColor = "white";
        this.nightmare.style.color = "#484848";
        this.nightmare.style.backgroundColor = "white";
        this.fire('easyClick');
    }
    handleHardClick() {
        this.easy.style.color = "#484848";
        this.easy.style.backgroundColor = "white";
        this.hard.style.color = "white";
        this.hard.style.backgroundColor = "steelblue";
        this.nightmare.style.color = "#484848";
        this.nightmare.style.backgroundColor = "white";
        this.fire('hardClick');
    }
    handleNightmareClick() {
        this.easy.style.color = "#484848";
        this.easy.style.backgroundColor = "white";
        this.hard.style.color = "#484848";
        this.hard.style.backgroundColor = "white";
        this.nightmare.style.color = "white";
        this.nightmare.style.backgroundColor = "steelblue";
        this.fire('nightmareClick');
    }
}
