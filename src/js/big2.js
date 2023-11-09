import Player from "./player.js"
import Opponent from "./opponent.js"

const Player1 = new Player();
const Player2 = new Opponent(); //ai player
const Player3 = new Opponent();
const Player4 = new Opponent();
const players = [ Player1, Player2, Player3, Player4 ];
const deck = new Deck();
const gameDeck = []; //playing deck will be empty array, will be filled with card objects

function sortCards(cards){

}


async function dealCards(deck, players) {
    var p1Div = document.getElementById('0');
    var p2Div = document.getElementById('1');
    var p3Div = document.getElementById('2');
    var p4Div = document.getElementById('3');
    // Display the deck in an HTML container
    let $container = document.getElementById('gameDeck');
    deck.mount($container);

    let shufflePromise = new Promise(function(myResolve) {
        for (let i = 0; i < 3; i++) {
            deck.shuffle();
        }
        setTimeout(function() {
            myResolve("shuffleComplete");
        }, 1500);
    }); 

    // Use a for...of loop to iterate over the cards with asynchronous behavior
    var playerIndex = 0;

    shufflePromise.then(function(value) {
        if(value == "shuffleComplete"){
            deck.cards.forEach(function (card, i) {
                if (playerIndex == 4) {
                    playerIndex = 0;
                }
        
                switch (playerIndex) {
                    case 0:
                        card.setSide('front')

                        //animation for each card, create staggered animations using i to offset the animations
                        setTimeout(function() {
                            card.animateTo({
                                delay: 0 , // wait 1 second + i * 2 ms
                                duration: 100,
                                ease: 'linear',
                                rot: 180,
                                x: -250 + (i * 10),
                                y: 260
                            })
                            card.mount(p1Div);
                        },50 + i * 42)
                        
                        players[playerIndex].addCard(card);
                        playerIndex++;
                    break;
                    case 1:
                        card.setSide('front')
                        setTimeout(function() {
                            card.animateTo({
                                delay: 0 , // wait 1 second + i * 2 ms
                                duration: 100,
                                ease: 'linear',
                                rot: 270,
                                x: -425,
                                y: -250 + (i * 10),
                            })
                            card.mount(p2Div);
                        },50 + i * 42)
                        playerIndex++;
                        break;
                    case 2:
                        //card.setSide('front')
                        setTimeout(function() {
                            card.animateTo({
                                delay: 0 , // wait 1 second + i * 2 ms
                                duration: 100,
                                ease: 'linear',
                                rot: 180,
                                x: -280 + (i * 10),
                                y: -250
                            })
                            card.mount(p3Div);
                        },50 + i * 42)
                        players[playerIndex].addCard(card);
                        playerIndex++;
                        break;
                    case 3:
                        setTimeout(function() {
                            card.animateTo({
                                delay: 0 , // wait 1 second + i * 2 ms
                                duration: 100,
                                ease: 'linear',
                                rot: 270,
                                x: 440 ,
                                y: -268 + (i * 10)
                            })
                            card.mount(p4Div);
                        },50 + i * 42)
                        players[playerIndex].addCard(card);
                        playerIndex++;
                        break;
                }
            })
        }
    });

    //return promise, to let game know its okay to continue
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

var cardHashModule = {
    deck: function (_deck) {
      _deck.cardHash = function () {
        let i = 0;
        let cardValueMap = new Map();
        let deck = _deck.cards;
        console.log(deck)
  
        //loop through the deck(sorted already) and assign a key (card rank + suit) and value for use with sorting a player's hand
        while (i < deck.length) {
          cardValueMap.set(deck[i].suit + " " + deck[i].rank, i + 1);
          i++;
        }
  
        return cardValueMap;
      };
    },
  };

Deck.modules.cardHash = cardHashModule;

window.onload = async function() {
    // Instanciate a deck with all cards
    var deck = Deck();

    dealCards(deck, players); //should await for this to finish before continuing
    
    //let winner = await gameLoop();
    console.log(players[0].cards);
    console.log(players[1].cards);
    console.log(players[2].cards);
    console.log(players[3].cards);
    
};


const gameLoop = async _ => {
    
   /* updateGameDeck(gameDeck, 0); //print out transparent image, so card animations have a target
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
    */
}

//TO DO: make start menu that allows player to start game
async function startGame() {
    var res = await startPromise();
    var audio = new Audio('audio/shuffling-cards-1.wav');

    if(res == "START"){
        audio.play();
        dealCards(deck, players);
        var winner = await gameLoop();
        window.alert(winner); //replace this with a popup menu allowing players to restart maybe also show winner and loser, if i make game ending condition every player running out of cards
    }
}


//main program starts here
startGame();
//restartGame

