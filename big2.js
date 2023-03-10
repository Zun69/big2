import Deck from "./deck.js"
import Player from "./player.js"

const Player1 = new Player();
const Player2 = new Player();
const Player3 = new Player();
const Player4 = new Player();
const players = [ Player1, Player2, Player3, Player4 ];
const deck = new Deck();
const playingDeck = []; //playing deck will be empty array, will be filled with card objects


//function to deal cards to all 4 players(2 for now, implement the other 2 later)
function dealCards(deck, players){
    deck.shuffle();

    for(let i = 0; i < deck.numberOfCards; i++)
    {
        players[0].addCard(deck.cards[i]); //add card to player1 hand
        i++; //increment i by one to deal next card to player 2 and so on
        players[1].addCard(deck.cards[i]); 
        i++;
        players[2].addCard(deck.cards[i]);
        i++; 
        players[3].addCard(deck.cards[i]); 
    }
}

function sortHand(players){
    for(let i = 0; i < players.length; i++){
        players[i].sortHand();
    }
}

function updateCards(players){
    for(let i = 0; i < players.length; i++){
        players[i].printCards(i+1);
    }
}

function selectCards(players){
    for(let i = 0; i < players.length; i++){
        document.getElementById(players[i].cards.suit + players[i].cards.value).onclick = console.log("fuck cunt");
    }
}

//start game by dealing cards to all 4 players
dealCards(deck, players);

//game loop runs until all cards are placed down
do{
    sortHand(players);
    updateCards(players);
    selectCards(players);
} while (playingDeck.length < 51)














