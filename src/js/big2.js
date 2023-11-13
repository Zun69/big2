import Player from "./player.js"
import Opponent from "./opponent.js"

const Player1 = new Player();
const Player2 = new Opponent(); //ai player
const Player3 = new Opponent();
const Player4 = new Opponent();
const players = [ Player1, Player2, Player3, Player4 ];
const deck = new Deck();
const gameDeck = []; //playing deck will be empty array, will be filled with card objects

var cardHashModule = {
    deck: function (_deck) {
      _deck.cardHash = function () {
        let i = 0;
        let cardValueMap = new Map();
        let deck = _deck.cards;
  
        //loop through the deck(sorted already) and assign a key (card rank + suit) and value for use with sorting a player's hand
        while (i < deck.length) {
          cardValueMap.set(deck[i].suit + " " + deck[i].rank, i + 1);
          i++;
        }
  
        return cardValueMap;
      };
    },
  };
Deck.modules.cardHash = cardHashModule; //add cardHash function to deck library

//function sorts everybody's cards and plays the animation, resolves when animations finish
async function sortHands(players){
    const animationPromises = [];

    players.forEach(function(player){
        player.sortHand();
    });
    
    for (let i = 0; i < 4; i++) {
        // Push the animation promise into the array
        animationPromises.push(players[i].sortingAnimation(i));
    }

    // Wait for all animation promises to resolve
    await Promise.all(animationPromises);

    // Code to execute after all animations are completed
    for(let i = 0; i < players[0].numberOfCards; i++){
        //players[0].cards[i].setSide('front');
    }
    // You can return a resolved promise if needed
    return Promise.resolve('sortComplete');
}

function shuffleDeckAsync(deck, times, delayBetweenShuffles) {
    return new Promise((resolve) => {
      const shufflePromises = [];
  
      for (let i = 0; i < times; i++) {
        shufflePromises.push(
          new Promise((innerResolve) => {
            setTimeout(() => {
              deck.shuffle();
              innerResolve();
            }, i * delayBetweenShuffles);
          })
        );
      }
  
      Promise.all(shufflePromises).then(() => {
        setTimeout(() => {
          resolve('shuffleComplete');
        }, 250); //default 2100 7 shuffles
      });
    });
  }

async function dealCards(deck, players) {
    return new Promise(function (resolve, reject) {
        var p1Div = document.getElementById('0');
        var p2Div = document.getElementById('1');
        var p3Div = document.getElementById('2');
        var p4Div = document.getElementById('3');
        let p1Promise;
        let p2Promise;
        let p3Promise;
        let p4Promise;

        // Display the deck in an HTML container
        let $container = document.getElementById('gameDeck');
        deck.mount($container);

        let shufflePromise = shuffleDeckAsync(deck, 1, 0);

        // Use a for...of loop to iterate over the cards with asynchronous behavior
        var playerIndex = 0;

        shufflePromise.then(function(value) {
            if(value == "shuffleComplete"){
                const animationPromises = []; // Array to store animation promises
                deck.cards.reverse().forEach(function (card, i) {
                    if (playerIndex == 4) {
                        playerIndex = 0;
                    }

                    //play different dealing animations depending on player index
                    switch (playerIndex) {
                        case 0:
                            card.setSide('front');
                            p1Promise = new Promise((cardResolve) => {
                                setTimeout(function() {
                                    card.animateTo({
                                        delay: 0, // wait 1 second + i * 2 ms
                                        duration: 100,
                                        ease: 'linear',
                                        rot: 180,
                                        x: -212 + (i * 10),
                                        y: 260,
                                        onComplete: function () {
                                            card.mount(p1Div);
                                            cardResolve();
                                        }
                                    })                                  
                                },50 + i * 28);
                            });
                            animationPromises.push(p1Promise); //add animation promise to promise array
                            players[playerIndex].addCard(card); //add card to player's hand
                            playerIndex++;
                            break;
                        case 1:
                            card.setSide('front')
                            p2Promise = new Promise((cardResolve) => {
                                setTimeout(function() {
                                    card.animateTo({
                                        delay: 0 , // wait 1 second + i * 2 ms
                                        duration: 100,
                                        ease: 'linear',
                                        rot: 90,
                                        x: -425,
                                        y: -250 + (i * 10),
                                        onComplete: function () {
                                            card.mount(p2Div);
                                            cardResolve();
                                        }
                                    })                                   
                                },50 + i * 28)
                                animationPromises.push(p2Promise);
                                players[playerIndex].addCard(card);
                                playerIndex++;
                            });
                            break;
                        case 2:
                            card.setSide('front')
                            p3Promise = new Promise((cardResolve) => {
                                setTimeout(function() {
                                    card.animateTo({
                                        delay: 0 , // wait 1 second + i * 2 ms
                                        duration: 100,
                                        ease: 'linear',
                                        rot: 360,
                                        x: 281 - (i * 10),
                                        y: -250,
                                        onComplete: function () { 
                                            card.mount(p3Div);                                      
                                            cardResolve();
                                        }
                                    })
                                },50 + i * 28)
                                animationPromises.push(p3Promise);
                                players[playerIndex].addCard(card);
                                playerIndex++;
                            });
                            break;
                        case 3:
                            card.setSide('front')
                            p4Promise = new Promise((cardResolve) => {
                                setTimeout(function() {
                                    card.animateTo({
                                        delay: 0 , // wait 1 second + i * 2 ms
                                        duration: 100,
                                        ease: 'linear',
                                        rot: 90,
                                        x: 440,
                                        y: 272 - (i * 10),
                                        onComplete: function () {
                                            card.mount(p4Div);
                                            cardResolve();
                                        }
                                    })                                    
                                },50 + i * 28)
                                animationPromises.push(p4Promise);
                                players[playerIndex].addCard(card);
                                playerIndex++;
                            });
                            break;
                        }
                    })
                // Wait for all card animations to complete
                Promise.all(animationPromises).then(() => {
                    resolve('dealingComplete');
                });
            }
        });       
    });
}

