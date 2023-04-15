import Deck from "./deck.js"

const selectedHand = [];
//create hashmap for suits == 1,diamond 2,clubs, 3,hearts, 4,spades

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

    searchCard(cardId){
        for(let i = 0; i < this.numberOfCards; i++){
            if(cardId == this.cards[i].suit + this.cards[i].value){
                return this.cards[i];
            }
        }
    }


    printCards(playerNum){
        for(let i = 0; i < this.numberOfCards; i++){
            let cardImg = document.createElement("img");
            
            if(playerNum == 0){
                cardImg.src = "./cards/" + this.cards[i].suit + this.cards[i].value + ".png"; //returns suit and value e.g ♠2.png
                cardImg.setAttribute("id", this.cards[i].suit + this.cards[i].value);
                cardImg.setAttribute("class", "card"); //adding card class, for JQuery card onclick listener
                document.getElementById(playerNum).append(cardImg); //insert card image in player div
            }
            else{ //else print out back card because you dont want to see other player's cards
                //cardImg.src = "./cards/BACK.png"; //need to see everyones card because i need to test the game logic out
                cardImg.src = "./cards/" + this.cards[i].suit + this.cards[i].value + ".png";
                cardImg.setAttribute("id", this.cards[i].suit + this.cards[i].value);
                cardImg.setAttribute("class", "card");
                document.getElementById(playerNum).append(cardImg);
            }
        }
    }


    async pass() {
        var passButton = document.getElementById("pass");

        let myPromise = new Promise(function(myResolve, myReject) {
            passButton.addEventListener("click", function(){
               myResolve(true);
            }, false)
            //return promise, lets print game deck function run, turn += 1  
        });

        return myPromise;
    }

    //sort player's cards
    sortHand(){
        let deck = new Deck()
        let cardMap = deck.cardHash()

        //bubble sort using cardMap to compare card values
        for(var i = 0; i < this.numberOfCards; i++){
            for(var j = 0; j < (this.numberOfCards - i - 1); j++){
                //use current card as a key to cardMap using position value to compare and sort the cards, cant use object as a key
                if(cardMap.get(this.cards[j].suit + this.cards[j].value) > cardMap.get(this.cards[j + 1].suit + this.cards[j + 1].value)){ 
                    let temp = this.cards[j];
                    this.cards[j] = this.cards[j+1];
                    this.cards[j+1] = temp;
                }
            }
        }
    }

    //sort hand that user has played
    sortHandArray(hand){
        let deck = new Deck();
        let cardMap = deck.cardHash();

        //bubble sort using cardMap to compare card values
        for(var i = 0; i < hand.length; i++){
            for(var j = 0; j < (hand.length - i - 1); j++){
                //use current card as a key to cardMap using position value to compare and sort the cards, cant use object as a key
                if(cardMap.get(hand[j].suit + hand[j].value) > cardMap.get(hand[j + 1].suit + hand[j+1].value)){ 
                    let temp = hand[j];
                    hand[j] = hand[j+1];
                    hand[j+1] = temp;
                }
            }
        }
        console.log("sorted");
        console.log(hand);
    }

    cardLogic(gameDeck, hand){ //return promise if played card is valid, else dont progress and play invalid sound effect(WIP)
        let deck = new Deck();
        let cardMap = deck.cardHash();
        let cardArr = []; //card array holds the hand that we will use to validate

        //switch case using hand length

        switch(hand.length) {
            //validate single card
            case 1:
                //if gamedeck is empty
                if(gameDeck.length == 0){ 
                    if(hand[0].suit == "♦" && hand[0].value == 3){
                        return "valid";
                    }
                } 
                break;
            //validate doubles
            case 2: 
                break;
            case 3: //validate triples
                break;
            case 4: //validate quads? i dont know if these are allowed (leaning towards not allowed for the moment)
                break;
            case 5: //validate straights, flushes, full houses, 4 of a kinds + kickers, straight flushes
                break;
        }

    }


    async playCard(gameDeck, playerNum){
        var playButton = document.getElementById("play"); //set player class to active if its their turn
        var passButton = document.getElementById("pass");
        var restartGameButton = document.getElementById("restartGame"); 
        var placeCardAudio = new Audio('sound/flipcard.mp3');
        var invalidAudio = new Audio('sound/invalid.mp3');
        var hand = []; //hand array holds selected cards
        var self = this; //assign player to self
        console.log("playerNum" + playerNum);
        

        //JQuery select card function
        $(document).ready(function() {
            $('#' + playerNum).on('click', ".card", function() { //on click listener for player's cards
                var selectedCard = $(this);
                console.log(selectedCard);

                if(!selectedCard.is('.checked')){
                    selectedCard.addClass('checked');
        
                    var returnedCard = self.searchCard(this.id);

                    hand.push(returnedCard); //push on the card instead of id
                    
                } else {
                    selectedCard.removeClass('checked');

                    var index = hand.indexOf(this.id);
                    if(index >- 1){
                        hand.splice(index, 1);
                        console.log(hand);
                    }
                }
            })
        })
            

        let myPromise = new Promise(function(myResolve, myReject) {
            playButton.addEventListener("click", function(){
                self.sortHandArray(hand); //sort selected hand so cardLogic function can tell whether its a combo, single, double or triple
                let cardValidate = self.cardLogic(gameDeck, hand); //return valid if played card meets requirements

                //if played card is valid
                if(cardValidate == "valid"){
                    //convert hand array into cards, insert cards into game deck, remove cards from player cards
                    for(let i = 0; i < hand.length; i++){
                        for(let j = 0; j < self.numberOfCards; j++){ //compare selected cards with player's current cards
                            if(hand[i] == self.cards[j]){
                                gameDeck.push(self.cards[j]);
                                self.cards.splice(j,1); //remove player card at this index
                                placeCardAudio.play();
                                myResolve(hand.length); //return amount of cards played, to move forward for loop
                                console.log("hand length: " + hand.length);
                            }
                        }
                    }
                }
                //else play invalid sound, user has to either pass or play a valid card
                else{
                    hand = [];
                    invalidAudio.play();
                }
            }, false)

            passButton.addEventListener("click", function(){
                myResolve(0); //if player passes, return 0 cards played
            }, false)
        });

        //refresh page if restart game button is clicked
        restartGameButton.addEventListener("click", function(){
            location.reload();
        }, false)

        return myPromise;
    }

}

