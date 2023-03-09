import Deck from "./deck.js"

export default class Player{ 
    constructor(cards = []){ //initialise player with an empty array of cards, will fill array with card objects
        this.cards = cards
    }

    addCards(card, playerNum){
        //add cards to hand
        this.cards.push(card)
    }

    printCards(playerNum){
        for(let i = 0; i < this.cards.length; i++){
            let cardImg = document.createElement("img")

            if(playerNum == 1){
                cardImg.src = "./cards/" + this.cards[i].suit + this.cards[i].value + ".png"; //returns suit and value e.g ♠2.png
                document.getElementById("player" + playerNum).append(cardImg);
            }
            else{ //else print out back card because you dont want to see other player's cards
                //cardImg.src = "./cards/BACK.png"; //need to see everyones card because i need to test the game logic out
                cardImg.src = "./cards/" + this.cards[i].suit + this.cards[i].value + ".png"
                document.getElementById("player" + playerNum).append(cardImg)
            }
        }
    }

    playHand(){
        //play hand logic
    }

    pass() {
        //player can pass logic
    }

    sortHand(){
        let deck = new Deck()
        let cardMap = deck.cardHash()

        //bubble sort using cardMap to compare card values
        for(var i = 0; i < this.cards.length; i++){
            for(var j = 0; j < (this.cards.length - i - 1); j++){
                //use current card as a key to cardMap using position value to compare and sort the cards
                if(cardMap.get(this.cards[j].suit + this.cards[j].value) > cardMap.get(this.cards[j + 1].suit + this.cards[j + 1].value)){ 
                    let temp = this.cards[j]
                    this.cards[j] = this.cards[j+1]
                    this.cards[j+1] = temp
                }
            }
        }
    }


}