import Player from "./player.js"


//lookup table to identify a straight
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

export default class Opponent extends Player {
    constructor(cards = []) {
      super(cards);
    }

    findTwos() {
      const twos = [];
  
      for (let i = 0; i < this.numberOfCards; i++) {
        const currentCard = this.cards[i];
  
        if (currentCard.value === '2') {
          twos.push(currentCard);
        }
      }
  
      return twos;
    }

    findDoubles() {
      var doubles = [];
    
      for (let i = 0; i < this.numberOfCards - 1; i++) {
        var currentCard = this.cards[i];
        var nextCard = this.cards[i + 1];
        
        if (currentCard.value === nextCard.value) {
          // check if cards have the same value but different suits
          if (currentCard.suit !== nextCard.suit) {
            doubles.push([currentCard, nextCard]);
            i++; // skip the next card since it has already been considered as a double
          }
        }
      }
      
      console.log(doubles)
      return doubles;
    }

    findTriples() {
      var triples = [];
    
      for (let i = 0; i < this.numberOfCards - 2; i++) {
        var currentCard = this.cards[i];
        var nextCard = this.cards[i + 1];
        var thirdCard = this.cards[i + 2];
    
        if (currentCard.value === nextCard.value &&
          nextCard.value === thirdCard.value
        ) {
          // check if cards have the same value but different suits
          if (currentCard.suit !== nextCard.suit &&
            nextCard.suit !== thirdCard.suit
          ) {
            triples.push([currentCard, nextCard, thirdCard]);
          }
        }
      }
    
      console.log(triples)

      return triples;
    }

    findFullHouses() {
      var doubles = this.findDoubles();
      var triples = this.findTriples();
      var fullHouses = [];
    
      for (var double of doubles) {
        for (var triple of triples) {
          if (double[0].value !== triple[0].value) {
            // If the values of the double and triple are different, it's a potential full house.
            fullHouses.push([...double, ...triple]);
          }
        }
      }
    
      console.log(fullHouses);
      return fullHouses;
    }

    findFok(){

    }

    findStraightFlush(){

    }

    findFlushes() {
      var flushes = [];
        
        for(let i = 0; i < this.numberOfCards; i++){
          var potentialFlush = [this.cards[i]];
          var currentSuit = this.cards[i].suit;

          for(let j = i + 1; j < this.numberOfCards; j++) {
            if(this.cards[j].suit == currentSuit) {
              potentialFlush.push(this.cards[j]);
            }
          }

          if (potentialFlush.length == 5) {
            //push array of 5 cards into flushes array
            flushes.push(potentialFlush);
          }
        }

      console.log(flushes);
      return flushes;
    }

    findStraights() {
      var straights = [];
    
      for (let i = 0; i < this.numberOfCards; i++) {
        var potentialStraight = [this.cards[i]];
        var currentValue = cardRankLookupTable[this.cards[i].value]; //e.g 'K' = 11
    
        //compare adjacent card values
        for (let j = i + 1; j < this.numberOfCards; j++) {
          // Dont take into account special case: check for straight with values 3, 4, 5, 6, and 2
          
          //if next card value minus current card value = 1, then add card to potential straight array
          if (cardRankLookupTable[this.cards[j].value] - currentValue === 1) {
            potentialStraight.push(this.cards[j]);
            currentValue = cardRankLookupTable[this.cards[j].value];

          }
          else if (cardRankLookupTable[this.cards[j].value] !== currentValue) {
            // Break the straight if the current card value is not consecutive
            break;
          }
        }
        
        if (potentialStraight.length === 5) {
          // Push array of 5 cards into straights array
          straights.push(potentialStraight);
        }
      }
    
      console.log(straights);
      return straights;
    }

    findSpareCards(doubles, triples, straights, flushes) {
      const spareCards = [];
    
      for (let i = 0; i < this.cards.length; i++) {
        const cardToCheck = this.cards[i];
    
        if (
          !doubles.some(double => double.some(d => d.suit === cardToCheck.suit && d.value === cardToCheck.value)) &&
          !triples.some(triple => triple.some(t => t.suit === cardToCheck.suit && t.value === cardToCheck.value)) &&
          !straights.some(straight => straight.some(s => s.suit === cardToCheck.suit && s.value === cardToCheck.value)) &&
          !flushes.some(flush => flush.some(f => f.suit === cardToCheck.suit && f.value === cardToCheck.value))
        ) {
          spareCards.push(cardToCheck);
        }
      }
    
      console.log(spareCards);
      return spareCards;
    }
    

