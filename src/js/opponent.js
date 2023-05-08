// Child class
export default class Opponent extends Player {
    constructor(cards = []) {
      super(cards);
    }

    async playCard(gameDeck, turn, lastValidHand, wonRound) {
    }
}