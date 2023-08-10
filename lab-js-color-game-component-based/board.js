import Component from './component.js';

import './board.css';

/*
 * [Event name: params]
 * click: this, color
 */
export default class Board extends Component {
    static getRootClass() {
        return '.board';
    }

    constructor(root, color) {
        super(root);

        this.colorDisplay = root.querySelector('.color-picked');
        this.messageDisplay = root.querySelector('.message');
        this.reset(color);
    }

    reset(color) {
        this.colorDisplay.textContent = color;
        this.messageDisplay.textContent = "What's the Color?";
    }

    showColor(color) {
        this.colorDisplay.textContent = color;
    }

    showCorrectMessage() {
        this.messageDisplay.textContent = "Correct!";
    }

    showWrongMessage() {
        if (this.firstClick)
            this.messageDisplay.textContent = "Try Again " + this.timer.toString();
        else
            this.messageDisplay.textContent = "Try Again";
    }

    showCountingMessage() {
        this.messageDisplay.textContent = "What's the Color?";
    }

    startClock() {
        this.firstClick = false;
        this.timer = 5;
        this.blinkTimer = 1;
        this.messageDisplay.textContent = "What's the Color? " + this.timer.toString();
        this.id = setInterval(this.countDown.bind(this), 1000);
        this.idBlink = setInterval(this.blinkCountDown.bind(this), 100);
    }
    endClock() {
        clearInterval(this.id);
        clearInterval(this.idBlink);
    }
    countDown() {
        if (this.timer == 1) {
            this.messageDisplay.textContent = "Time Out!";
            this.endClock();
            this.fire('gameOver', false);
        } else {
            this.timer--;
            if (this.firstClick)
                this.messageDisplay.textContent = "Try Again " + this.timer.toString();
            else
                this.messageDisplay.textContent = "What's the Color? " + this.timer.toString();
        }
    }
    blinkCountDown() {
        if (this.blinkTimer == 9) {
            this.fire("blink", true);
            this.blinkTimer++;
        } else if (this.blinkTimer == 10) {
            this.fire("blink", false);
            this.blinkTimer = 1;
        } else
            this.blinkTimer++;
    }
}
