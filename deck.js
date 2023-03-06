const SUITS = ["♠", "♥", "♦", "♣"]
const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"]

export default class Deck{ 
    constructor(cards = freshDeck()){ //every time deck is called construct deck with freshly mapped cards, export Deck class to script file
        this.cards = cards
    }

    get numberOfCards() { //getter for deck length
        return this.cards.length
    }

    shuffle() {
        for(let i = this.numberOfCards - 1; i > 0 ; i--){
            const newIndex = Math.floor(Math.random() * (i + 1)) //return index of new card that is guaranteed to have not been accessed before, selecting a truly random card
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue //loop through deck and swap card with randomly selected card creating a random deck
        }
    }
}

class Card {
    constructor(suit, value){
        this.suit = suit
        this.value = value
    }
}

function freshDeck() {
    return SUITS.flatMap(suit => { //map all values to each suit and return them as a card, eventually creating a fresh deck
        return VALUES.map(value => {
            return new Card(suit, value) 
        })
    })
}