import Component from './component.js';

import './mode.css';

/*
 * [Event name: params]
 * none
 */
export default class Mode extends Component {
    static getRootClass() {
        return '.mode';
    }

    constructor(root) {
        super(root);
        root.addEventListener("click", this.handleDomClick.bind(this));
        this.reset();
    }

    reset() {
        // do nothing
    }

    handleDomClick(e) {
        this.fire('click');
    }
}
