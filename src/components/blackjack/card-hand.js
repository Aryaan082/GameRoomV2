import * as React from 'react';

const cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const cardSuits = ["S", "H", "C", "D"];
let cardsUsed = [];

class CardHand {
    constructor(playerName) {
        cardsUsed = [];
        this.name = playerName;
        this.cardsInHand = [];
        this.alive = true;
        this.points = 0;
    }

    calculatePoints() {
        this.aces = 0;
        this.points = 0;
        for (var i = 0; i < this.cardsInHand.length; i++) {
            if (this.cardsInHand[i].charAt(0) === "A") {
                this.aces += 1;
                continue;
            }
            let index = cardValues.indexOf(this.cardsInHand[i].charAt(0));
            let value;
            
            if (index >= 9 || this.cardsInHand[i].charAt(0) === '1') {
                value = 10;
            } else {
                value = index + 1;
            }
            this.points += value;
        }

        for (var j = 0; j < this.aces; j++) {
            this.points += 1;
        }

        for (var k = 0; k < this.aces; k++) {
            this.points += 10;
            if (this.points > 21) {
                this.points -= 10;
            }
        }

        return this.points;
    }

    addCardToHand() {
        console.log(cardsUsed);
        let value = this.getRandomCardValue(cardValues);
        let suit = this.getRandomCardSuit(cardSuits);
        let card = value + suit;
        if (cardsUsed.includes(card)) {
            this.addCardToHand();
        } else {
            this.cardsInHand.push(card);
            this.calculatePoints();
            cardsUsed.push(card);
        }
    }
    
    getRandomCardValue() {       
        let array = new Uint8Array(1);
        let bitsInVar = 8;
        window.crypto.getRandomValues(array);
        let scaleValue = (2 ** bitsInVar) / cardValues.length;
        array[0] = array[0] / scaleValue;
        return cardValues[array[0]];
    }
    
    getRandomCardSuit() {
        let array = new Uint8Array(1);
        let bitsInVar = 8;
        window.crypto.getRandomValues(array);
        let scaleValue = (2 ** bitsInVar) / cardSuits.length;
        array[0] = array[0] / scaleValue;
        return cardSuits[array[0]];
    }

    checkAlive() {
        if (this.points > 21) {
            this.alive = false;
        }
        return this.alive;
    }
}

export {CardHand};
export default cardsUsed;
