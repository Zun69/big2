import Deck from "./deck.js"

//hash to rank combos, higher value means combo is more valuable
const FIVE_HAND_COMBOS = {
    "straight": 1,
    "flush": 2,
    "full house": 3, 
    "four of a kind": 4,
    "straight flush": 5
};

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
    cardLogic(gameDeck, hand, lastValidHand, wonHand){ 
        let deck = new Deck();
        let cardMap = deck.cardHash();
        let lastPlayedHand = []; //card array holds the hand that we will use to validate
        let lastPlayedHandIndex = gameDeck.length - lastValidHand;

        //loop from last hand played until end of gamedeck
        for(let i = lastPlayedHandIndex; i < gameDeck.length; i++){ 
            lastPlayedHand.push(gameDeck[i]); //insert last played cards into array (as a card to make it easier to validate doubles, triples, and combos)
        }

        //switch case using hand length
        switch(hand.length) {
            //validate single card
            case 1:
                //if gamedeck is empty TO DO program it to detect after round has been won, pass in passTracker
                if(gameDeck.length == 0){ 
                    if(hand[0] == "♦3"){
                        return true;
                    } else if(wonHand){ //if player has won the previous hand, allow them to place any single card down
                        return true;
                    } else {
                        return false;
                    }
                }

                //if gamedeck not empty and last played hand was also 1 card
                if(gameDeck.length > 0){
                    if(lastPlayedHand.length == 1){
                        //if single card is larger value than last played card, using deck hash to compare card values
                        console.log("last played card: " + lastPlayedHand[0]);
                        if(cardMap.get(hand[0]) > cardMap.get(lastPlayedHand[0].suit + lastPlayedHand[0].value)) { 
                            return true;
                        } else{
                            return false;
                        }
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
                    if(lastPlayedHand.length == 2){
                        console.log("last played double card: " + lastPlayedHand[0] + lastPlayedHand[1]);
                        var splitCard1 = hand[0].split(''); //output: splitCard1[0] = suit | splitCard[1] = value
                        var splitCard2 = hand[1].split(''); 

                        //if hand cards have same value AND first card in hand has same value as first last played card 
                        //AND second card in hand is greater than last played second card return true
                        //OR if first hand and second card values have same value AND if first card in hand is greater than first card in last playedHand 
                        //AND second hand card is greater than 2nd card in last played hand return true
                        if((splitCard1[1] == splitCard2[1] && splitCard1[1] == lastPlayedHand.value  && cardMap.get(hand[1]) > cardMap.get(lastPlayedHand[1]) ||
                           (splitCard1[1] == splitCard2[1] && cardMap.get(hand[0]) > cardMap.get(lastPlayedHand[0].suit + lastPlayedHand[0].value) && cardMap.get(hand[1]) > cardMap.get(lastPlayedHand[1].suit + lastPlayedHand[1].value)))){
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
                break;
            //validate triples
            case 3:
                if(gameDeck.length == 0){
                    //if gamedeck is empty and hand contains a 3 of diamonds and two other 3 cards, return valid as its a valid triple to start game with
                    if(hand[0] == "♦3" && hand[1].includes("3") && hand[2].includes("3")){
                        return true;
                    } else {
                        return false;
                    }
                }

                if(gameDeck.length > 0){
                    if(lastPlayedHand.length == 3){
                        console.log("last played triple card: " + lastPlayedHand[0] + lastPlayedHand[1] + lastPlayedHand[2]);
                        var splitCard1 = hand[0].split(''); //output: splitCard1[0] = suit | splitCard[1] = value
                        var splitCard2 = hand[1].split('');
                        var splitCard3 = hand[2].split('');

                        //if all 3 hand cards have same value AND first card is greater than last played first card AND second card is greater than second last played card
                        //AND third card is greater than last played third card return true
                        if(splitCard1[1] == splitCard2[1] && splitCard2[1] == splitCard3[1] && splitCard1[1] == splitCard3[1] && cardMap.get(hand[0]) > cardMap.get(lastPlayedHand[0].suit + lastPlayedHand[0].value) 
                            && cardMap.get(hand[1]) > cardMap.get(lastPlayedHand[1].suit + lastPlayedHand[1].value) && cardMap.get(hand[2]) > cardMap.get(lastPlayedHand[2].suit + lastPlayedHand[2].value)){
                            return true;
                        } else {
                        return false;
                        }
                    }
                }
                break;
            //validate quads? i dont know if these are allowed (leaning towards not allowed for the moment)
            case 4:
                return false;
                break;
            //validate straights, flushes, full houses, 4 of a kinds + kickers, straight flushes (in order of least to most valuable)
            case 5:
                console.log("last played triple card: " + lastPlayedHand[0] + lastPlayedHand[1] + lastPlayedHand[2] + lastPlayedHand[3] + lastPlayedHand[4]);
                var splitCard1 = hand[0].split(''); //output: splitCard1[0] = suit | splitCard[1] = value
                var splitCard2 = hand[1].split('');
                var splitCard3 = hand[2].split('');
                var splitCard4 = hand[3].split('');
                var splitCard5 = hand[4].split('');

                /*for(let i = 0; i < 4; i++){
                    if(hand[i].slice(-1) == hand[i+1].slice(-1)) //get value of cards in hand
                }*/
                
                //create a hash with all the combos and rank them in order, TO DO, assign a boolean such as hasFullHouse = true, to determine which combo is ranked higher

                if(gameDeck.length == 0){
                    //full house, if you have triple 3 (including 3 of D) and 4th and 5th cards have the same value (triple and a double), return true
                    if(hand[0] == "♦3" && hand[1].includes("3") && hand[2].includes("3") && splitCard4[1] == splitCard5[1]){
                        return true;
                    } else if(hand.every(card => card.slice(0, 1) === hand[0].slice(0,1))){ //(flush) else if every card in hand has the same suit as the first card in hand, return true
                        return true;
                    } else if(splitCard1[1] == splitCard2[1] && splitCard2[1] == splitCard3[1] && splitCard3[1] == splitCard4[1]){ //(FoK + kicker) else if first 4 cards are the same, then last card doesnt matter
                        return true;
                    } else {
                        return false;
                    }
                }

                if(gameDeck.length > 0){
                    if(lastPlayedHand.length == 5){
                        //if last played hand is straight and playedhand is higher straight or flush, or full house, or fok, or straight flush
                        //if last played hand is flush and playedhand is higher flush, or full house, or fok, or straight flush
                        //if last played hand is fullhouse and playedhand is higher fullhouse, or fok, or straight flush
                        //if last played hand is fok and played hand is higher fok, or straight flush
                        //if last played hand is straight flush and played hand is higher straight flush
                    }

                }
                break;
        }
    }

    //function takes care of selecting cards and inserting cards into hand, sorting the hand, validating move and inserting the hand onto the game deck, and returning promise
    async playCard(gameDeck, turn, lastValidHand, wonHand){
        var playButton = document.getElementById("play"); //set player class to active if its their turn
        var passButton = document.getElementById("pass");
        playButton.disabled = true; //disable play button because no card is selected which is an invalid move
        //passButton.disabled = true; //disable pass button because you can't pass on first move
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
                    cardValidate = self.cardLogic(gameDeck, hand, lastValidHand, wonHand); //return valid if played card meets requirements
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
                    cardValidate = self.cardLogic(gameDeck, hand, lastValidHand, wonHand); //return valid if played card meets requirements
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
        var myPromise = new Promise((resolve) => {
            playButton.addEventListener("click", function(){
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

        return myPromise;
    }
}

