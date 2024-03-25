import Player from "./player.js"
import Opponent from "./opponent.js"

// Lookup table for printing actual rank in last played hand
const rankLookup = {
    1: 'A',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: 'J',
    12: 'Q',
    13: 'K',
};

// Lookup table for printing suit icon in last played hand
const suitLookup = {
    0: '♦', // Diamonds
    1: '♣', // Clubs
    2: '♥', // Hearts
    3: '♠', // Spades
};

//create card Map that maps each card to a value (1-52) for sorting (deck has to be sorted already)
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

//GameModule object encapsulate players, deck, gameDeck, finishedDeck 
const GameModule = (function() {
    // Initial values
    let initialPlayer1 = new Player();
    let initialPlayer2 = new Opponent(); //ai player
    let initialPlayer3 = new Opponent();
    let initialPlayer4 = new Opponent();
    let initialPlayers = [initialPlayer1, initialPlayer2, initialPlayer3, initialPlayer4];
    let initialGameDeck = []; //playing deck will be empty array, will be filled with card objects
    let initialDeck = Deck();
    let initialFinishedDeck = Deck(); //store post round cards
    
    // Current values
    let players = [...initialPlayers];
    let gameDeck = [...initialGameDeck];
    let deck = initialDeck;
    let finishedDeck = initialFinishedDeck;

    // Reset function
    function reset() {
        players = [...initialPlayers];
        gameDeck = [...initialGameDeck];
        deck = initialDeck;
        finishedDeck = initialFinishedDeck;
    }

    //return GameModule properties
    return {
        players,
        gameDeck,
        deck,
        finishedDeck,
        reset
    };
})();

// Empty the finished deck of all its cards, so it can store post round cards
GameModule.finishedDeck.cards.forEach(function (card) {
    card.unmount();
});
GameModule.finishedDeck.cards = [];

async function sortPlayerHandAfterTurn(players,turn){
    const animationPromises = [];

    //sort player's card after turn
    //players[turn].sortHand();

    console.log("TURN: " + turn);
    // Push the animation promise into the array
    animationPromises.push(players[turn].sortingAnimationAfterTurn(turn));

    // Wait for all animation promises to resolve
    await Promise.all(animationPromises);

    console.log("hand sorted after turn")

    // return resolve, to let game loop know that player's cards have been sorted
    return Promise.resolve('sortAfterTurnComplete');
}

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

    // You can return a resolved promise if needed
    return Promise.resolve('sortComplete');
}

//purpose is to wait for shuffle animation finish before resolving promise back to dealCards function
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
        }, 300); //default 2100 7 shuffles  (3 shuffles = 850, etc)
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
                                        rot: 0,
                                        x: -212 + (i * 10),
                                        y: 230,
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
                                        rot: 0,
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
                    //Unmount the deck from the DOM
                    deck.unmount();

                    //Remove reference to the deck instance
                    deck = null; 
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
async function finishGameAnimation(gameDeck, finishedDeck, players, losingPlayer){
    return new Promise(async function (resolve, reject) {
        let finishedDeckDiv = document.getElementById("finishedDeck");

        for (let i = 0; i < gameDeck.length; i++) {
            //loop through all game deck cards
            let card = gameDeck[i];
            card.setSide('back');
            
            //wait until each card is finished animating
            await new Promise((cardResolve) => {
                setTimeout(function () {
                    card.animateTo({
                        delay: 0,
                        duration: 80,
                        ease: 'linear',
                        rot: 0,
                        x: 240 - GameModule.finishedDeck.cards.length * 0.25, //stagger the cards when they pile up, imitates original deck styling
                        y: -150 - GameModule.finishedDeck.cards.length * 0.25,
                        onComplete: function () {
                            GameModule.finishedDeck.cards.push(card); //push gameDeck card into finshedDeck
                            card.$el.style.zIndex = GameModule.finishedDeck.cards.length; //change z index of card to the length of finished deck
                            GameModule.finishedDeck.mount(finishedDeckDiv); //mount finishedDeck to div
                            card.mount(GameModule.finishedDeck.$el);  //mount card to the finishedDeck div
                            cardResolve(); //resolve, so next card can animate
                        }
                    });
                }, 80);
            });
        }

        //loop through losing player's cards
        for (let i = 0; i < players[losingPlayer].numberOfCards; i++){
            let losingCard = players[losingPlayer].cards[i];
            losingCard.setSide('back');
            
            //wait until each card is finished animating
            await new Promise((losingCardResolve) => {
                setTimeout(function () {
                    losingCard.animateTo({
                        delay: 0,
                        duration: 80,
                        ease: 'linear',
                        rot: 0,
                        x: 240 - GameModule.finishedDeck.cards.length * 0.25, //stagger the cards when they pile up, imitates original deck styling
                        y: -150 - GameModule.finishedDeck.cards.length * 0.25,
                        onComplete: function () {
                            GameModule.finishedDeck.cards.push(losingCard); //push gameDeck card into finshedDeck
                            losingCard.$el.style.zIndex = GameModule.finishedDeck.cards.length; //change z index of card to the length of finished deck
                            GameModule.finishedDeck.mount(finishedDeckDiv); //mount finishedDeck to div
                            losingCard.mount(GameModule.finishedDeck.$el);  //mount card to the finishedDeck div
                            losingCardResolve(); //resolve, so next card can animate
                        }
                    });
                }, 80);
            });
        }

        // All card animations are complete, mount finishedDeck to finish deck div and return resolve
        resolve('finishGameComplete');
    });
}

