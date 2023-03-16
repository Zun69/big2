import { Player } from "./player.js"
import Deck from "./deck.js"

//this class models an entire game, taking inspiration from https://github.com/Pomax/mahjong/blob/master/src/js/core/game/game.js
export default class Game{
    constructor(players) {
        this.players = players;
        this.playedHand = undefined;
    }


    //function to deal cards to all 4 players(2 for now, implement the other 2 later)
    dealCards(deck, players){
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

    determineTurn(players){
        //loop through all player's cards to check for 3 of diamonds, if they have 3 of diamond they have 1st turn
        for(let i = 0; i < players.length; i++){
            for(let j = 0 ; i < players[i].numberOfCards; j++){
                if(player[i].cards[j].suit + player[i].cards[j].value == "♦", "3"){
                    player[i].turn = 0;
                }
            }
        }  
    }   

    sortHand(players){
        for(let i = 0; i < players.length; i++){
            players[i].sortHand();
        }
    }

    updateCards(players){
        for(let i = 0; i < players.length; i++){
            players[i].printCards(i); 
        }
    }

}