    isSpareCard(card, lastPlayedHand, doubles, triples, straights, flushes, cardMap) {
      return (
        cardMap.get(card.suit + card.value) > cardMap.get(lastPlayedHand[0]) &&
        !doubles.some(double => double.some(d => d.suit === card.suit && d.value === card.value)) &&
        !triples.some(triple => triple.some(t => t.suit === card.suit && t.value === card.value)) &&
        !straights.some(straight => straight.some(s => s.suit === card.suit && s.value === card.value)) &&
        !flushes.some(flush => flush.some(f => f.suit === card.suit && f.value === card.value))
      );
    }

    //compare all the combos with each other and return the best combo to play depending on the game situation
    comboSelector(lastPlayedHand, doubles, triples, straights, flushes, fullhouses, cardMap) {

    }

    //this function takes into account previously played card/s and returns a hand array to the playCard function
    selectCard(lastValidHand, gameDeck, wonRound){
      var lastPlayedHandIndex = gameDeck.length - lastValidHand;
      var lastPlayedHand = [];
      var hand = []; //hand array holds selected cards
      var deck = new Deck();
      var cardMap = deck.cardHash();

      for(let i = lastPlayedHandIndex; i < gameDeck.length; i++){
        //if i less than 0 (happens after user wins a round, because gamedeck length is 0 and lastValidHand stores length of winning hand)
        if(i < 0){
            continue; //don't insert cards into last played hand and continue out of loop
        }
        lastPlayedHand.push(gameDeck[i].suit + gameDeck[i].value); //insert last played cards into array (as a string to use with comboValidate function)
      }
      console.log("lastPLAYEDHANDLENGTH: " + lastPlayedHand.length)

      //return double cards that are identified as an array of cards
      var doubles = this.findDoubles();      
      var triples = this.findTriples();    
      var straights = this.findStraights();
      var flushes = this.findFlushes();
      var fullHouses = this.findFullHouses();
      var spareCards = this.findSpareCards(doubles, triples, straights, flushes);
  
      console.log("FLUSHES LENGTH: " + flushes.length);
      console.log("STRAIGHTS LENGTH: " + straights.length);
      console.log("FULLHOUSES LENGTH: " + fullHouses.length);
      
      
      switch(lastPlayedHand.length){
        //FIRST TURN / FREE TURN LOGIC
        case 0:
          //first turn, opponent must play 3 of diamonds, should add another if check to see if theres any combos that include 3 of diamonds
          if(gameDeck.length == 0 && wonRound == false){
            //if 3 of diamonds combo
            console.log("starting round, play 3 of diamonds");
            hand.push(this.cards[0]);
            return hand;
          }
          //change this to play a double, triple, combo if they have one, if not play low single (use random generator to choose which move to play)
          else if(gameDeck.length == 0 && wonRound == true){
            console.log("opponent won round")
            hand.push(this.cards[0]);
            return hand;
          }
          break;
        //SINGLE CARD LOGIC
        case 1:
          //loop through player's cards
          for(let i = 0; i < this.numberOfCards; i++){
            //TO DO: if cardToCheck is a 2, and player has a low combo they need to get rid of (e.g 3-7 straight, flush), play the 2
            var cardToCheck = this.cards[i];
            console.log(cardToCheck);

            //change ai single card strategy depending on how many twos they have
            switch(this.findTwos().length){
              case 0:
                console.log("0 two");
                //find first card thats higher than last played card AND is not part of any doubles, triples, straights, flushes, straight flush and put it in hand and return it
                if (this.isSpareCard(cardToCheck, lastPlayedHand, doubles, triples, straights, flushes, cardMap)){
                  hand.push(this.cards[i]);
                  return hand;
                }
                //else if card is higher value than last played card and card is a 2 of diamonds or clubs and player has a straight or flush
                //else if i cant find card thats higher than previously played card (TO DO: add a check to check if card is part of combo), pass
                else if(i == this.numberOfCards - 1){
                  console.log("pass");
                  hand.length = 0;
                  return hand;
                }
                break;
              case 1:
                console.log("1 two");
                //find first card thats higher than last played card AND is not part of any doubles, triples, straights, flushes, straight flush and put it in hand and return it
                if (this.isSpareCard(cardToCheck, lastPlayedHand, doubles, triples, straights, flushes, cardMap)){
                  if(spareCards.length > 1 && cardToCheck.value == 2){
                    //if player has one 2 card only, check if player has any other combo or spare cards
                  } else if(spareCards.length > 1 && cardToCheck.value == 2){
                    
                  }
                  
                  //if not a 2 card, play the card
                  hand.push(this.cards[i]);
                  return hand;
                }
                //else if card is higher value than last played card and card is a 2 of diamonds or clubs and player has a straight or flush
                //else if i cant find card thats higher than previously played card (TO DO: add a check to check if card is part of combo), pass
                else if(i == this.numberOfCards - 1){
                  console.log("pass");
                  hand.length = 0;
                  return hand;
                }
                break;
              case 2:
                console.log("2 two");
                //find first card thats higher than last played card AND is not part of any doubles, triples, straights, flushes, straight flush and put it in hand and return it
                if (this.isSpareCard(cardToCheck, lastPlayedHand, doubles, triples, straights, flushes, cardMap)){
                  hand.push(this.cards[i]);
                  return hand;
                }
                //else if card is higher value than last played card and card is a 2 of diamonds or clubs and player has a straight or flush
                //else if i cant find card thats higher than previously played card (TO DO: add a check to check if card is part of combo), pass
                else if(i == this.numberOfCards - 1){
                  console.log("pass");
                  hand.length = 0;
                  return hand;
                }
                break;
              case 3:
                console.log("3 two");
                //find first card thats higher than last played card AND is not part of any doubles, triples, straights, flushes, straight flush and put it in hand and return it
                if (this.isSpareCard(cardToCheck, lastPlayedHand, doubles, triples, straights, flushes, cardMap)){
                  hand.push(this.cards[i]);
                  return hand;
                }
                //else if card is higher value than last played card and card is a 2 of diamonds or clubs and player has a straight or flush
                //else if i cant find card thats higher than previously played card (TO DO: add a check to check if card is part of combo), pass
                else if(i == this.numberOfCards - 1){
                  console.log("pass");
                  hand.length = 0;
                  return hand;
                }
                break;
              case 4:
                console.log("4 two");
                //find first card thats higher than last played card AND is not part of any doubles, triples, straights, flushes, straight flush and put it in hand and return it
                if (this.isSpareCard(cardToCheck, lastPlayedHand, doubles, triples, straights, flushes, cardMap)){
                  hand.push(this.cards[i]);
                  return hand;
                }
                //else if card is higher value than last played card and card is a 2 of diamonds or clubs and player has a straight or flush
                //else if i cant find card thats higher than previously played card (TO DO: add a check to check if card is part of combo), pass
                else if(i == this.numberOfCards - 1){
                  console.log("pass");
                  hand.length = 0;
                  return hand;
                }
                break;
            }
          }
          break;
          //DOUBLE CARD LOGIC
          case 2:
            //if opponent has at least 1 pair left
            if(doubles.length >= 1){
              console.log("Valid double left")
              //TO DO: if pair is not part of combo(TO DO) and is bigger than last played hand(DONE)
              for(let i = 0; i<doubles.length; i++){
                if(cardMap.get(doubles[i][1]["suit"] + doubles[i][1]["value"]) > cardMap.get(lastPlayedHand[1])){
                  console.log("PLAYING PAIR");
                  return doubles[i]; //return pair of doubles that meets criteria
                }
                
              }
              
            }
            else {
              console.log("pass");
              hand.length = 0;
              return hand;
            }
            //TRIPLE CARD LOGIC
            case 3:
              //if opponent has at least 1 triple left
              if(triples.length >= 1){
                console.log("Valid triple left")
                
                for(let i = 0; i<triples.length; i++){
                  if(cardMap.get(triples[i][2]["suit"] + triples[i][2]["value"]) > cardMap.get(lastPlayedHand[2])){
                    console.log("PLAYING TRIPLE");
                    return triples[i]; //return pair of doubles that meets criteria
                  }
                }
                
              }
              console.log("pass");
              hand.length = 0;
            return hand;
            //COMBO LOGIC
            case 5:
              console.log("pass");
              hand.length = 0;
              return hand;
      }
    }

