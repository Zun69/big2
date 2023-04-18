import Deck from "./deck.js"

//create hashmap for suits == 1,diamond 2,clubs, 3,hearts, 4,spades

export default class Player{ 
    constructor(cards = [], turn){ //initialise player with an empty array of cards, will fill array with card objects
        this.cards = cards;
    }

    get numberOfCards() { 
        return this.cards.length;
    }

    addCard(card){
        //add cards to hand
        this.cards.push(card);
    }

    //return card from given card card id
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
                document.getElementById(playerNum).append(cardImg); //insert card card in player div
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
                if(cardMap.get(hand[j]) > cardMap.get(hand[j + 1])){ 
                    let temp = hand[j];
                    hand[j] = hand[j+1];
                    hand[j+1] = temp;
                }
            }
        }
    }

    //return promise if played card is valid, else dont progress and play invalid audio effect(WIP)
    cardLogic(gameDeck, hand, playedHand){ 
        let deck = new Deck();
        let cardMap = deck.cardHash();
        let cardArr = []; //card array holds the hand that we will use to validate
        let lastPlayedHandIndex = gameDeck.length - playedHand;

        //loop from last hand played until end of gamedeck
        for(let i = lastPlayedHandIndex; i < gameDeck.length; i++){ 
            cardArr.push(gameDeck[i]); //insert last played cards into card array
        }

        //switch case using hand length

        switch(hand.length) {
            //validate single card
            case 0:
                return "invalid";
            case 1:
                //if gamedeck is empty
                if(gameDeck.length == 0){ 
                    if(hand[0].suit == "♦" && hand[0].value == 3){
                        return "valid";
                    }
                    else{
                        return "invalid";
                    } 
                }
                
                if(gameDeck.length > 0){
                    //if single card is larger value than last played card
                    console.log("card array card: " + cardArr[0].suit + cardArr[0].value);
                    if(cardMap.get(hand[0].suit + hand[0].value) > cardMap.get(cardArr[0].suit + cardArr[0].value)){
                        return "valid";
                    }
                    else{
                        return "invalid";
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

    //function takes care of selecting cards and inserting cards into hand, sorting the hand, validating move and inserting the hand onto the game deck, and returning promise
    async playCard(gameDeck, turn, playedHand){
        var playButton = document.getElementById("play"); //set player class to active if its their turn
        var passButton = document.getElementById("pass");
        var restartGameButton = document.getElementById("restartGame"); 
        var placeCardAudio = new Audio('audio/flipcard.mp3');
        var invalidAudio = new Audio('audio/invalid.mp3');
        var self = this; //assign player to self
        var cards = document.querySelectorAll('[id="' + turn + '"] img'); //cards are refreshed every turn, contains player's card images
        var hand = []; //hand array holds selected cards

        //loop through each card image for their ids
        cards.forEach(card => {
            card.addEventListener('click', () => {
                if(hand.includes(card.id)) { //if hand array already contains card id, remove it from hand
                    hand = hand.filter(id =>  id !== card.id); //filter through hand array and remove card id
                    card.classList.remove('checked');
                    console.log(hand);
                } else if (!hand.includes(card.id) && hand.length < 5){ //else if card isnt in hand array && hand length is less than 5
                    hand.push(card.id); //insert card into hand
                    card.classList.add('checked'); 
                    console.log(hand);
                }
                    
            })
         })

        
        //promise resolves hand length or 0 if player passes
        return new Promise((resolve, reject) => {
            let isResolved = false;
            // Add event listener to an element
            playButton.addEventListener("click", function(){
                self.sortHandArray(hand); //sort selected hand so cardLogic function can tell whether its a combo, single, double or triple
                // let cardValidate = self.cardLogic(gameDeck, hand, playedHand); //return valid if played card meets requirements
 
                //if played card is valid
                //if(cardValidate == "valid"){
                 //convert hand array into cards, insert cards into game deck, remove cards from player cards
                hand.forEach(cardId => {
                    var cardIndex = self.cards.findIndex(card => card.suit + card.value === cardId); //return index of player's card that matches current cardId in hand

                    //if card index is valid
                    if (cardIndex !== -1) {
                        gameDeck.push(self.cards[cardIndex]); //insert player's card into game deck
                        console.log("card inserted: " + self.cards[cardIndex].suit + self.cards[cardIndex].value);
                        self.cards.splice(cardIndex, 1); //remove card from player's cards
                        placeCardAudio.play();
                    }
                })
                console.log("resolving number = " + hand.length)

                if(!isResolved){
                    isResolved = true;
                    console.log("HAND" + hand.length);
                    resolve(hand.length); //return amount of cards played, to move forward for loop
                    hand.length = 0; //clear hand after playing it
                }
                
            }, { once: true });
            //refresh page if restart game button is clicked

            passButton.addEventListener("click", function(){
                myResolve(0); //if player passes, return 0 cards played
            }, { once: true });

            restartGameButton.addEventListener("click", function(){
                location.reload();
            }, { once: true });
            
          });
    }
}

