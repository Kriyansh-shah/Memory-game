document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const playerNameInput = document.getElementById('playerName');
    const saveButton = document.getElementById('saveButton');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    const gameBoard = document.getElementById('gameBoard');
    const restartButton = document.getElementById('restartButton');
    const backButton = document.getElementById('backButton');
    const clickCounter = document.getElementById('clickCounter');
    
    let clicks = 0;
    let flippedCards = [];
    let matchedPairs = 0;
    let totalPairs = 0;

    saveButton.addEventListener('click', () => {
        const playerName = playerNameInput.value;
        if (playerName) {
            alert(`Welcome, ${playerName}!`);
        } else {
            alert('Please enter your name.');
        }
    });

    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const difficulty = button.dataset.difficulty;
            startGame(difficulty);
        });
    });

    function startGame(difficulty) {
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        gameBoard.innerHTML = '';
        clicks = 0;
        flippedCards = [];
        matchedPairs = 0;
        updateClickCounter();
        
        let cardCount;
        switch(difficulty) {
            case 'easy':
                cardCount = 12;
                gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
                break;
            case 'medium':
                cardCount = 18;
                gameBoard.style.gridTemplateColumns = 'repeat(6, 1fr)';
                break;
            case 'hard':
                cardCount = 24;
                gameBoard.style.gridTemplateColumns = 'repeat(8, 1fr)';
                break;
            default:
                throw new Error('Invalid difficulty level');
        }
        
        totalPairs = cardCount / 2;
        const cardValues = generateCardValues(cardCount);
        
        for (let i = 0; i < cardCount; i++) {
            const card = createCard(cardValues[i]);
            gameBoard.appendChild(card);
        }
    }

    function generateCardValues(count) {
        const values = [];
        for (let i = 1; i <= count / 2; i++) {
            values.push(i, i);
        }
        return shuffleArray(values);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createCard(value) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.textContent = value;
        card.addEventListener('click', () => flipCard(card, value));
        return card;
    }

    function flipCard(card, value) {
        if (flippedCards.length < 2 && !card.classList.contains('flipped') && !card.classList.contains('matched')) {
            card.classList.add('flipped');
            flippedCards.push({ card, value });
            clicks++;
            updateClickCounter();

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 1000);
            }
        }
    }

    function checkMatch() {
        const [card1, card2] = flippedCards;
        if (card1.value === card2.value) {
            card1.card.classList.add('matched');
            card2.card.classList.add('matched');
            matchedPairs++;
            if (matchedPairs === totalPairs) {
                setTimeout(() => {
                    gameBoard.classList.add('victory');
                    setTimeout(() => {
                        gameBoard.classList.remove('victory');
                        alert('Congratulations! You won!');
                    }, 1000);
                }, 500);
            }
        } else {
            card1.card.classList.remove('flipped');
            card2.card.classList.remove('flipped');
        }
        flippedCards = [];
    }

    function updateClickCounter() {
        clickCounter.textContent = `Clicks: ${clicks}`;
    }

    restartButton.addEventListener('click', () => {
        const difficulty = gameBoard.children.length === 12 ? 'easy' : 
                           gameBoard.children.length === 18 ? 'medium' : 'hard';
        startGame(difficulty);
    });

    backButton.addEventListener('click', () => {
        gameScreen.style.display = 'none';
        startScreen.style.display = 'block';
    });
});