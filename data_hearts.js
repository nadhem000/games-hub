// Hearts Card Game Logic - Fully corrected version
console.log('Loading Hearts game logic...');

// Game state variables
let isGameActive = false;
let currentRound = 1;
let currentTrick = 0;
let playerScore = 0;
let northScore = 0;
let eastScore = 0;
let westScore = 0;
let playerHand = [];
let northHand = [];
let eastHand = [];
let westHand = [];
let currentTrickCards = { player: null, north: null, east: null, west: null };
let leadingSuit = null;
let isPlayerTurn = false;
let heartsBroken = false;
let passDirection = 'left';
let passPhase = false;
let currentTrickLeader = null;
let aiTimeoutIds = [];

// New: track round points for shooting the moon
let roundPoints = { player: 0, north: 0, east: 0, west: 0 };

// New: pass selection for player
let selectedPassCards = [];
let passConfirmed = false;

// Card deck constants
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// ======================== GAME INITIALIZATION ========================
function startGame() {
    console.log('Starting new Hearts game...');
    clearAllAITimeouts();
    isGameActive = true;
    currentRound = 1;
    currentTrick = 0;
    playerScore = 0;
    northScore = 0;
    eastScore = 0;
    westScore = 0;
    heartsBroken = false;
    currentTrickLeader = null;
    updateUI();
    startBtn.disabled = true;
    passBtn.disabled = false;
    startRound();
    showTranslatableNotification('GH.hearts.gameStarted', 'info');
}

function startRound() {
    console.log(`Starting round ${currentRound}...`);
    clearAllAITimeouts();
    currentTrick = 0;
    currentTrickCards = { player: null, north: null, east: null, west: null };
    leadingSuit = null;
    currentTrickLeader = null;
    roundPoints = { player: 0, north: 0, east: 0, west: 0 }; // reset round points

    const deck = createDeck();
    shuffleDeck(deck);

    playerHand = deck.slice(0, 13);
    northHand = deck.slice(13, 26);
    eastHand = deck.slice(26, 39);
    westHand = deck.slice(39, 52);

    playerHand.sort(sortCards);
    northHand.sort(sortCards);
    eastHand.sort(sortCards);
    westHand.sort(sortCards);

    passDirection = getPassDirection();
    passPhase = true;
    passConfirmed = false;
    selectedPassCards = [];

    updatePlayerHand();
    updateTrickArea();
    updateTurnIndicator();

    if (passDirection !== 'hold') {
        console.log(`Pass phase: ${passDirection}`);
        showTranslatableNotification('GH.hearts.passPhase', 'info');
        passBtn.disabled = false;
        passBtn.textContent = getTranslation('GH.hearts.confirmPass', 'Confirm Pass');
    } else {
        passPhase = false;
        passBtn.disabled = true;
        startTrick();
    }
}

function getPassDirection() {
    const directions = ['left', 'right', 'across', 'hold'];
    return directions[(currentRound - 1) % 4];
}

// ======================== PASSING MECHANICS ========================
function completePass() {
    if (!passPhase || !isGameActive) return;

    // Player must select exactly 3 cards
    if (selectedPassCards.length !== 3) {
        showNotification(getTranslation('GH.hearts.selectThree', 'Please select 3 cards to pass.'), 'warning');
        return;
    }

    // Build pass map: each player's cards to give to their target
    const passMap = {
        player: { give: selectedPassCards, target: null },
        north: { give: [], target: null },
        east: { give: [], target: null },
        west: { give: [], target: null }
    };

    // Determine pass targets based on direction
    switch (passDirection) {
        case 'left':
            passMap.player.target = 'west';
            passMap.west.target = 'north';
            passMap.north.target = 'east';
            passMap.east.target = 'player';
            break;
        case 'right':
            passMap.player.target = 'east';
            passMap.east.target = 'north';
            passMap.north.target = 'west';
            passMap.west.target = 'player';
            break;
        case 'across':
            passMap.player.target = 'north';
            passMap.north.target = 'player';
            passMap.east.target = 'west';
            passMap.west.target = 'east';
            break;
    }

    // AI pass selection
    passMap.north.give = selectAIPassCards(northHand, 'north', passDirection);
    passMap.east.give = selectAIPassCards(eastHand, 'east', passDirection);
    passMap.west.give = selectAIPassCards(westHand, 'west', passDirection);

    // Simultaneous exchange: remove given cards, add received cards
    const receiveMap = {};
    for (let giver in passMap) {
        const target = passMap[giver].target;
        if (!receiveMap[target]) receiveMap[target] = [];
        receiveMap[target].push(...passMap[giver].give);
    }

    // Apply removals first (to avoid conflicts)
    for (let giver in passMap) {
        const hand = getPlayerHand(giver);
        passMap[giver].give.forEach(card => {
            const idx = hand.findIndex(c => c.suit === card.suit && c.rank === card.rank);
            if (idx !== -1) hand.splice(idx, 1);
        });
    }

    // Add received cards
    for (let receiver in receiveMap) {
        const hand = getPlayerHand(receiver);
        hand.push(...receiveMap[receiver]);
        hand.sort(sortCards);
    }

    // Clean up
    selectedPassCards = [];
    passPhase = false;
    passBtn.disabled = true;
    passBtn.textContent = getTranslation('GH.hearts.passCards', 'Pass Cards');
    startTrick();
}

