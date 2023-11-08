var cardHashModule = {
    deck: function (_deck) {
      _deck.cardHash = function () {
        var i = 0;
        var cardValueMap = new Map();
        var deck = _deck.cards;
  
        while (i < 13) {
          cardValueMap.set(deck[i].cardSuit  + deck[i].cardRank, i * 4 + 1);
          i++;
        }
        while (i < 26) {
          cardValueMap.set(deck[i].cardSuit  + deck[i].cardRank, (i % 13) * 4 + 2);
          i++;
        }
        while (i < 39) {
          cardValueMap.set(deck[i].cardSuit  + deck[i].cardRank, (i % 13) * 4 + 3);
          i++;
        }
        while (i < 52) {
          cardValueMap.set(deck[i].cardSuit  + deck[i].cardRank, (i % 13) * 4 + 4);
          i++;
        }
  
        return cardValueMap;
      };
    },
  };
  
  Deck.modules.cardHash = cardHashModule;