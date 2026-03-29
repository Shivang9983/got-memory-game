const cards = document.querySelectorAll('.memory-card');
const movesElement = document.getElementById('moves');
const timerElement = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const modalOverlay = document.getElementById('victory-modal');
const finalTimeElement = document.getElementById('final-time');
const finalMovesElement = document.getElementById('final-moves');
const playAgainBtn = document.getElementById('play-again-btn');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// Stats
let moves = 0;
let matches = 0;
const totalMatches = 6;

// Timer
let startTime;
let timerInterval;
let gameStarted = false;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimer() {
    const currentTime = new Date();
    const timeElapsed = Math.floor((currentTime - startTime) / 1000);
    timerElement.innerText = formatTime(timeElapsed);
}

function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        startTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    startTimer();
    this.classList.add('flip');

    if (!hasFlippedCard) {
        // first click
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // second click
    secondCard = this;
    incrementMoves();
    checkForMatch();
}

function incrementMoves() {
    moves++;
    movesElement.innerText = moves;
}

function checkForMatch() {
    let isMatch = firstCard.dataset.house === secondCard.dataset.house;

    if (isMatch) {
        disableCards();
        matches++;
        if (matches === totalMatches) {
            gameWon();
        }
    } else {
        unflipCards();
    }
}

function disableCards() {
    // Add matched class for glowing effect
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

function gameWon() {
    stopTimer();
    setTimeout(() => {
        finalTimeElement.innerText = timerElement.innerText;
        finalMovesElement.innerText = moves;
        modalOverlay.classList.remove('hidden');
    }, 500);
}

function resetGame() {
    stopTimer();
    gameStarted = false;
    moves = 0;
    matches = 0;
    timerElement.innerText = '00:00';
    movesElement.innerText = '0';
    modalOverlay.classList.add('hidden');

    cards.forEach(card => {
        card.classList.remove('flip', 'matched');
        card.addEventListener('click', flipCard);
    });

    resetBoard();
    setTimeout(shuffle, 500); // Wait for unflip animation before shuffling
}

function shuffle() {
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * 12);
        card.style.order = randomPos;
    });
}

// Event Listeners
cards.forEach(card => card.addEventListener('click', flipCard));
restartBtn.addEventListener('click', resetGame);
playAgainBtn.addEventListener('click', resetGame);

// Initial shuffle
shuffle();