//after round ends, adds all played cards into finished deck and animates them as well
async function finishDeckAnimation(gameDeck) {
    return new Promise(async function (resolve, reject) {
        let finishedDeckDiv = document.getElementById("finishedDeck");

        for (let i = 0; i < gameDeck.length; i++) {
            //loop through all game deck cards
            let card = gameDeck[i];
            card.setSide('back');
            
            //wait until each card is finished animating
            await new Promise((cardResolve) => {
                setTimeout(function () {
                    card.animateTo({
                        delay: 0,
                        duration: 50,
                        ease: 'linear',
                        rot: 0,
                        x: 240 - GameModule.finishedDeck.cards.length * 0.25, //stagger the cards when they pile up, imitates original deck styling
                        y: -150 - GameModule.finishedDeck.cards.length * 0.25,
                        onComplete: function () {
                            GameModule.finishedDeck.cards.push(card); //push gameDeck card into finshedDeck
                            card.$el.style.zIndex = GameModule.finishedDeck.cards.length; //change z index of card to the length of finished deck
                            GameModule.finishedDeck.mount(finishedDeckDiv); //mount finishedDeck to div
                            card.mount(GameModule.finishedDeck.$el);  //mount card to the finishedDeck div
                            cardResolve(); //resolve, so next card can animate
                        }
                    });
                }, 10);
            });
        }

        // All card animations are complete, mount finishedDeck to finish deck div and return resolve
        resolve('finishDeckComplete');
    });
}

function findLastPlayedHand(gameDeck, lastValidHand){
    const lastPlayedHand = []; //card array holds the hand that we will use to validate
    const lastPlayedHandIndex = gameDeck.length - lastValidHand;
    console.log("last played hand index: " + lastPlayedHandIndex);

    //loop from last hand played until end of gamedeck
    for(let i = lastPlayedHandIndex; i < gameDeck.length; i++){
        //if i less than 0 (happens after user wins a round, because gamedeck length is 0 and lastValidHand stores length of winning hand)
        if(i < 0){
            continue; //don't insert cards into last played hand and continue out of loop
        }
        //make a lookup table that converts the suit to icon and rank to actual rank (eg [0, 13] will turn to [♦, K]) because this function is just for printing no validating
        lastPlayedHand.push(rankLookup[gameDeck[i].rank] + suitLookup[gameDeck[i].suit]); 
    }

    return lastPlayedHand;
}

function findMissingPlayer(playersFinished) {
    // Create an array to hold all players from 0 to 3
    let allPlayers = [0, 1, 2, 3];

    // Loop through the playersFinished array to remove players who have finished
    for (let i = 0; i < playersFinished.length; i++) {
        let index = allPlayers.indexOf(playersFinished[i]);
        if (index !== -1) {
            allPlayers.splice(index, 1); // Remove the player who has finished
        }
    }

    // Return the missing player
    return allPlayers[0];
}


window.onload = async function() {
    // Instanciate a deck with all cards
    let dealResolve = await dealCards(GameModule.deck, GameModule.players);

    if(dealResolve === 'dealingComplete'){
        // Cards have been dealt and animations are complete
        console.log('Dealing complete');
        let results = await gameLoop();
        //TODO add post game screen (score, positions, continue to next game option)
    }
    
    //let winner = await gameLoop();
};

