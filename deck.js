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

    getSuitAndValue(cards, index){
            let value = cards[index].value;
            let suit = cards[index].suit;
            return [suit, value]; //return suit and value in array
            
            /*if(isNaN(value) || value == 2){
                if(value == 'J'){
                    return 10;
                }
                else if(value == 'Q'){
                    return 11;
                }
                else if(value == 'K'){
                    return 12;
                }
                else if(value == 'A'){
                    return 13;
                }
                else if(value == '2'){
                    return 14;
                }
            }
            return value; //if card is not j, q, k, a, 2 return value*/
    }
}

class Card {
    constructor(suit, value){
        this.suit = suit
        this.value = value
    }
}

//map all values to each suit and return them as a card, eventually creating a fresh deck
function freshDeck() {
    return SUITS.flatMap(suit => { //use flatMap otherwise it will create 4 seperate arrays for each suit, instead of one large deck(array)
        return VALUES.map(value => {
            return new Card(suit, value) 
        })
    })
}

