import Component from './component.js';
import Navbar from './navbar.js';
import Board from './board.js';
import Deck from './deck.js';
import Reset from './reset.js';

import './main.css';

export default class Main extends Component {
    static getRootClass() {
        return '.main';
    }

    constructor(root) {
        super(root);
        this.mode = "easy";
        this.navbar = new Navbar(root.querySelector('.navbar'));
        this.navbar.on('easyClick', this.handleEasyClick.bind(this));
        this.navbar.on('hardClick', this.handleHardClick.bind(this));
        this.navbar.on('nightmareClick', this.handleNightmareClick.bind(this));

        this.deck = new Deck(root.querySelector('.deck'));
        this.deck.on('wrongClick', this.handleDeckWrongClick.bind(this));
        this.deck.on('rightClick', this.handleDeckRightClick.bind(this));

        this.board = new Board(root.querySelector('.board'), this.deck.getPickedColor());
        this.board.on('gameOver', this.handleGameStatus.bind(this));
        this.board.on('blink', this.handleBlink.bind(this));

        this.reset = new Reset(root.querySelector('.reset'));
        this.reset.on('click', this.handleResetClick.bind(this));
    }

    handleDeckWrongClick(firer) {
        if (this.mode == "nightmare")
            this.board.firstClick = true;
        this.board.showWrongMessage();

    }

    handleDeckRightClick(firer, pickedColor) {
        this.root.style.backgroundColor = pickedColor;
        this.board.showCorrectMessage();
        this.handleGameStatus(firer, true);
    }

    handleResetClick(firer) {
        if (this.mode == "nightmare")
            this.handleNightmareClick(firer);
        else
            this.resetMain(firer);
    }
    resetMain(firer) {
        this.root.style.backgroundColor = "#232323";
        this.navbar.reset();
        this.deck.reset();
        this.board.reset(this.deck.getPickedColor());
        firer.reset();
        if (this.mode == "nightmare")
            this.reset.hide();
        else
            this.reset.show();
    }
    handleEasyClick(firer) {
        this.mode = "easy";
        this.resetMain(firer);
        this.deck.modifyCardNum(3);
        this.board.endClock();
        this.board.showCountingMessage();
    }

    handleHardClick(firer) {
        this.mode = "hard";
        this.resetMain(firer);
        this.deck.modifyCardNum(6);
        this.board.endClock();
        this.board.showCountingMessage();
    }

    handleNightmareClick(firer) {
        this.mode = "nightmare";
        this.resetMain(firer);
        this.board.showCountingMessage();
        this.board.endClock();
        this.deck.modifyCardNum(6);
        this.board.startClock();
    }
    handleGameStatus(firer, win) {
        this.reset.showPlayAgain();
        this.reset.show();
        if (win) {
            this.deck.gameOver = true;
            this.board.endClock();
        } else {
            this.deck.gameOver = true;
            this.deck.white();
            this.root.style.backgroundColor = this.deck.getPickedColor();
        }
    }
    handleBlink(firer, open) {
        if (open)
            this.root.style.backgroundColor = "#777777";
        else
            this.root.style.backgroundColor = "#232323";
    }
}

window.onload = function () {
    const body = document.querySelector('body');
    new Main(body);
};
