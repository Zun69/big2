import Deck from "./deck.js"
import Player from "./player.js"

const Player1 = new Player();
const Player2 = new Player();
const Player3 = new Player();
const Player4 = new Player();
const players = [ Player1, Player2, Player3, Player4 ];
const deck = new Deck();
const gameDeck = []; //playing deck will be empty array, will be filled with card objects


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

function determineTurn(players){

    //loop through all player's cards to check for 3 of diamonds, if they have 3 of diamond they have 1st turn
    for(let i = 0; i < players.length; i++){
        for(let j = 0 ; i < players[i].numberOfCards; j++){
            if(player[i].cards[j].suit + player[i].cards[j].value == "♦", "3"){
                player[i].turn = 0;
            }
        }
    }
}

function sortHand(players){
    for(let i = 0; i < players.length; i++){
        players[i].sortHand();
    }
}

function updateCards(players){
    for(let i = 0; i < players.length; i++){
        players[i].printCards(i); 
    }
}

async function selectCard(){

}

async function playCard(){
    //await selectCard
}

dealCards(deck, players);
sortHand(players);
updateCards(players);

  


//start game by dealing cards to all 4 players


//window.requestAnimationFrame(loop);


//if player has 3of diamonds he goes first (function to loop through all players and check cards)



//var hand = players[0].selectCard();
//players[0].playCard(hand, gameDeck);
//console.log(gameDeck.length);
//printGameDeck(gameDeck);
















    

    















