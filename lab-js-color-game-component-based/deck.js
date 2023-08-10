import Component from './component.js';
import Card from './card.js';

import './deck.css';

/*
 * [Event name: params]
 * wrongClick: this
 * rightClick: this, pickedColor
 */
export default class Deck extends Component {
    static getRootClass() {
        return '.deck';
    }

    constructor(root) {
        super(root);
        this.cardNum = 3;
        this.gameOver = false;
        this.cards = [];
        const els = root.querySelectorAll(Card.getRootClass());
        for (let i = 0; i < els.length; i++) {
            const card = new Card(els[i]);
            card.on('click', this.handleCardClick.bind(this));
            this.cards.push(card);
            if (i >= this.cardNum)
                els[i].style.display = "none";
        }
        this.pickedColor = this.pickColor();
    }

    reset() {
        this.gameOver = false;
        for (let i = 0; i < this.cards.length; i++) {
            this.cards[i].reset();
            if (i < this.cardNum)
                this.cards[i].root.style.display = "block";
            else
                this.cards[i].root.style.display = "none";
        }

        this.pickedColor = this.pickColor();
    }

    getPickedColor() {
        return this.pickedColor;
    }

    handleCardClick(firer, color) {
        if (this.gameOver)
            return;

        if (color === this.pickedColor) {
            for (let card of this.cards)
                card.fadeIn("#FFF");
            this.gameOver = true;
            this.fire('rightClick', this.pickedColor);
        } else {
            firer.fadeOut();
            this.fire('wrongClick');
        }
    }

    pickColor() {
        const random = Math.floor(Math.random() * this.cardNum);
        return this.cards[random].getColor();
    }

    modifyCardNum(num) {
        this.cardNum = num;
        this.reset();
    }

    white() {
        for (let card of this.cards) {
            card.white();
        }
    }
}
