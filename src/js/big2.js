import Deck from "./deck.js"
import Player from "./player.js"

const Player1 = new Player();
const Player2 = new Player();
const Player3 = new Player();
const Player4 = new Player();
const players = [ Player1, Player2, Player3, Player4 ];
const deck = new Deck();
const gameDeck = []; //playing deck will be empty array, will be filled with card objects


//function to deal cards to all 4 players
function dealCards(deck, players){
    deck.shuffle();
    var playerIndex = 0;
    
    deck.cards.forEach((card) => {
        players[playerIndex].addCard(card); //add card to current index player's hand
        playerIndex++;
        
        // after player 4 has been dealt to, return player index to player 1
        if(playerIndex == players.length){
            playerIndex = 0;
        }
    })
}

async function determineTurn(players){
    // loop through all player's cards to check for 3 of diamonds, if they have 3 of diamond they have 1st turn
    let promise = new Promise((resolve, reject) => {
      players.some((player, index) => {
        if (player.cards.some(card => card.suit === "D" && card.value === "3")) {
          resolve(index);
          return true; // stop looping once the first player with 3 of diamonds is found
        }
      });
    });
    return await promise;
}

function sortHand(players){
    players.forEach(function(player){
        player.sortHand();
    });
}

async function updateCards(players){
    //change it to update just one player at a time, makes it more efficient and less laggy when hosted on github pages
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
    var lastValidHand;
    var passTracker = 0; //track number of passes, if there are 3 passes that means player has won the round and game deck should be cleared
    var wonRound = false;

    //TO DO: implement a way to identify when a player has won a round and reset the gameDeck
    //each loop represents a single turn
    for(let i = 0; i < 100; i++){
        console.log("Current turn: Player " + turn);
        wonRound = false; //reset wonRound to false, its only true if 3 players have passed 

        if(passTracker == 3){
            wonRound = true; //return wonRound as true
            console.log("Player " + turn + " has won the round, has a free turn");
            gameDeck.length = 0; //reset gameDeck because player has won round, like in real life
            updateGameDeck(gameDeck, playedHand);
            passTracker = 0; //reset passTracker value
        }
        
        sortHand(players);
        //TO DO: still a bug when round is won, can select any players card
        playedHand = await players[turn].playCard(gameDeck, turn, lastValidHand, wonRound); //resolve hand.length, function also validates turn TODO pass gamestate object in to keep track of combo, score, etc

        console.log("played hand debug: " + playedHand);
        
        if(playedHand >= 1 && playedHand <= 5){ //if player played a valid hand
            passTracker = 0; //reset passTracker if hand has been played
            updateGameDeck(gameDeck, playedHand);
            updateCards(players); //change this to update just the current turn player's cards
            lastValidHand = playedHand; //store last played hand length, even after a player passes (so I dont pass 0 into the card validate function in player class)

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
            passTracker += 1; //keeps track of number of passes to track if anyone has won round
            console.log("pass tracker: " + passTracker);
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
        window.alert(winner);
    }
}


//main program starts here
startGame();
//restartGame