    async playCard(gameDeck, turn, lastValidHand, wonRound, players) {
        var placeCardAudio = new Audio("audio/flipcard.mp3");
        var passAudio = new Audio("audio/pass.mp3");
        var self = this; //assign player to self
        
        //function to find all possible combos, find outlier cards
        //if lowest card in ai hand(thats not part of a combo) is larger than last played card(only single for now)
        //select cpu hand function based on previous played cards, current combos, etc, insert cards into hand, then play the animation
        var hand = self.selectCard(lastValidHand, gameDeck, wonRound, players);
        
        var myPromise = new Promise((resolve) => {
          var animationPromises = []; //holds all animation promises
          var cardsToRemove = []; //holds indexes of cards to be removed
            
            //place card after 1 second delay
            setTimeout(function() {
              if(hand.length == 0){
                resolve(hand.length);
                passAudio.play();
              }
              hand.forEach(cardId => {
                //return index of player's card that matches card in hand (different than player class, because hand contains card object)
                let cardIndex = self.cards.findIndex(card => card === cardId);
                console.log("CARD ID : " + cardId.suit + cardId.value);
                //animate cards using cardId to identify corresponding images
                let imageToAnimate = document.getElementById(cardId.suit + cardId.value);

                //adjust x and y deltas for each opponent player so animations perfectly finish on top of gameDeck
                let player1DeltaX = 430 - imageToAnimate.offsetLeft;  // Fixed X-coordinate of the target position
                let player1DeltaY = 180 - imageToAnimate.offsetTop; // Fixed Y-coordinate of the target position

                let player2DeltaX = 500 - imageToAnimate.offsetLeft;
                let player2DeltaY = 230 - imageToAnimate.offsetTop;

                let player3DeltaX = 430 - imageToAnimate.offsetLeft; 
                let player3DeltaY = 180 - imageToAnimate.offsetTop;

                //animations are different, depending on current opponent
                if(turn == 1){
                  // Animate the image from source location to the gameDeck img element, rotation to spin the card
                  var animation = imageToAnimate.animate([
                    { transform: "translate(0, 0) rotate(0deg)" },
                    { transform: `translate(${player1DeltaX}px, ${player1DeltaY}px)` }
                  ], {
                      duration: 300,
                      easing: "ease-in"
                  });
                  //the animations will be added to animationPromises array, only after the animation fully resolves
                  animationPromises.push(animation.finished.then(() => new Promise(resolve => setTimeout(resolve, 0)))); 
                  }
                  else if(turn == 2){
                      var animation = imageToAnimate.animate([
                        { transform: "translate(0, 0) rotate(0deg)" },
                        { transform: `translate(${player2DeltaX}px, ${player2DeltaY}px)` }
                      ], {
                          duration: 300,
                          easing: "ease-in"
                      });
                      animationPromises.push(animation.finished.then(() => new Promise(resolve => setTimeout(resolve, 0)))); 
                  }
                  else {
                      var animation = imageToAnimate.animate([
                        { transform: "translate(0, 0) rotate(0deg)" },
                        { transform: `translate(${player3DeltaX}px, ${player3DeltaY}px)` }
                      ], {
                          duration: 300,
                          easing: "ease-in"
                      });
                      animationPromises.push(animation.finished.then(() => new Promise(resolve => setTimeout(resolve, 0)))); 
                  }

                  animation.finished.then(() => {
                    console.log("ANIMATION FINISH")
                        if (cardIndex !== -1) {
                            gameDeck.push(self.cards[cardIndex]); //insert opponent card that matches cardId into game deck
                            console.log("card inserted: " + self.cards[cardIndex].suit + self.cards[cardIndex].value);
                            cardsToRemove.push(cardIndex); //add card index into cardsToRemove array, so I can remove all cards at same time after animations are finished
                            placeCardAudio.play();
                        }
                  });
              })

              Promise.all(animationPromises).then(() => {
                //loop through cardsToRemove array which contains card indexes to be removed
                cardsToRemove.sort().forEach(index => {
                    self.cards.splice(index, 1); //remove played cards from player's hand after animations finish
                });
                
                self.printCards(turn);
                resolve(hand.length); //return amount of cards played
                hand.length = 0; //clear hand after playing it
            });
              //cardValidate = self.cardLogic(gameDeck, hand, lastValidHand, wonRound); 

            }, 1000); // delay time in milliseconds 
        });

        return myPromise;
    }
}