function selectAIPassCards(hand, player, direction) {
    // Simple strategy: pass the three highest-value cards that are not hearts/queen if possible,
    // but always avoid passing the Queen of Spades if avoidable.
    const sorted = [...hand].sort((a,b) => getCardValue(b) - getCardValue(a));
    // Filter out the Queen of Spades if possible
    let candidates = sorted;
    const queenIndex = candidates.findIndex(c => c.suit === 'spades' && c.rank === 'Q');
    if (queenIndex !== -1 && candidates.length > 3) {
        // If we have more than 3 cards, we can avoid passing the queen
        candidates = candidates.filter((_, i) => i !== queenIndex);
    }
    // Also avoid passing hearts if we have enough other cards
    const hearts = candidates.filter(c => c.suit === 'hearts');
    if (hearts.length > 3 && candidates.length > 3) {
        // If we have many hearts, pass the highest hearts? Actually we want to pass high cards,
        // but passing hearts is dangerous. For simplicity, we'll still pass the highest non-hearts if available.
        const nonHearts = candidates.filter(c => c.suit !== 'hearts');
        if (nonHearts.length >= 3) {
            candidates = nonHearts;
        }
    }
    // Take top 3
    const toPass = candidates.slice(0, 3);
    return toPass;
}

// ======================== TRICK MANAGEMENT ========================
function startTrick() {
    console.log(`Starting trick ${currentTrick + 1}...`);
    if (!isGameActive) return;

    currentTrick++;
    currentTrickCards = { player: null, north: null, east: null, west: null };
    leadingSuit = null;

    updateUI();

    if (currentTrick === 1) {
        const starter = findTwoOfClubsHolder();
        currentTrickLeader = starter;
        isPlayerTurn = (starter === 'player');

        if (isPlayerTurn) {
            showTranslatableNotification('GH.hearts.youStart', 'info');
        } else {
            showTranslatableNotification('GH.hearts.opponentStarts', 'info');
            scheduleAIMove(currentTrickLeader, 800);
        }
    } else {
        if (currentTrickLeader) {
            isPlayerTurn = (currentTrickLeader === 'player');
            if (!isPlayerTurn) scheduleAIMove(currentTrickLeader, 800);
        } else {
            isPlayerTurn = true;
            currentTrickLeader = 'player';
        }
    }

    updateTurnIndicator();
    updatePlayerHand();
}

function findTwoOfClubsHolder() {
    if (playerHand.some(c => c.suit === 'clubs' && c.rank === '2')) return 'player';
    if (northHand.some(c => c.suit === 'clubs' && c.rank === '2')) return 'north';
    if (eastHand.some(c => c.suit === 'clubs' && c.rank === '2')) return 'east';
    if (westHand.some(c => c.suit === 'clubs' && c.rank === '2')) return 'west';
    return 'player'; // fallback
}

