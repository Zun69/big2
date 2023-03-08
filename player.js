export default class Player{ 
    constructor(cards){ //player has cards, 13 each
        this.cards = cards
    }

    get numberOfCards() {
        return this.cards.length
    }

    addCards(card){
        //add cards to hand
        this.cards += card;
    }

    printCards(card, playerNum){
        let cardImg = document.createElement("img");

        //if player 1 print out cards to see
        if(playerNum == 1){
            cardImg.src = "./cards/" + card[0] + card[1] + ".png"; //returns suit and value e.g ♠2.png
            document.getElementById("player" + playerNum).append(cardImg);
        }
        else{ //else print out back card because you dont want to see other player's cards
            cardImg.src = "./cards/BACK.png";
            document.getElementById("player" + playerNum).append(cardImg);
        }
    }

    playHand(){
        //play hand logic
    }

    pass() {
        //player can pass logic
    }

}