class GameState {
    constructor(players, gameDeck, lastHand, turn, lastValidHand, passTracker, wonRound, finishedDeck, playersFinished) {
      this.players = players;
      this.gameDeck = gameDeck;
      this.lastHand = lastHand;
      this.turn = turn;
      this.lastValidHand = lastValidHand;
      this.passTracker = passTracker;
      this.wonRound = wonRound;
      this.finishedDeck = finishedDeck;
      this.playersFinished = playersFinished;
    }
  
    updatePlayers() {
      // Update the HTML elements for each player's hand
    }
  
    updateGameDeck() {
      // Update the HTML element for the game deck
    }
  
    updatePlayedCards() {
      // Update the HTML element for the played cards
    }
  
    updateTurn() {
      // Update the HTML element for the current player's turn
    }
  
    updateLastValidHand() {
      // Update the lastValidHand variable based on the current state of the played cards
    }
  
    resetPassTracker() {
      // Reset the passTracker variable to 0
    }
  
    toggleWonRound() {
      // Toggle the wonRound variable between true and false
    }
  
    getNextPlayer() {
      // Return the index of the next player in the players array
    }
  
    getValidHands() {
      // Return an array of valid hands that the current player can play
    }
  
    playHand(hand) {
      // Play the specified hand of cards and update the game state accordingly
    }
  }
  export default GameState;