async function determineTurn(players) {
    // Loop through all player's cards to check for 3 of diamonds, if they have it, they have the 1st turn
    let promise = new Promise((resolve, reject) => {
      players.some((player, index) => {
        if (player.cards.some(card => card.suit == '0' && card.rank == '3')) {
          resolve(index);
          return true; // Stop looping once the first player with 3 of diamonds is found
        }
      });
    });
  
    return await promise;
  }


async function startPromise() {
    let startGame = document.getElementById("startGame");

    let myPromise = new Promise(function(myResolve, myReject) {
        startGame.addEventListener("click", function(){
            myResolve("START");
        }.bind(this), false)
    });

    return myPromise;
}



window.onload = async function() {
    // Instanciate a deck with all cards
    const deck = Deck();
    let dealResolve = await dealCards(deck, players);
    if(dealResolve === 'dealingComplete'){
        // Cards have been dealt and animations are complete
        console.log('Dealing complete');
        var winner = await gameLoop();
        //TODO add post game screen (score, positions, continue to next game option)
    }
    
    //let winner = await gameLoop();
};


const gameLoop = async _ => {
    let sortResolve = await sortHands(players); //sort all player's cards
    if(sortResolve === 'sortComplete'){
        let playedHand = 0;
        let lastValidHand;
        let passTracker = 0;
        let wonRound = false;
        let turnDisplay = document.getElementById("turn");
        let turn = await determineTurn(players); //player with 3 of diamonds has first turn
        console.log("turn: " + turn)

        //each loop represents a single turn
        for(let i = 0; i < 100; i++){
            console.log("Current turn: Player " + turn);
            turnDisplay.textContent = "Current Turn: Player " + (turn + 1) ;
            wonRound = false; //reset wonRound to false, its only true if 3 players have passed

            //if 3 players pass, flag wonRound, reset gameDeck and passTracker
            if(passTracker == 3){
                wonRound = true; 
                console.log("Player " + turn + " has won the round, has a free turn");
                gameDeck.length = 0; //clear the game deck because player has won round, like in real life TODO: record the gameDeck before resetting (to show card's played)
                passTracker = 0; 
            }

            //if turn == 0
            if(turn == 0){
                playedHand = await players[turn].playCard(gameDeck, turn, lastValidHand, wonRound); //resolve hand.length, function also validates hand 
            }
            //else if turn !=0 its oppponent cpu TO DO: pass gamestate object in to keep track of combo, score, etc
            else{
                playedHand = await players[turn].playCard(gameDeck, turn, lastValidHand, wonRound, players);
                console.log("opponent playhand: " + playedHand);
            }

            if(playedHand >= 1 && playedHand <= 5){ //if player played a valid hand
                console.log("played hand debug: " + playedHand);
                passTracker = 0; //reset passTracker if hand has been played
                //update gamedeck (unmount all cards in gameDeck OR animate them to another empty deck that is mounted in a div 
                // (deal the finished card into the deck, then I can use the finishedDeck.length to determine the end of the game))

                
                //if player or ai play a valid hand, sort their cards
                let resolve = await sortHands(players);
                
                if(resolve == 'sortComplete'){
                    lastValidHand = playedHand; //store last played hand length, even after a player passes (so I dont pass 0 into the card validate function in player class)
    
                    if (players[turn].numberOfCards == 0){ //if player has 0 cards left, print out winner message
                        return new Promise(resolve => {
                            resolve("Player " + turn + " won!");
                        });
                    }

                    turn += 1; 
                    if (turn > 3) turn = 0; //go back to player 1's turn after player 4's turn
                }
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

    /*
    let turn = await determineTurn(players); //player with 3 of diamonds has first turn
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
        
        sortHands(players);
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