function playCard(card, player) {
    console.log(`${player} plays ${card.rank} of ${card.suit}`);
    if (!isGameActive) return;

    // Remove from hand
    const hand = getPlayerHand(player);
    const cardIndex = hand.findIndex(c => c.suit === card.suit && c.rank === card.rank);
    if (cardIndex !== -1) hand.splice(cardIndex, 1);
    else return;

    // Set leading suit if first card of trick
    if (leadingSuit === null) {
        leadingSuit = card.suit;
    }

    // Hearts are broken whenever a heart is played (not only when led)
    if (card.suit === 'hearts') {
        heartsBroken = true;
    }

    currentTrickCards[player] = card;
    updateTrickArea();
    updatePlayerHand();

    const isComplete = currentTrickCards.player && currentTrickCards.north && 
                       currentTrickCards.east && currentTrickCards.west;
    if (isComplete) {
        setTimeout(() => completeTrick(), 1500);
    } else {
        const nextPlayer = getNextPlayer(player);
        isPlayerTurn = (nextPlayer === 'player');
        if (!isPlayerTurn) {
            scheduleAIMove(nextPlayer, 800);
        }
        updateTurnIndicator();
        updatePlayerHand();
    }
}

function playAICard(player) {
    if (!isGameActive) return;

    const hand = getPlayerHand(player);
    if (!hand || hand.length === 0) {
        const next = getNextPlayer(player);
        isPlayerTurn = (next === 'player');
        if (!isPlayerTurn) scheduleAIMove(next, 800);
        updateTurnIndicator();
        return;
    }

    // Special case: first trick, player holds 2 of Clubs → must lead it
    if (currentTrick === 1 && leadingSuit === null) {
        const twoClubs = hand.find(c => c.suit === 'clubs' && c.rank === '2');
        if (twoClubs) {
            playCard(twoClubs, player);
            return;
        }
    }

    let playable = [...hand];
    if (leadingSuit !== null) {
        const following = hand.filter(c => c.suit === leadingSuit);
        if (following.length > 0) playable = following;
    } else {
        // Leading: avoid hearts if not broken, and avoid queen of spades if possible
        if (!heartsBroken) {
            const nonHearts = hand.filter(c => c.suit !== 'hearts');
            if (nonHearts.length > 0) playable = nonHearts;
        }
        // Avoid leading Queen of Spades unless forced
        const noQueen = playable.filter(c => !(c.suit === 'spades' && c.rank === 'Q'));
        if (noQueen.length > 0) playable = noQueen;
    }

    // Prefer safe cards (non-hearts, non-queen)
    const safe = playable.filter(c => !(c.suit === 'hearts' || (c.suit === 'spades' && c.rank === 'Q')));
    if (safe.length > 0) playable = safe;

    // Play lowest value card (to avoid taking tricks)
    playable.sort((a,b) => getCardValue(a) - getCardValue(b));
    const card = playable[0];
    if (card) playCard(card, player);
    else playCard(hand[0], player); // fallback
}

function completeTrick() {
    if (!isGameActive) return;

    const winner = determineTrickWinner();
    currentTrickLeader = winner;

    let trickPoints = 0;
    Object.values(currentTrickCards).forEach(card => {
        if (card && card.suit === 'hearts') trickPoints += 1;
        else if (card && card.suit === 'spades' && card.rank === 'Q') trickPoints += 13;
    });

    // Add to round points (not yet to total scores)
    roundPoints[winner] += trickPoints;

    if (trickPoints > 0) {
        const msg = trickPoints === 1 ? 
            getTranslation('GH.hearts.onePoint', '1 point') : 
            `${trickPoints} ${getTranslation('GH.hearts.points', 'points')}`;
        if (winner === 'player') {
            showNotification(`${getTranslation('GH.hearts.youTakeTrick', 'You take the trick')} (${msg})`, 'error');
        } else {
            showNotification(`${getTranslation('GH.hearts.opponentTakesTrick', 'Opponent takes the trick')} (${msg})`, 'info');
        }
    } else {
        if (winner === 'player') showTranslatableNotification('GH.hearts.youTakeTrickNoPoints', 'success');
        else showTranslatableNotification('GH.hearts.opponentTakesTrickNoPoints', 'info');
    }

    updateUI();

    const allHandsEmpty = playerHand.length === 0 && northHand.length === 0 && 
                          eastHand.length === 0 && westHand.length === 0;
    if (allHandsEmpty) {
        setTimeout(() => endRound(), 2000);
    } else {
        setTimeout(() => startTrick(), 2000);
    }
}

function determineTrickWinner() {
    const leadingCards = Object.entries(currentTrickCards)
        .filter(([_, card]) => card && card.suit === leadingSuit)
        .map(([player, card]) => ({ player, card }));
    if (leadingCards.length === 0) return 'player';
    leadingCards.sort((a,b) => getCardValue(b.card) - getCardValue(a.card));
    return leadingCards[0].player;
}

