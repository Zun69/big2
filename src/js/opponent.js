import Player from "./player.js"
import Deck from "./deck.js"

export default class Opponent extends Player {
    constructor(cards = []) {
      super(cards);
    }

    findDoubles() {
      var doubles = [];
    
      for (let i = 0; i < this.numberOfCards - 1; i++) {
        var currentCard = this.cards[i];
        var nextCard = this.cards[i + 1];
        
        if (currentCard.value === nextCard.value) {
          // check if cards have the same value but different suits
          if (currentCard.suit !== nextCard.suit) {
            doubles.push(currentCard);
            doubles.push(nextCard);
          }
        }
      }
      
      return doubles;
    }

    selectCard(lastValidHand, gameDeck, wonRound, players){
      var lastPlayedHandIndex = gameDeck.length - lastValidHand;
      var lastPlayedHand = [];
      var hand = []; //hand array holds selected cards
      var cardValidate;
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
      
      switch(lastPlayedHand.length){
        case 0:
          //first turn, opponent must play 3 of diamonds, should add another if check to see if theres any combos that include 3 of diamonds
          if(gameDeck.length == 0 && wonRound == false){
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
        case 1:
          for(let i = 0; i < this.numberOfCards; i++){
            //find first card thats higher than last played card and put it in hand and return it (TO DO: add a check to see if card is part of combo)
            if(cardMap.get(this.cards[i].suit + this.cards[i].value) > cardMap.get(lastPlayedHand[0])){
              hand.push(this.cards[i]);
              return hand;
            }
            //else if i cant find card thats higher than previously played card (TO DO: add a check to check if card is part of combo), pass
            else if(i == this.numberOfCards - 1){
              console.log("pass");
              hand.length = 0;
              return hand;
            }
          }
          break;
          //doubles logic
          case 2:
            //return double cards that are identified as an array of cards
            hand = this.findDoubles();
            
            //if opponent has 2 pairs left
            if(hand.length > 1){
              //return first pair to be played (lowest pair), if lower pair higher than last played pair and not part of combo
              if(cardMap.get(hand[0]) >  cardMap.get(lastPlayedHand[0])){
                return [hand[0], hand[1]];
              }
              else {
                console.log("pass");
                hand.length = 0;
                return hand;
              }
            }
            //if opponent has 1 pair left
            else if(hand.length == 2){
                console.log("pass");
                hand.length = 0;
                return hand;
            }
            else {
              console.log("pass");
              hand.length = 0;
              return hand;
            }
            case 3:
              console.log("pass");
              hand.length = 0;
            return hand;
            case 4:
              console.log("pass");
              hand.length = 0;
              return hand;
            case 5:
              console.log("pass");
              hand.length = 0;
              return hand;
              

      }

      //return empty hand if my future ai decides its best move is to pass
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
                var cardIndex = self.cards.findIndex(card => card === cardId);
                console.log("CARD ID : " + cardId.suit + cardId.value);
                //animate cards using cardId to identify corresponding images
                var imageToAnimate = document.getElementById(cardId.suit + cardId.value);
                var target = document.querySelector("#gameDeck img");
                var targetRect = target.getBoundingClientRect();

                //calculate the distance to move in x and y directions
                var deltaX = targetRect.left - imageToAnimate.offsetLeft;
                var deltaY = targetRect.top - imageToAnimate.offsetTop;

                //adjust x and y deltas for each opponent player so animations perfectly finish on top of gameDeck
                var player1DeltaX = deltaX - 368; 
                var player1DeltaY = deltaY - 210; 

                var player2DeltaX = deltaX - 350; 
                var player2DeltaY = deltaY - 50;

                var player3DeltaX = deltaX - 420; 
                var player3DeltaY = deltaY - 255;

                //animations are different, depending on current opponent
                if(turn == 1){
                  // Animate the image from source location to the gameDeck img element, rotation to spin the card
                  var animation = imageToAnimate.animate([
                    { transform: "translate(0, 0) rotate(0deg)" },
                    { transform: `translate(${player1DeltaX}px, ${player1DeltaY}px) rotate(360deg)` }
                  ], {
                      duration: 420,
                      easing: "ease-in"
                  });
                  //the animations will be added to animationPromises array, only after the animation fully resolves
                  animationPromises.push(animation.finished.then(() => new Promise(resolve => setTimeout(resolve, 0)))); 
                  }
                  else if(turn == 2){
                      var animation = imageToAnimate.animate([
                        { transform: "translate(0, 0) rotate(0deg)" },
                        { transform: `translate(${player2DeltaX}px, ${player2DeltaY}px) rotate(360deg)` }
                      ], {
                          duration: 420,
                          easing: "ease-in"
                      });
                      animationPromises.push(animation.finished.then(() => new Promise(resolve => setTimeout(resolve, 0)))); 
                  }
                  else {
                      var animation = imageToAnimate.animate([
                        { transform: "translate(0, 0) rotate(0deg)" },
                        { transform: `translate(${player3DeltaX}px, ${player3DeltaY}px) rotate(360deg)` }
                      ], {
                          duration: 420,
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
                resolve(hand.length); //return amount of cards played, to move forward for loop
                hand.length = 0; //clear hand after playing it
            });
              //cardValidate = self.cardLogic(gameDeck, hand, lastValidHand, wonRound); 

            }, 1000); // delay time in milliseconds 
        });

        return myPromise;
    }
}