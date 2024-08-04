let playerHand = [];
let dealerHand = [];
let deck = [];
let tips = [
    "Tip: Always stand on 17 or higher.",
    "Tip: Hit on 11 or lower.",
    "Tip: Consider the dealer's visible card.",
];

window.onload = function() {
    initializeGame();
};

function initializeGame() {
    createDeck();
    shuffleDeck();
    dealInitialCards();
    document.getElementById('result-text').textContent = '';
    document.getElementById('hit-button').style.display = 'inline';
    document.getElementById('stand-button').style.display = 'inline';
    document.getElementById('restart-button').style.display = 'none';
}

function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    deck = [];

    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealInitialCards() {
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];

    renderHands();
    checkGameStatus();
}

function renderHands() {
    const playerHandDiv = document.getElementById('player-hand');
    const dealerHandDiv = document.getElementById('dealer-hand');

    playerHandDiv.innerHTML = '';
    dealerHandDiv.innerHTML = '';

    let playerTotal = calculateTotal(playerHand);

    playerHand.forEach(card => {
        playerHandDiv.innerHTML += `<div class="card slide-right">${card.value}${card.suit}</div>`;
    });

    dealerHandDiv.innerHTML = `<div class="card flip">${dealerHand[0].value}${dealerHand[0].suit}</div>`;
    dealerHandDiv.innerHTML += `<div class="card">?</div>`;
}

function hit() {
    if (!isGameOver()) {
        playerHand.push(deck.pop());
        renderHands();
        showTip();
        checkGameStatus();
    }
}

function stand() {
    if (!isGameOver()) {
        dealerPlay();
        renderDealerHand();
        checkGameStatus();
    }
}

function dealerPlay() {
    while (getHandValue(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
}

function renderDealerHand() {
    const dealerHandDiv = document.getElementById('dealer-hand');
    dealerHandDiv.innerHTML = '';
    dealerHand.forEach(card => {
        dealerHandDiv.innerHTML += `<div class="card flip">${card.value}${card.suit}</div>`;
    });
}

function getHandValue(hand) {
    let value = 0;
    let aces = 0;
    hand.forEach(card => {
        if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
            value += 10;
        } else if (card.value === 'A') {
            value += 11;
            aces += 1;
        } else {
            value += parseInt(card.value);
        }
    });

    while (value > 21 && aces) {
        value -= 10;
        aces -= 1;
    }

    return value;
}

function calculateTotal(hand) {
    let total = 0;
    let aces = 0;

    hand.forEach(card => {
        if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
            total += 10;
        } else if (card.value === 'A') {
            total += 11;
            aces++;
        } else {
            total += parseInt(card.value);
        }
    });

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

function checkGameStatus() {
    const playerValue = getHandValue(playerHand);
    const dealerValue = getHandValue(dealerHand);
    const resultText = document.getElementById('result-text');

    if (playerValue > 21) {
        resultText.textContent = 'You busted! Dealer wins.';
        revealDealerHand();
        disableActions();
        showRestartButton();
    } else if (dealerValue > 21) {
        resultText.textContent = 'Dealer busted! You win.';
        revealDealerHand();
        disableActions();
        showRestartButton();
    } else if (dealerValue >= 17 && playerValue <= 21) {
        if (playerValue > dealerValue) {
            resultText.textContent = 'You win!';
        } else if (playerValue < dealerValue) {
            resultText.textContent = 'Dealer wins.';
        } else {
            resultText.textContent = 'It\'s a tie.';
        }
        revealDealerHand();
        disableActions();
        showRestartButton();
    }
}

function revealDealerHand() {
    renderDealerHand();
}

function disableActions() {
    document.getElementById('hit-button').style.display = 'none';
    document.getElementById('stand-button').style.display = 'none';
}

function showRestartButton() {
    document.getElementById('restart-button').style.display = 'inline';
}

function showTip() {
    const tipText = document.getElementById('tip-text');
    tipText.textContent = tips[Math.floor(Math.random() * tips.length)];
}

function isGameOver() {
    const resultText = document.getElementById('result-text').textContent;
    return resultText.includes('win') || resultText.includes('tie');
}