function getNextPlayer(currentPlayer) {
    const order = ['north', 'east', 'south', 'west'];
    const map = { player: 'south', north: 'north', east: 'east', west: 'west' };
    const pos = map[currentPlayer];
    const idx = order.indexOf(pos);
    const nextPos = order[(idx + 1) % 4];
    return nextPos === 'south' ? 'player' : nextPos;
}

// ======================== ROUND & GAME END ========================
function endRound() {
    if (!isGameActive) return;

    // Check for shooting the moon
    let moonShooter = null;
    for (let p of ['player', 'north', 'east', 'west']) {
        if (roundPoints[p] === 26) { // all hearts (13) + queen (13)
            moonShooter = p;
            break;
        }
    }

    let adjustedPoints = { ...roundPoints };
    if (moonShooter) {
        // Shooter gets 0, opponents each get 26
        for (let p of ['player', 'north', 'east', 'west']) {
            if (p === moonShooter) adjustedPoints[p] = 0;
            else adjustedPoints[p] = 13;
        }
        showNotification(getTranslation('GH.hearts.shootMoon', 'Shoot the Moon!'), 'success');
    }

    // Apply to global scores
    playerScore += adjustedPoints.player;
    northScore += adjustedPoints.north;
    eastScore += adjustedPoints.east;
    westScore += adjustedPoints.west;

    updateUI();

    // Check game end
    if (playerScore >= 100 || northScore >= 100 || eastScore >= 100 || westScore >= 100) {
        endGame();
        return;
    }

    currentRound++;
    startRound();
    showTranslatableNotification('GH.hearts.newRound', 'info');
}

function endGame() {
    isGameActive = false;
    clearAllAITimeouts();

    const scores = [
        { player: 'player', score: playerScore },
        { player: 'north', score: northScore },
        { player: 'east', score: eastScore },
        { player: 'west', score: westScore }
    ];
    scores.sort((a,b) => a.score - b.score);
    const winner = scores[0];

    finalPlayerScoreElement.textContent = playerScore;
    finalNorthScoreElement.textContent = northScore;
    finalEastScoreElement.textContent = eastScore;
    finalWestScoreElement.textContent = westScore;

    if (winner.player === 'player') {
        gameResultTitle.textContent = getTranslation('GH.hearts.youWin', 'You Win!');
    } else {
        gameResultTitle.textContent = getTranslation('GH.hearts.youLose', 'Game Over');
    }

    setTimeout(() => gameOverModal.classList.add('active'), 1000);
    startBtn.disabled = false;
    passBtn.disabled = true;

    const msg = winner.player === 'player' ? 
        getTranslation('GH.hearts.congratulations', 'Congratulations! You won with the lowest score.') :
        getTranslation('GH.hearts.betterLuck', 'Better luck next time!');
    showNotification(msg, 'info');
}

function restartGame() {
    clearAllAITimeouts();
    if (isGameActive) showTranslatableNotification('GH.hearts.restartConfirm', 'warning');
    startGame();
}

function playAgain() {
    gameOverModal.classList.remove('active');
    startGame();
}

function goToMainMenu() {
    clearAllAITimeouts();
    gameOverModal.classList.remove('active');
    window.location.href = 'index.html';
}