const gameLoop = async _ => {
    let sortResolve = await sortHands(GameModule.players); //sort all player's cards
    if(sortResolve === 'sortComplete'){
        let playedHand = 0;
        let lastValidHand;
        let passTracker = 0;
        let wonRound = false;
        let turn = await determineTurn(GameModule.players); //player with 3 of diamonds has first turn
        let gameInfoDiv = document.getElementById("gameInfo");
        let playersFinished = [];
        console.log("turn: " + turn)

        //GAME LOOP, each loop represents a single turn
        for(let i = 0; i < 100; i++){
            //used for displaying last played hand with actual suit icons 
            let lastHand = findLastPlayedHand(GameModule.gameDeck, lastValidHand);

            gameInfoDiv.innerHTML = "Last Played - " + lastHand + "<br>Current Turn - Player " + (turn + 1);
            wonRound = false; //reset wonRound to false, its only true if 3 players have passed

            //if 3 players pass, flag wonRound, reset gameDeck and passTracker
            if(passTracker == 3){
                // (deal the finished card into the deck, then I can use the finishedDeck.length to determine the end of the game))
                let finishDeckResolve = await finishDeckAnimation(GameModule.gameDeck, finishedDeck);

                if(finishDeckResolve == "finishDeckComplete"){
                    wonRound = true; 
                    console.log("Player " + turn + " has won the round, has a free turn");
                    GameModule.gameDeck.length = 0; //clear the game deck because player has won round, like in real life TODO: record the gameDeck before resetting (to show card's played)
                    passTracker = 0;
                }
            }

            //if player 1's turn
            if(turn == 0){
                playedHand = await GameModule.players[turn].playCard(GameModule.gameDeck, lastValidHand, wonRound, playersFinished); //resolve hand.length, function also validates hand 
            }
            //else if turn !=0 its oppponent cpu TO DO: pass gamestate object in to keep track of combo, score, etc
            else{
                playedHand = await GameModule.players[turn].playCard(GameModule.gameDeck, turn, lastValidHand, wonRound, GameModule.players);
            }

            //if player played a valid hand
            if(playedHand >= 1 && playedHand <= 5){
                console.log("played hand debug: " + playedHand);
                passTracker = 0; //reset passTracker if hand has been played

                // do a new function here input current turn, instead so theres only one animation per turn instead of all cards being sorted after each turn
                //if player or ai play a valid hand, sort their cards
                let resolve = await sortPlayerHandAfterTurn(GameModule.players,turn);
                
                if(resolve == 'sortAfterTurnComplete'){
                    lastValidHand = playedHand; //store last played hand length, even after a player passes (so I dont pass 0 into the card validate function in player class)
    
                    //check if current player has 0 cards
                    if (GameModule.players[turn].numberOfCards == 0){
                        //add player number to playersFinished array
                        playersFinished.push(turn);
                        console.log(playersFinished);
                    
                        if(playersFinished.length == 3){
                            //TO DO animate all remaining cards into gameDeck, and then unmount gameDeck, 
                            //resolve finished game, show scoreboard, allow user to quit or continue to next game
                            // Assuming you have already declared the playersFinished array and have added player numbers to it
                            let losingPlayer = findMissingPlayer(playersFinished);

                            let finishGameResolve = await finishGameAnimation(GameModule.gameDeck, finishedDeck, GameModule.players, losingPlayer);
                            
                            if(finishGameResolve == "finishGameComplete")
                            {
                                return new Promise(resolve => {
                                    GameModule.finishedDeck.unmount();
                                    
                                    resolve(playersFinished);
                                });
                            }   
                        }
                    }

                    //go to next player's turn
                    turn += 1;

                    //go back to player 1's turn after player 4's turn
                    if (turn > 3) turn = 0; 
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
}

//TO DO: make start menu that allows player to start game
async function startGame() {
    var res = await startPromise();
    var audio = new Audio('audio/shuffling-cards-1.wav');

    if(res == "START"){
        audio.play();
        dealCards(GameModule.deck, GameModule.players);
        var winner = await gameLoop();
        window.alert(winner); //replace this with a popup menu allowing players to restart maybe also show winner and loser, if i make game ending condition every player running out of cards
    }
}


//main program starts here
//restartGame

