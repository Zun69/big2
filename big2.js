import Deck from "./deck.js"
import Player from "./player.js"

const Player1 = new Player()
const Player2 = new Player()
const Player3 = new Player()
const Player4 = new Player()
const deck = new Deck()
const playingDeck = [] //playing deck will be empty array


//function to deal cards to all 4 players(2 for now, implement the other 2 later)
function dealCards(Deck, Player1, Player2, Player3, Player4){
    Deck.shuffle()

    for(let i = 0; i < Deck.numberOfCards; i++)
    {
        let card = deck.getCard(Deck.cards, i); //this should return card object
        Player1.addCards(card) //add card to player1 hand
        i++; //increment i by one to deal next card to player 2
        let card2 = deck.getCard(Deck.cards, i); 
        Player2.addCards(card2) 
        i++; 
        let card3 = deck.getCard(Deck.cards, i); 
        Player3.addCards(card3)
        i++; 
        let card4 = deck.getCard(Deck.cards, i); 
        Player4.addCards(card4)
    }
}

function sortHand(Player1, Player2, Player3, Player4){
    Player1.sortHand()
    Player2.sortHand()
    Player3.sortHand()
    Player4.sortHand()
}

function updateCards(Player1, Player2, Player3, Player4){
    Player1.printCards(1)
    Player2.printCards(2)
    Player3.printCards(3)
    Player4.printCards(4)
}


dealCards(deck, Player1, Player2, Player3, Player4);
sortHand(Player1, Player2, Player3, Player4);
updateCards(Player1, Player2, Player3, Player4);













