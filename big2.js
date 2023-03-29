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
        players[i].printCards(i); 
    }
    let myPromise = new Promise(function(updateCards) {

    });
}

async function updateGameDeck(gameDeck){
    document.getElementById("gameDeck").innerHTML = "";
    var cardImg = document.createElement("img");

    for(let i = 0; i < gameDeck.length; i++){ //should loop using last played hand length
        cardImg.src = "./cards/" + gameDeck[i].suit + gameDeck[i].value + ".png"; //returns suit and value e.g ♠2.png
        console.log(gameDeck[i].suit + gameDeck[i].value);
        cardImg.setAttribute("id", gameDeck[i].suit + gameDeck[i].value);
        document.getElementById("gameDeck").append(cardImg);
    }
}

async function endGame(players) {
    let myPromise = new Promise(function(myResolve, myReject) {
        for(let i = 0; i < players.length; i++){
            if(players[i].numberOfCards > 0){
                myResolve("continue");
            }else{
                myReject("stop");
            }
        }
    });

    return myPromise;
}

async function startGame() {
    var startGame = document.getElementById("startGame");

    let myPromise = new Promise(function(myResolve, myReject) {
        startGame.addEventListener("click", function(){
            myResolve("START");
        }.bind(this), false)
    });

    return myPromise;
}



const forLoop = async _ => {
    console.log('Start');
    sortHand(players);
    updateCards(players);
    var turn = await determineTurn(players); //player with 3 of diamonds has first turn
    console.log(turn);
   

    //less than 51 cards put down
    for(let i = 0; i < 51; i++){
        var playedHand = "unplayed";
        sortHand(players); 
        var playedHand = await players[turn].playCard(gameDeck, turn); //playCard var res = await selectCard, if res == selected how ever many cards
        turn += 1; //let next player play their hand
      
        if(playedHand == "played hand"){ //should resolve length of hand, use that  length to print gameDeck
            console.log(turn);
            console.log(gameDeck);
            updateGameDeck(gameDeck);
            updateCards(players);
            if (turn > 3) turn = 0;
            //console.log(players[turn].cards);
        }
        //turn += 1;
        //
        //await playCard , if play card then increment i by hand.length and print gamedeck
    }
}

var res = await startGame();
var audio = new Audio('sound/shuffling-cards-1.wav');

if(res == "START"){
    audio.play();
    dealCards(deck, players);
    forLoop();
}




















//let hand = players[0].selectCard();
//var array = players[0].playCard(hand, gameDeck);/*



  














    

    















