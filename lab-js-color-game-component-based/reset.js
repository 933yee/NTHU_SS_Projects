import Component from './component.js';

import './reset.css';

/*
 * [Event name: params]
 * click: this
 */
export default class Reset extends Component {
    static getRootClass() {
        return '.reset';
    }

    constructor(root) {
        super(root);

        root.addEventListener("click", this.handleDomClick.bind(this));
        this.resetDisplay = root.querySelector(".reset span");
        this.reset();
    }

    reset() {
        this.resetDisplay.textContent = "New Color";
    }

    showPlayAgain() {
        this.resetDisplay.textContent = "Play Again";
    }

    hide() {
        this.root.style.visibility = "hidden";
    }

    show() {
        this.root.style.visibility = "visible";
    }

    handleDomClick(e) {
        this.fire('click');
    }
}
