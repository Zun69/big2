import Deck from "./deck.js"

const selectedHand = [];

export default class Player{ 
    constructor(cards = []){ //initialise player with an empty array of cards, will fill array with card objects
        this.cards = cards;
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

    removeCard(index){
        this.cards.delete(index);
    }

    printCards(playerNum){
        for(let i = 0; i < this.numberOfCards; i++){
            let cardImg = document.createElement("img");

            if(playerNum == 1){
                cardImg.src = "./cards/" + this.cards[i].suit + this.cards[i].value + ".png"; //returns suit and value e.g ♠2.png
                //cardImg.id = this.cards[i].suit + this.cards[i].value
                cardImg.setAttribute("id", this.cards[i].suit + this.cards[i].value);
                document.getElementById("player" + playerNum).append(cardImg); //insert card image in player div
            }
            else{ //else print out back card because you dont want to see other player's cards
                //cardImg.src = "./cards/BACK.png"; //need to see everyones card because i need to test the game logic out
                cardImg.src = "./cards/" + this.cards[i].suit + this.cards[i].value + ".png";
                cardImg.id = this.cards[i].suit + this.cards[i].value;
                document.getElementById("player" + playerNum).append(cardImg);
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

    selectCard(){
        for(let i = 0; i < this.numberOfCards; i++){
            var card = document.getElementById(this.cards[i].suit + this.cards[i].value);
            var hand = [];
            var self = this; //assign player to self
            
            card.addEventListener("click", function(){
                if(hand.length < 5){
                    this.style.border = "thick solid black";
                    this.setAttribute("class", "selected");
                    
                    //if selected card is in user hand then add to hand array
                    if(this.id == self.cards[i].suit + self.cards[i].value){ 
                        hand.push(self.cards[i]); 
                    }
                    
                }
            }, false) //adding bind here creates a bug for unknown reason, using hacky var self = this instead
        }
        //console.log(hand)
        return hand;
    }

    playCard(hand, gameDeck){
        var playButton = document.getElementById("play");

        playButton.addEventListener("click", function(){
            //convert hand array into cards, insert cards into game deck, remove cards from player cards
            for(let i = 0; i < hand.length; i++){
                for(let j = 0; j < this.numberOfCards; j++){ //compare selected cards with player's current cards
                    if(hand[i] == this.cards[j]){
                        gameDeck.push(this.cards[j]);
                        //this.removeCard(j); //remove player card at this index
                    }
                }
            }
        }.bind(this), false) //only execute bind to player class when event is called
    }
}