// ======================== UTILITIES ========================
function createDeck() {
    const deck = [];
    suits.forEach(suit => {
        ranks.forEach(rank => {
            deck.push({ suit, rank, value: getCardValue({ suit, rank }) });
        });
    });
    return deck;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function getCardValue(card) {
    const values = { '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'J':11, 'Q':12, 'K':13, 'A':14 };
    return values[card.rank];
}

function sortCards(a, b) {
    const suitOrder = { clubs:0, diamonds:1, spades:2, hearts:3 };
    if (suitOrder[a.suit] !== suitOrder[b.suit]) return suitOrder[a.suit] - suitOrder[b.suit];
    return getCardValue(a) - getCardValue(b);
}

function getPlayerHand(player) {
    switch(player) {
        case 'player': return playerHand;
        case 'north': return northHand;
        case 'east': return eastHand;
        case 'west': return westHand;
        default: return null;
    }
}

// ======================== UI UPDATES ========================
function updateUI() {
    roundElement.textContent = currentRound;
    trickElement.textContent = currentTrick;
    playerScoreElement.textContent = playerScore;
    playerScoreDisplay.textContent = playerScore;
    northScoreElement.textContent = northScore;
    eastScoreElement.textContent = eastScore;
    westScoreElement.textContent = westScore;
}

function updatePlayerHand() {
    playerHandElement.innerHTML = '';
    playerHand.forEach((card, idx) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = `GH-card ${card.suit}`;
        if (card.suit === 'spades' && card.rank === 'Q') cardDiv.classList.add('queen');

        let isPlayable = false;
        if (isPlayerTurn && isGameActive && !passPhase) {
            // First trick: must lead 2 of Clubs if holder
            if (currentTrick === 1 && leadingSuit === null && currentTrickLeader === 'player') {
                const hasTwoClubs = playerHand.some(c => c.suit === 'clubs' && c.rank === '2');
                if (hasTwoClubs) {
                    isPlayable = (card.suit === 'clubs' && card.rank === '2');
                } else {
                    // Normal leading rules (no hearts if not broken, etc.)
                    if (leadingSuit === null) {
                        if (!heartsBroken) {
                            const hasNonHearts = playerHand.some(c => c.suit !== 'hearts');
                            isPlayable = (card.suit !== 'hearts') || !hasNonHearts;
                        } else {
                            isPlayable = true;
                        }
                    }
                }
            } else {
                // Normal playable logic
                if (leadingSuit !== null) {
                    const hasLeading = playerHand.some(c => c.suit === leadingSuit);
                    isPlayable = hasLeading ? (card.suit === leadingSuit) : true;
                } else {
                    if (!heartsBroken) {
                        const hasNonHearts = playerHand.some(c => c.suit !== 'hearts');
                        isPlayable = (card.suit !== 'hearts') || !hasNonHearts;
                    } else {
                        isPlayable = true;
                    }
                }
            }
        }

        if (!isPlayable) cardDiv.classList.add('disabled');

        cardDiv.innerHTML = `
            <div class="GH-card-top"><span>${card.rank}</span><span>${getSuitSymbol(card.suit)}</span></div>
            <div class="GH-card-center">${getSuitSymbol(card.suit)}</div>
            <div class="GH-card-bottom"><span>${card.rank}</span><span>${getSuitSymbol(card.suit)}</span></div>
        `;

        // Pass phase selection handling
        if (passPhase && isGameActive && !passConfirmed) {
            cardDiv.classList.add('selectable');
            const isSelected = selectedPassCards.some(c => c.suit === card.suit && c.rank === card.rank);
            if (isSelected) cardDiv.classList.add('selected');
            cardDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                if (passPhase && !passConfirmed) {
                    togglePassCard(card);
                }
            });
        } else if (isPlayable) {
            cardDiv.addEventListener('click', () => {
                if (isPlayerTurn && isGameActive && !passPhase) playCard(card, 'player');
            });
        }

        playerHandElement.appendChild(cardDiv);
    });
}

function togglePassCard(card) {
    const index = selectedPassCards.findIndex(c => c.suit === card.suit && c.rank === card.rank);
    if (index !== -1) {
        selectedPassCards.splice(index, 1);
    } else {
        if (selectedPassCards.length < 3) {
            selectedPassCards.push(card);
        } else {
            showNotification(getTranslation('GH.hearts.selectThree', 'Please select exactly 3 cards to pass.'), 'warning');
        }
    }
    updatePlayerHand(); // refresh selection highlights
}

function updateTrickArea() {
    topSlot.innerHTML = ''; leftSlot.innerHTML = ''; rightSlot.innerHTML = ''; playerSlot.innerHTML = '';
    if (currentTrickCards.north) topSlot.appendChild(createCardElement(currentTrickCards.north));
    if (currentTrickCards.west) leftSlot.appendChild(createCardElement(currentTrickCards.west));
    if (currentTrickCards.east) rightSlot.appendChild(createCardElement(currentTrickCards.east));
    if (currentTrickCards.player) playerSlot.appendChild(createCardElement(currentTrickCards.player));
}

function createCardElement(card) {
    const div = document.createElement('div');
    div.className = `GH-card ${card.suit}`;
    if (card.suit === 'spades' && card.rank === 'Q') div.classList.add('queen');
    div.innerHTML = `
        <div class="GH-card-top"><span>${card.rank}</span><span>${getSuitSymbol(card.suit)}</span></div>
        <div class="GH-card-center">${getSuitSymbol(card.suit)}</div>
        <div class="GH-card-bottom"><span>${card.rank}</span><span>${getSuitSymbol(card.suit)}</span></div>
    `;
    div.classList.add('played');
    return div;
}

