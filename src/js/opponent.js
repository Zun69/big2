import Player from "./player.js"
import Deck from "./deck.js"

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
    
    cardCmp(a,b){
      //cmpFunc for combos prioritizing length then values ORDER:Desc
      var lengthDelta = a.length - b.length;
      if (lengthDelta == 0){
        return b[0].value - a[0].value;

      }else{
        return lengthDelta;
      }
    }

    findDupes(){
      //find n-card multiples; save time on combo searching
      this.cards.sort((a,b) => a.value - b.value);
      var dupes = [];
      var curVal = NaN
      for (let i = 0; i < this.numberOfCards; i++) {
        var currentCombo = [];
        var currentCard = this.cards[i];
        curVal = currentCard.value;
        currentCombo.push(currentCard);
        var nextCardIndex = i+1;
        if(nextCardIndex < this.cards.length){
          var nextCard = this.cards[nextCardIndex];
          while (nextCard.value == curVal){
            currentCombo.push(nextCard);
            if (nextCardIndex+1 == this.cards.length){
              //end while when we run out of cards
              break;
            }
            nextCard = this.cards[nextCardIndex++];
          }
        }
        dupes.push(currentCombo);
        currentCombo = [];
      }
      dupes.sort(this.cardCmp)
      return dupes
    }

    findFlush(dupes){
      var flushes = [];
      for (let i = 0; i < this.numberOfCards - 2; i++) {
        var currentCombo = [];
        var currentCard = this.cards[i];
        var curVal = currentCard.suit;
        currentCombo.push(currentCard);
        var nextCardIndex = i+1;
        var nextCard = this.cards[nextCardIndex];
        while (nextCard.suit == curVal-1){
          //add to combo
          currentCombo.push(nextCard);
          curVal = nextCard.suit;
          if (nextCardIndex+1 == this.cards.length){
            //end while when we run out of cards
            dupes.push(currentCombo);
            break;
          }
          nextCard = this.cards[nextCardIndex++];
          if (currentCombo.length == 5){
            //save this combo;
            dupes.push(currentCombo);
            currentCombo = [];
          }
        }
        //can optimize by skipping cycles
      }
      //TODO(xinny): modify this to sort flushes properly
      flushes.sort(this.cardCmp)
      return flushes;
    }

    findStraights(dupes){
      //find all straights and then sort by size
      var straights = [];
      for (let i = 0; i < this.numberOfCards-5; i++) {
        var currentCombo = [];
        var currentCard = this.cards[i];
        var curVal = currentCard.value;
        currentCombo.push(currentCard);
        var nextCardIndex = i+1;
        var nextCard = this.cards[nextCardIndex];
        while (nextCard.value == curVal-1 && currentCombo.length < 5){
          //add to combo
          currentCombo.push(nextCard);
          curVal = nextCard.value;
          if (nextCardIndex+1 == this.cards.length){
            //end while when we run out of cards
            break;
          }
          nextCard = this.cards[nextCardIndex++];
          
        }
        //can optimize by skipping cycles
        if (currentCombo.length == 5){
          //save this combo;
          dupes.push(currentCombo);
          currentCombo = []; 
        }
      }
      straights.sort(this.cardCmp)
      return straights;
    }

    findQuads(dupes){
      //find quads
      //strat: use smallest value for 5th card without breaking longer combos
      var LENGTH = 4; 
      var quads = dupes.filter(element => element.length == 4);
      var fifth;
      //get these to make sure 5th card doesnt break combos
      var straights = this.findStraights(dupes);
      var flush = this.findFlush(dupes);
      let flag = (card) => flush.map(elem => (
        (elem.includes(card)).filter(v =card> v == true ? v : null).length != 0)  || 
        (straights.map(elem => elem.includes(card)).filter(v => v == true ? v : null).length != 0)
      );
      //find ideal 5th card
      for(let i = 1; i<4; i++){
        var searchArr = dupes.filter(element => element.length == i); 
        if (searchArr.length != 0){
          //iterate from smallest values
          for(let j = searchArr.length-1; j>=0;j--){
            var candidate = null;
            //iterate through each card
            if(searchArr[j].length > 1){
              candidate = searchArr[j].map(flag);
              if (candidate.length != 0){
                fifth = candidate[-1];
                break;
              }
            }else{
              candidate = searchArr[j];
              if (!flag(candidate)){
                fifth = candidate;
                break;
              }
            } 
          }
        }
      }
      //add ideal 5th to each card
      if (fifth != null && quads != null){
        quads.forEach(element => {
          element.push(fifth);
        });
        return quads;
      }
      //no ideal fifth (almost impossible)
      return null;
    }

    findFullHouse(dupes){
      //find quads
      //strat: use smallest value for 5th card without breaking longer combos
      var fullHouse = [];
      var triple = dupes.filter(element => element.length == 3);
      var pair = null;
      //get these to make sure 5th card doesnt break combos
      var straights = this.findStraights(dupes);
      var flush = this.findFlush(dupes);

      //filter to see if a given card is needed for a flush / straight
      let flag = (card) => flush.map(elem => (
        (elem.includes(card)).filter(v =card> v == true ? v : null).length != 0)  || 
        (straights.map(elem => elem.includes(card)).filter(v => v == true ? v : null).length != 0) 
      );
      //find ideal pair
      var searchArr = dupes.filter(element => element.length == 2); 
      if (searchArr.length != 0){
        //iterate from smallest values
        for(let j = searchArr.length-1; j>=0;j--){
          var candidate = null;
          //iterate through each card
          if(searchArr[j].length > 1){
            candidates = searchArr[j].map(flag);
            if (candidates.length != 0){
              pair = candidates[-1];
              break;
            }
          }
        }
      }
      //add ideal 5th to each card
      if (pair != null){
        triple.forEach(element => {
          var fh = []; 
          //TODO (xinny) implement this to create a fullhouse even when the trips are the same vlaue as the pair
          // current behavior: ignore the triple when it is equal to a pair
          if (element[0].value != pair[0].value){
            element.forEach(card => fh.push(card));
            pair.forEach(card => fh.push(card));
            fullHouse.concat(fh);
          }
        });
        return fullHouse;
      }
      //no ideal pair
      return null;
    }

    findAllCombos(dupes){
      console.log('finding combos');
      //save combos by length
      //decide which length combo to play then access the combos in DESCending order
      var combos = {
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': [] 
      };
      dupes.forEach(element => {
        var key = element.length;
        combos[key].concat(element);
      });
      //insertion order represents size
      //find more complex combos
      //sort by size
      //TODO(xinny): find straight + flush (inc royal flush)
      //use quads as the biggest combo for now
      var quads = this.findQuads(dupes);
      var fullHouse = this.findFullHouse(dupes);
      var flush = this.findFlush(dupes);
      var straights = this.findFlush(dupes);
      if (quads){
        quads.forEach(elem => {
          if(elem != null){
            combos['5'].concat(elem);
          }
        });
      }
      if (fullHouse){
        fullHouse.forEach(elem => {
          if(elem != null){
            combos['5'].concat(elem);
          }
        });
      } 
      if(flush){
        flush.forEach(elem => {
          if(elem != null){
            combos['5'].concat(elem);
          }
        });
      }
      if(straights){
        straights.forEach(elem => {
          if(elem != null){
            combos['5'].concat(elem);
          }
        });
      }

      return combos
    }
    //this function takes into account previously played card/s and returns a hand array (to playCard function)
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

      //return double cards that are identified as an array of cards
      var dupes = this.findDupes();
      dupes.forEach (combo => {
        console.log("DUPES: " + combo.suit + combo.value);
      })
      var comboMap = this.findAllCombos(dupes);
      
      //TODO(xinny): use new functions to update play strategy (ask Jackey if you want help)
      // avaliable options are store within combo map
      
      switch(lastPlayedHand.length){
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
            //if opponent has at least 1 pair left
            if(doubles.length >= 2){
              console.log("PLAYING PAIR");
              //return first pair to be played (lowest pair), if lower pair's 2nd card higher than last played pair's 2nd card and not part of combo
              if(cardMap.get(doubles[1].suit + doubles[1].value) >  cardMap.get(lastPlayedHand[1])){
                return [doubles[0], doubles[1]];
              }
              else {
                console.log("pass");
                hand.length = 0;
                return hand;
              }
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

                //adjust x and y deltas for each opponent player so animations perfectly finish on top of gameDeck
                var player1DeltaX = 450 - imageToAnimate.offsetLeft;  // Fixed X-coordinate of the target position
                var player1DeltaY = 200 - imageToAnimate.offsetTop; // Fixed Y-coordinate of the target position

                var player2DeltaX = 500 - imageToAnimate.offsetLeft;
                var player2DeltaY = 280 - imageToAnimate.offsetTop;

                var player3DeltaX = 450 - imageToAnimate.offsetLeft; 
                var player3DeltaY = 180 - imageToAnimate.offsetTop;

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