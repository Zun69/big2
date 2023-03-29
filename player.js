import Deck from "./deck.js"

const selectedHand = [];

export default class Player{ 
    constructor(cards = [], turn){ //initialise player with an empty array of cards, will fill array with card objects
        this.cards = cards;
        this.turn = turn;
    }

    get numberOfCards() { 
        return this.cards.length;
    }

    addCard(card){
        //add cards to hand
        this.cards.push(card);
    }

    getCard(index){
        return this.cards[index];
    }


    printCards(playerNum){
        for(let i = 0; i < this.numberOfCards; i++){
            let cardImg = document.createElement("img");
            
            if(playerNum == 0){
                cardImg.src = "./cards/" + this.cards[i].suit + this.cards[i].value + ".png"; //returns suit and value e.g ♠2.png
                cardImg.setAttribute("id", this.cards[i].suit + this.cards[i].value);
                document.getElementById(playerNum).append(cardImg); //insert card image in player div
            }
            else{ //else print out back card because you dont want to see other player's cards
                //cardImg.src = "./cards/BACK.png"; //need to see everyones card because i need to test the game logic out
                cardImg.src = "./cards/" + this.cards[i].suit + this.cards[i].value + ".png";
                cardImg.id = this.cards[i].suit + this.cards[i].value;
                document.getElementById(playerNum).append(cardImg);
            }
        }
    }


    pass() {
        //player can pass logic
    }

    sortHand(){
        let deck = new Deck()
        let cardMap = deck.cardHash()

        //bubble sort using cardMap to compare card values
        for(var i = 0; i < this.numberOfCards; i++){
            for(var j = 0; j < (this.numberOfCards - i - 1); j++){
                //use current card as a key to cardMap using position value to compare and sort the cards, cant use object as a key
                if(cardMap.get(this.cards[j].suit + this.cards[j].value) > cardMap.get(this.cards[j + 1].suit + this.cards[j + 1].value)){ 
                    let temp = this.cards[j]
                    this.cards[j] = this.cards[j+1]
                    this.cards[j+1] = temp
                }
            }
        }
    }

    async selectCard(gameDeck){
        for(let i = 0; i < this.numberOfCards; i++){
            var card = document.getElementById(this.cards[i].suit + this.cards[i].value);
            var hand = [];
            var self = this; //assign player to self
            //await turn finished result
            
            
            card.addEventListener("click", function(){
                if(gameDeck.length == 0 && hand.length < 5){ //if hand.length < gameDeck.length
                    this.style.border = "thin solid black";
                    this.setAttribute("class", "selected");
                    
                    //if selected card is in user hand then add to hand array
                    if(this.id == self.cards[i].suit + self.cards[i].value){ 
                        hand.push(self.cards[i]); 
                    }
                }
                else{
                    hand.splice(i,1);
                    //self.removeCard(i); //remove from hand hand instead of player card whoops
                    this.style.border = "";
                    this.removeAttribute("class", "selected");
                    i = 0;
                }
            }, false) //adding bind here creates a bug for unknown reason, using hacky var self = this instead
        }
        //console.log(hand)
     
        return hand; //return promise
    }

    async playCard(gameDeck){
        var playButton = document.getElementById("play"); //set player class to active if its their turn
        var audio = new Audio('sound/flipcard.mp3');
        var hand = [];
        var self = this; //assign player to self

        for(let i = 0; i < this.numberOfCards; i++){
            var card = document.getElementById(this.cards[i].suit + this.cards[i].value);
            //var self = this; //assign player to self
            //await turn finished result
            
            card.addEventListener("click", function(){
                if(hand.length < 5){ //if hand.length < gameDeck.length ** if this.id == "3diamonds"
                    this.style.border = "thin solid black";
                    this.setAttribute("class", "selected");
                    
                    //if selected card is in user hand then add to hand array
                    if(this.id == self.cards[i].suit + self.cards[i].value){ 
                        hand.push(self.cards[i]); 
                    }
                }
                else{
                    hand.splice(i,1);
                    //self.removeCard(i); //remove from hand hand instead of player card whoops
                    this.style.border = "";
                    this.removeAttribute("class", "selected");
                    i = 0;
                }
            }, false) //adding bind here creates a bug for unknown reason, using hacky var self = this instead
        }

        
        let myPromise = new Promise(function(myResolve, myReject) {
            playButton.addEventListener("click", function(){
                //convert hand array into cards, insert cards into game deck, remove cards from player cards
                for(let i = 0; i < hand.length; i++){
                    for(let j = 0; j < self.numberOfCards; j++){ //compare selected cards with player's current cards
                        if(hand[i] == self.cards[j]){
                            gameDeck.push(self.cards[j]);
                            self.cards.splice(j,1); //remove player card at this index
                            myResolve("played hand"); //should return amount of cards played, to move forward for loop
                        }
                    }
                }
            }, false) 
            //return promise, lets print game deck function run, turn += 1  
        });
        
        return myPromise;   
    }

}

