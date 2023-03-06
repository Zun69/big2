export default class Player{ 
    constructor(cards){ //player has cards, 13 each
        this.cards = cards
    }

    get numberOfCards() {
        return this.cards.length
    }

    playHand(){
        //play hand logic
    }

    pass() {
        //player can pass logic
    }

}