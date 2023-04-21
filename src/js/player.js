import Deck from "./deck.js"

//hash to identify a straight
const cardRankLookupTable = {
    "3": 1,
    "4": 2,
    "5": 3,
    "6": 4,
    "7": 5,
    "8": 6,
    "9": 7,
    "0": 8, //represents 10, 0 is returned from hand.slice(-1)
    "J": 9,
    "Q": 10,
    "K": 11,
    "A": 12,
    "2": 13
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
    cardLogic(gameDeck, hand, lastValidHand, wonRound){ 
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
                    }
                    //if player has won the previous hand, allow them to place any single card down 
                    else if(wonRound){ 
                        return true;
                    } 
                    else {
                        return false;
                    }
                }

                //if gamedeck not empty and last played hand was also 1 card
                if(gameDeck.length > 0){
                    if(lastPlayedHand.length == 1){
                        //if single card is larger value than last played card, using deck hash to compare card values
                        if(cardMap.get(hand[0]) > cardMap.get(lastPlayedHand[0].suit + lastPlayedHand[0].value)) { 
                            return true;
                        } 
                        else{
                            return false;
                        }
                    }
                }
                break;
            //validate doubles
            case 2:
                var splitCard1 = hand[0].split(''); //output: splitCard1[0] = suit | splitCard[1] = value
                var splitCard2 = hand[1].split(''); 
                if(gameDeck.length == 0){
                    //if gamedeck is empty and hand contains a 3 of diamonds and another 3 card, return valid as its a valid double
                    if(hand[0] == "♦3" && hand[1].includes("3")){
                        return true;
                    }
                    //else if player has won previous round and hand contains a valid double, return true 
                    else if(wonRound && splitCard1[1] == splitCard2[1]) { 
                        return true;
                    } else {
                        return false;
                    }
                }

                if(gameDeck.length > 0){
                    if(lastPlayedHand.length == 2){
                        //if hand cards have same value AND first card in hand has same value as first last played card 
                        //AND second card in hand is greater than last played second card return true
                        //OR if first hand and second card values have same value AND if first card in hand is greater than first card in last playedHand 
                        //AND second hand card is greater than 2nd card in last played hand return true
                        if((splitCard1[1] == splitCard2[1] && splitCard1[1] == lastPlayedHand.value  && cardMap.get(hand[1]) > cardMap.get(lastPlayedHand[1]) ||
                           (splitCard1[1] == splitCard2[1] && cardMap.get(hand[0]) > cardMap.get(lastPlayedHand[0].suit + lastPlayedHand[0].value) && cardMap.get(hand[1]) > cardMap.get(lastPlayedHand[1].suit + lastPlayedHand[1].value)))){
                            return true;
                        } 
                        else {
                            return false;
                        }
                    }
                }
                break;
            //validate triples
            case 3:
                var splitCard1 = hand[0].split(''); //output: splitCard1[0] = suit | splitCard[1] = value
                var splitCard2 = hand[1].split('');
                var splitCard3 = hand[2].split('');

                if(gameDeck.length == 0){
                    //if gamedeck is empty and hand contains a 3 of diamonds and two other 3 cards, return valid as its a valid triple to start game with
                    if(hand[0] == "♦3" && hand[1].includes("3") && hand[2].includes("3")){
                        return true;
                    } 
                    //else if player has won previous round and hand contains a valid triple, return true
                    else if(wonRound && splitCard1[1] == splitCard2[1] && splitCard2[1] == splitCard3[1] && splitCard1[1] == splitCard3[1]) { 
                        return true;
                    } 
                    else {
                        return false;
                    }
                }

                if(gameDeck.length > 0){
                    if(lastPlayedHand.length == 3){
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
                var splitCard1 = hand[0].split(''); //output: splitCard1[0] = suit | splitCard[1] = value
                var splitCard2 = hand[1].split('');
                var splitCard3 = hand[2].split('');
                var splitCard4 = hand[3].split('');
                var splitCard5 = hand[4].split('');
                var straight = true;

                for(let i = 3; i >= 0; i--){
                    var currentRank = cardRankLookupTable[hand[i].slice(-1)]; //return value from lookup table, using hand ranks as the key
                    var nextRank = cardRankLookupTable[hand[i+1].slice(-1)];
                    var numericalValue = nextRank - currentRank;
                    console.log("nextRank value: " + nextRank);
                    console.log("currentRank value: " + currentRank);
                    console.log("numerical value: " + numericalValue);

                    //if nextRank - currentRank value not 1, means card values are not exactly one rank higher
                    if(nextRank - currentRank != 1){
                        //if i == 2 (5 card) AND currentRank = 3 (5 rank card) AND nextRank = 12 (A rank card), means hand is 3,4,5,A,2 (lowest straight), continue to 4 rank card
                        //straight is lowest as it is A,2,3,4,5
                        if(i == 2 && currentRank == cardRankLookupTable['5'] && nextRank === cardRankLookupTable['A']){
                            continue;
                        }
                        //if i == 3 (6 card) AND currentRank = 4 (6 rank card) AND nextRank = 13 (2 rank card), means hand is 3,4,5,6,2 (second lowest straight), continue to 5 rank card
                        //straight is second lowests as it is 2,3,4,5,6
                        if(i == 3 && currentRank == cardRankLookupTable['6'] && nextRank === cardRankLookupTable['2']){
                            continue;
                        }
                        straight = false;
                        break; //if hand of 5 does not contain a straight break out of loop
                    }
                }

                if (straight) {
                    console.log("That's a straight!");
                  } else {
                    console.log("Not a straight.");
                  }
                
                //create a hash with all the combos and rank them in order, TO DO, assign a boolean such as hasFullHouse = true, to determine which combo is ranked higher

                if(gameDeck.length == 0){
                    //full house, if you have triple 3 (including 3 of D) and 4th and 5th cards have the same value (triple and a double), return true
                    if(hand[0] == "♦3" && hand[1].includes("3") && hand[2].includes("3") && splitCard4[1] == splitCard5[1]){
                        return true;
                    }
                    //else if player has won previous round and plays fullhouse(in either 44 222 or 333 22 format) 
                    else if((wonRound && splitCard1[1] == splitCard2[1] && splitCard2[1] == splitCard3[1] && splitCard1[1] == splitCard3[1] && splitCard4[1] == splitCard5[1] ||
                        wonRound && splitCard1[1] == splitCard2[1] && splitCard3[1] == splitCard4[1] && splitCard3[1] == splitCard5[1] && splitCard4[1] == splitCard5[1])) { 
                        return true;
                    }
                    //(flush) else if every card in hand has the same suit as the first card in hand, return true
                    else if(hand[0] == "♦3" && hand.every(card => card.slice(0, 1) === hand[0].slice(0,1))){ 
                        return true;
                    }
                    //else if player has won previous round and plays flush
                    else if(wonRound && hand.every(card => card.slice(0, 1) === hand[0].slice(0,1))){
                        return true;
                    } 
                    //(FoK + kicker) else if first 4 cards are the same, then last card doesnt matter
                    else if(hand[0] == "♦3" && splitCard1[1] == splitCard2[1] && splitCard2[1] == splitCard3[1] && splitCard3[1] == splitCard4[1]){ 
                        return true;
                    }
                    //else if prev round won and fok
                    else if(wonRound && splitCard1[1] == splitCard2[1] && splitCard2[1] == splitCard3[1] && splitCard3[1] == splitCard4[1]){
                        return true;
                    }
                    else if(straight){
                        return true;
                    }
                    else {
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
    async playCard(gameDeck, turn, lastValidHand, wonRound){
        var playButton = document.getElementById("play"); //set player class to active if its their turn
        var passButton = document.getElementById("pass");
        playButton.disabled = true; //disable play button because no card is selected which is an invalid move
        //passButton.disabled = true; //disable pass button because you can't pass on first move
        var restartGameButton = document.getElementById("restartGame"); 
        var placeCardAudio = new Audio('audio/flipcard.mp3');
        var self = this; //assign player to self
        var hand = []; //hand array holds selected cards
        var cards = document.querySelectorAll('[id="' + turn + '"] img'); //cards are refreshed every turn, contains player's card images
        var cardValidate;

        //loop through all cards and adds a click listener for each card image
        cards.forEach(card => {
            card.addEventListener('click', () => {
                //if clicked card is already in player's hand, remove it from their hand
                if(hand.includes(card.id)) { 
                    hand = hand.filter(id => id !== card.id); //filter through hand array and remove card id
                    self.sortHandArray(hand); //sort selected hand so cardLogic function can tell whether its a combo, single, double or triple
                    console.log("currrent hand: " + hand + "current turn: " + turn);
                    card.classList.remove('checked');
                    cardValidate = self.cardLogic(gameDeck, hand, lastValidHand, wonRound); //return valid if played card meets requirements
                    console.log("card validation: " + cardValidate);

                    //if current hand is validated, enable play button, else disable it because its an invalid move
                    if(cardValidate) {
                        playButton.disabled = false;
                    } else {
                        playButton.disabled = true;
                    }
                } else if (!hand.includes(card.id) && hand.length < 5){ //else if card isnt in hand array && hand length is less than 5
                    hand.push(card.id); //insert clicked on card into hand
                    self.sortHandArray(hand); 
                    console.log("currrent hand: " + hand + "current turn: " + turn);
                    card.classList.add('checked');
                    cardValidate = self.cardLogic(gameDeck, hand, lastValidHand, wonRound); //return valid if played card meets requirements
                    console.log("card validation: " + cardValidate);

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
        
                cards = [];
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
            //self.clearCards, clear gameDeck
            location.reload();
        }, { once: true });

        return myPromise;
    }
}

