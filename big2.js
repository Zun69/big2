import Deck from "./deck.js"
import Player from "./player.js"

const Player1 = new Player()
const Player2 = new Player()
const Player3 = new Player()
const Player4 = new Player()
const deck = new Deck()
const playingDeck = [] //playing deck will be empty array


//function to deal cards to all 4 players(2 for now, implement the other 2 later)
function dealCards(Deck, Player1, Player2){
    Deck.shuffle()

    for(let i = 0; i < Deck.numberOfCards; i++)
    {
        let card = deck.getSuitAndValue(Deck.cards, i); //get current card at index
        Player1.addCards(card); //add card to player1 hand
        Player1.printCards(card,1); //print player1 cards
        i++; //increment i by one to deal next card to player 2
        let card2 = deck.getSuitAndValue(Deck.cards, i); //get current card at index
        Player2.addCards(card2); //add card to player2 hand
        Player2.printCards(card2,2); //print player2 cards
        i++; 
        let card3 = deck.getSuitAndValue(Deck.cards, i); 
        Player3.addCards(card3); 
        Player3.printCards(card3,3); 
        i++; 
        let card4 = deck.getSuitAndValue(Deck.cards, i); 
        Player4.addCards(card4); 
        Player4.printCards(card4,4);
    }
}

dealCards(deck, Player1, Player2, Player3, Player4);












