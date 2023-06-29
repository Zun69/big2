import Deck from "./deck.js"
import Card from "./card.js"
import Player from "./player.js"
import Opponent from "./opponent.js"

const Player1 = new Player();
const Player2 = new Opponent(); //ai player
const Player3 = new Opponent();
const Player4 = new Opponent();
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

    players[0].addCard(new Card('C',3));
    /*players[1].addCard(new Card('C', 3));
    players[1].addCard(new Card('C', 4));
    players[1].addCard(new Card('D', 5));
    players[1].addCard(new Card('H', 6));
    players[1].addCard(new Card('C', 2));
    players[1].addCard(new Card('C', 'A'));*/
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

async function updateAllCards(players){
    //change it to update just one player at a time, makes it more efficient and less laggy when hosted on github pages
    for(let i = 0; i < players.length; i++){
        //document.getElementById(i).innerHTML = "";
        players[i].printCards(i); //print cards for each player
    }
}

async function updateGameDeck(gameDeck, playedHand){
    document.getElementById("gameDeck").innerHTML = "";
    console.log("game deck length: " + gameDeck.length);
    var cardImg = document.createElement("img");

    //if gameDeck is empty put a placeholder image, so animations still have a target to follow
    if(gameDeck.length == 0){
        cardImg = document.createElement("img");
        cardImg.src = "./cards/TRANSPARENT.png";
        document.getElementById("gameDeck").append(cardImg);
    }

    //print last played cards, starting from lowest valued card (because its already sorted)
    //loop starts from index of first played card until end of the gameDeck
    for(let i = gameDeck.length - playedHand; i < gameDeck.length; i++){
        cardImg = document.createElement("img");
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
    updateGameDeck(gameDeck, 0); //print out transparent image, so card animations have a target
    sortHand(players); //sort all player's cards
    updateAllCards(players); //print out all player's cards
    var turn = await determineTurn(players); //player with 3 of diamonds has first turn
    var playedHand = 0;
    var lastValidHand;
    var passTracker = 0; //track number of passes, if there are 3 passes that means player has won the round and game deck should be cleared
    var wonRound = false;
    var turnDisplay = document.getElementById("turn");

    //each loop represents a single turn
    for(let i = 0; i < 100; i++){
        console.log("Current turn: Player " + turn);
        turnDisplay.textContent = "Current Turn: Player " + (turn + 1) ;
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
        //if turn == 0
        if(turn == 0){
            playedHand = await players[turn].playCard(gameDeck, turn, lastValidHand, wonRound); //resolve hand.length, function also validates hand 
        }
        //else if turn !=0 its oppponent cpu TO DO: pass gamestate object in to keep track of combo, score, etc
        else{
            playedHand = await players[turn].playCard(gameDeck, turn, lastValidHand, wonRound, players);
        }

        console.log("played hand debug: " + playedHand);
        
        if(playedHand >= 1 && playedHand <= 5){ //if player played a valid hand
            passTracker = 0; //reset passTracker if hand has been played
            updateGameDeck(gameDeck, playedHand);
            //players[turn].printCards(turn); //update current player's cards after turn
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

//TO DO: make start menu that allows player to start game
async function startGame() {
    var res = await startPromise();
    var audio = new Audio('audio/shuffling-cards-1.wav');

    if(res == "START"){
        audio.play();
        dealCards(deck, players);
        var winner = await forLoop();
        window.alert(winner); //replace this with a popup menu allowing players to restart maybe also show winner and loser, if i make game ending condition every player running out of cards
    }
}


//main program starts here
startGame();
//restartGame

