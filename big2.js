import Deck from "./deck.js"
import Player from "./player.js"

const deck = new Deck()
const player1 = new Player()
deck.shuffle()

console.log(deck.cards)
