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
            } else { //else print out back card because you dont want to see other player's cards
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
            cardArr.push(gameDeck[i].suit + gameDeck[i].value); //insert last played cards into card array (as a an id string, to directly match with hand arr)
        }
        
        //bug if someone passed then cardArr is empty, maybe fix it with if playedHand = 0 + 1

        //switch case using hand length

        switch(hand.length) {
            //validate single card
            case 1:
                //if gamedeck is empty
                if(gameDeck.length == 0){ 
                    if(hand[0] == "♦3"){
                        return true;
                    } else{
                        return false;
                    } 
                }

                if(gameDeck.length > 0){
                    //if single card is larger value than last played card, using deck hash to compare card values
                    console.log("card array card: " + cardArr[0]);
                    if(cardMap.get(hand[0]) > cardMap.get(cardArr[0])) { 
                        return true;
                    } else{
                        return false;
                    }
                }
                break;
            //validate doubles
            case 2:
                if(gameDeck.length == 0){
                    //if gamedeck is empty and hand contains a 3 of diamonds and another 3 card, return valid as its a valid double
                    if(hand[0] == "♦3" && hand[1].includes("3")){
                        return true;
                    } else {
                        return false;
                    }
                }

                if(gameDeck.length > 0){
                    console.log("card array card: " + cardArr[0] + cardArr[1]);
                    if(cardMap.get(hand[1]) > cardMap.get(cardArr[1])){
                        return true;
                    } else {
                        return false;
                    }
                }
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
        playButton.disabled = true; //disable play button because no card is selected which is an invalid move
        var passButton = document.getElementById("pass");
        var restartGameButton = document.getElementById("restartGame"); 
        var placeCardAudio = new Audio('audio/flipcard.mp3');
        var self = this; //assign player to self
        var cards = document.querySelectorAll('[id="' + turn + '"] img'); //cards are refreshed every turn, contains player's card images
        var hand = []; //hand array holds selected cards
        var cardValidate;

        //loop through all cards and adds a click listener for each card image
        cards.forEach(card => {
            card.addEventListener('click', () => {
                //if clicked card is already in player's hand, remove it from their hand
                if(hand.includes(card.id)) { 
                    hand = hand.filter(id => id !== card.id); //filter through hand array and remove card id
                    self.sortHandArray(hand); //sort selected hand so cardLogic function can tell whether its a combo, single, double or triple
                    card.classList.remove('checked');
                    cardValidate = self.cardLogic(gameDeck, hand, playedHand); //return valid if played card meets requirements
                    console.log(cardValidate);

                    //if current hand is validated, enable play button, else disable it because its an invalid move
                    if(cardValidate) {
                        playButton.disabled = false;
                    } else {
                        playButton.disabled = true;
                    }
                } else if (!hand.includes(card.id) && hand.length < 5){ //else if card isnt in hand array && hand length is less than 5
                    hand.push(card.id); //insert clicked on card into hand
                    self.sortHandArray(hand); 
                    card.classList.add('checked');
                    cardValidate = self.cardLogic(gameDeck, hand, playedHand); //return valid if played card meets requirements
                    console.log(cardValidate);

                    if(cardValidate) {
                        playButton.disabled = false;
                    } else {
                        playButton.disabled = true;
                    }
                }
            })
        })


        //promise resolves hand length or 0 if player passes
        var myPromise = new Promise((resolve, reject) => {
            //if card valid add event listener, else make button disabled
            playButton.addEventListener("click", function(){
                
 
                //if played card is valid
                hand.forEach(cardId => {
                    var cardIndex = self.cards.findIndex(card => card.suit + card.value === cardId); //return index of player's card that matches a cardId in hand array
    
                    //if card index is valid
                    if (cardIndex !== -1) {
                        gameDeck.push(self.cards[cardIndex]); //insert player's card that matches cardId into game deck
                        console.log("card inserted: " + self.cards[cardIndex].suit + self.cards[cardIndex].value);
                        self.cards.splice(cardIndex, 1); //remove card from player's cards
                        placeCardAudio.play();
                    }
                })
                console.log("resolving number = " + hand.length)
    
                console.log("HAND" + hand.length);
                resolve(hand.length); //return amount of cards played, to move forward for loop
                hand.length = 0; //clear hand after playing it
            }, { once: true });
            //refresh page if restart game button is clicked

            passButton.addEventListener("click", function(){
                //cant pass if you have 3 of diamonds, implement later, return error reject resolve, in big 2 main keep trying until its a success
                resolve(0); //if player passes, return 0 cards played
            }, { once: true });
        });

        restartGameButton.addEventListener("click", function(){
            location.reload();
        }, { once: true });

        console.log("returned promise");
        return myPromise;
    }
}

