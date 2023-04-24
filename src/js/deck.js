import Card from "./card.js"

const SUITS = ["D", "C", "H", "S"]; //Diamonds, Clubs, Hearts, Spades
const VALUES = ["3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "2"];

export default class Deck{ 
    constructor(cards = freshDeck()){ //every time deck is called construct deck with freshly mapped cards in ascending big 2 order (3D to 2S)
        this.cards = cards;
    }

    //getter for deck length
    get numberOfCards() { 
        return this.cards.length;
    }

    shuffle() {
        for(let i = this.numberOfCards - 1; i > 0 ; i--){
            const newIndex = Math.floor(Math.random() * (i + 1)); //return index of new card that is guaranteed to have not been accessed before, selecting a truly random card
            const oldValue = this.cards[newIndex];
            this.cards[newIndex] = this.cards[i];
            this.cards[i] = oldValue; //loop through deck and swap card with randomly selected card creating a random deck
        }
    }

    cardHash(){
        var i = 0;
        var cardValueMap = new Map();
        var deck = freshDeck();
        
        while(i<13){ //diamond cards, insert suit + value and order value (out of 52) into map, used for sorting in player class
            cardValueMap.set(deck[i].suit + deck[i].value, i*4+1);
            i++;
        }
        while(i<26){ //club cards
            cardValueMap.set(deck[i].suit + deck[i].value, (i%13)*4+2);
            i++;
        }
        while(i<39){ //heart cards
            cardValueMap.set(deck[i].suit + deck[i].value, (i%13)*4+3); 
            i++;
        }
        while(i<52){ //spade cards
            cardValueMap.set(deck[i].suit + deck[i].value, (i%13)*4+4);
            i++;
        }

        return cardValueMap;
    }
}


//map all values to each suit and return them as a card, eventually creating a fresh deck
function freshDeck() {
    return SUITS.flatMap(suit => { //use flatMap otherwise it will create 4 seperate arrays for each suit, instead of one large deck with all the suits included
        return VALUES.map(value => {
            return new Card(suit, value);
        })
    })
}

