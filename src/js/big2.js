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

async function determineTurn(players){
    //loop through all player's cards to check for 3 of diamonds, if they have 3 of diamond they have 1st turn
    let myPromise = new Promise(function(myResolve, myReject) {
        for(let i = 0; i < players.length; i++){
            for(let j = 0 ; j < players[i].numberOfCards; j++){
                if(players[i].cards[j].suit == "♦" && players[i].cards[j].value == "3"){
                    myResolve(i);
                }
            }
        }
    });

    //return id of player who has 3 of diamonds
    return myPromise;
}

function sortHand(players){
    for(let i = 0; i < players.length; i++){
        players[i].sortHand();
    }
}

async function updateCards(players){
    for(let i = 0; i < players.length; i++){
        document.getElementById(i).innerHTML = "";
        players[i].printCards(i); //print cards for each player
    }
}

async function updateGameDeck(gameDeck, playedHand){
    document.getElementById("gameDeck").innerHTML = "";
    console.log("game deck length: " + gameDeck.length);

    //print last played cards, starting from lowest valued card (because its already sorted)
    //loop starts from index of first played card until end of the gameDeck
    for(let i = gameDeck.length - playedHand; i < gameDeck.length; i++){
        var cardImg = document.createElement("img");
        cardImg.src = "./cards/" + gameDeck[i].suit + gameDeck[i].value + ".png"; //returns suit and value e.g ♠2.png
        console.log("gamedeck" + gameDeck[i].suit + gameDeck[i].value);
        cardImg.setAttribute("id", gameDeck[i].suit + gameDeck[i].value);
        document.getElementById("gameDeck").append(cardImg);
    }
}


async function startPromise() {
    var startGame = document.getElementById("startGame");

    let myPromise = new Promise(function(myResolve, myReject) {
        startGame.addEventListener("click", function(){
            myResolve("START");
        }.bind(this), false)
    });

    return myPromise;
}

const forLoop = async _ => {
    sortHand(players);
    updateCards(players);
    var turn = await determineTurn(players); //player with 3 of diamonds has first turn
    var playedHand = 0;

    //i < amount of turns (should set high number)
    for(let i = 0; i < 100; i++){
        console.log("turn: " + turn);
        sortHand(players); 
        playedHand = await players[turn].playCard(gameDeck, turn, playedHand); //playCard var res = await selectCard, if res == selected how ever many cards
        console.log("played hand debug: " + playedHand);
        
        if(playedHand >= 1 && playedHand <= 5){ //if player played a valid hand
            updateGameDeck(gameDeck, playedHand);
            updateCards(players);

            if (players[turn].numberOfCards == 0){ //if player has 0 cards left, print out winner message
                return new Promise(resolve => {
                    resolve("Player " + turn + " won!");
                });
            }

            turn += 1; 
            if (turn > 3) turn = 0; //go back to player 1's turn after player 4's turn
        }
        else if(playedHand == 0){ //else if player passed
            turn += 1;
            console.log("player passed");
            if (turn > 3) turn = 0;
        }
    }
}


async function startGame() {
    var res = await startPromise();
    var audio = new Audio('audio/shuffling-cards-1.wav');

    if(res == "START"){
        audio.play();
        dealCards(deck, players);
        var winner = await forLoop();
        console.log(winner);
    }
}


//main program starts here
startGame();
//restartGame


  














    

    