function getSuitSymbol(suit) {
    switch(suit) {
        case 'hearts': return '♥';
        case 'diamonds': return '♦';
        case 'clubs': return '♣';
        case 'spades': return '♠';
        default: return '';
    }
}

function updateTurnIndicator() {
    if (passPhase) {
        turnIndicator.textContent = getTranslation('GH.hearts.passPhase', 'Pass Phase');
    } else if (isPlayerTurn) {
        turnIndicator.textContent = getTranslation('GH.hearts.yourTurn', 'Your Turn');
    } else {
        turnIndicator.textContent = getTranslation('GH.hearts.opponentTurn', "Opponent's Turn");
    }
}

// ======================== AI TIMEOUT MANAGEMENT ========================
function scheduleAIMove(player, delay) {
    const id = setTimeout(() => {
        if (isGameActive) playAICard(player);
        const idx = aiTimeoutIds.indexOf(id);
        if (idx !== -1) aiTimeoutIds.splice(idx, 1);
    }, delay);
    aiTimeoutIds.push(id);
}

function clearAllAITimeouts() {
    aiTimeoutIds.forEach(clearTimeout);
    aiTimeoutIds = [];
}

// ======================== NOTIFICATIONS & TRANSLATIONS ========================
function showTranslatableNotification(key, type) {
    const translations = window.getTranslations ? window.getTranslations() : {};
    const cleanKey = key.replace(/^GH\./, '');
    const parts = cleanKey.split('.');
    let msg = parts.reduce((obj, k) => obj && obj[k] !== undefined ? obj[k] : undefined, translations);
    if (!msg || typeof msg !== 'string') msg = getFallbackGameMessage(cleanKey);
    showNotification(msg, type);
}

function getFallbackGameMessage(key) {
    const fallbacks = {
        'hearts.gameStarted': 'Game started! Good luck!',
        'hearts.passPhase': 'Select 3 cards to pass',
        'hearts.youStart': 'You start the first trick with the 2 of Clubs',
        'hearts.opponentStarts': 'Opponent starts the first trick',
        'hearts.youTakeTrick': 'You take the trick',
        'hearts.opponentTakesTrick': 'Opponent takes the trick',
        'hearts.youTakeTrickNoPoints': 'You take the trick (no points)',
        'hearts.opponentTakesTrickNoPoints': 'Opponent takes the trick (no points)',
        'hearts.newRound': 'Starting new round',
        'hearts.youWin': 'You Win!',
        'hearts.youLose': 'Game Over',
        'hearts.congratulations': 'Congratulations! You won with the lowest score.',
        'hearts.betterLuck': 'Better luck next time!',
        'hearts.restartConfirm': 'Are you sure you want to restart? Your progress will be lost.',
        'hearts.selectThree': 'Please select exactly 3 cards to pass.',
        'hearts.shootMoon': 'Shoot the Moon!'
    };
    return fallbacks[key] || key;
}

function showNotification(message, type) {
    gameNotification.textContent = message;
    gameNotification.className = `GH-game-notification ${type}`;
    gameNotification.style.display = 'block';
    gameNotification.classList.add('show');
    setTimeout(() => {
        gameNotification.classList.remove('show');
        setTimeout(() => gameNotification.style.display = 'none', 300);
    }, 3000);
}

function getTranslation(key, fallback) {
    const translations = window.getTranslations ? window.getTranslations() : {};
    const cleanKey = key.replace(/^GH\./, '');
    const parts = cleanKey.split('.');
    let val = parts.reduce((obj, k) => obj && obj[k] !== undefined ? obj[k] : undefined, translations);
    return (val && typeof val === 'string') ? val : fallback;
}

// ======================== DEBUG (optional) ========================
function debugGameState() {
    console.log('Game State:', {
        isGameActive, currentRound, currentTrick, isPlayerTurn, leadingSuit, heartsBroken,
        playerHand: playerHand.length, northHand: northHand.length, eastHand: eastHand.length, westHand: westHand.length,
        currentTrickCards, currentTrickLeader, roundPoints
    });
}

console.log('Hearts game logic loaded successfully');