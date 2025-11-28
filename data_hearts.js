// Hearts Card Game Logic
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
let passDirection = 'left'; // 'left', 'right', or 'across'
let passPhase = false;
let currentTrickLeader = null;
let aiTimeoutIds = []; // Track AI timeouts to prevent overlaps

// Card deck
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Game functions
function startGame() {
    console.log('Starting new Hearts game...');
    // Clear any existing AI timeouts
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
    
    // Start a new round
    startRound();
    
    showTranslatableNotification('GH.hearts.gameStarted', 'info');
    console.log('Game started successfully');
}

function startRound() {
    console.log(`Starting round ${currentRound}...`);
    // Clear any existing AI timeouts
    clearAllAITimeouts();
    
    // Reset trick
    currentTrick = 0;
    currentTrickCards = { player: null, north: null, east: null, west: null };
    leadingSuit = null;
    currentTrickLeader = null;
    
    // Create and shuffle deck
    const deck = createDeck();
    console.log('Deck created with', deck.length, 'cards');
    shuffleDeck(deck);
    console.log('Deck shuffled');
    
    // Deal cards
    playerHand = deck.slice(0, 13);
    northHand = deck.slice(13, 26);
    eastHand = deck.slice(26, 39);
    westHand = deck.slice(39, 52);
    console.log('Cards dealt to players');
    
    // Sort hands
    playerHand.sort(sortCards);
    northHand.sort(sortCards);
    eastHand.sort(sortCards);
    westHand.sort(sortCards);
    
    // Determine pass direction
    passDirection = getPassDirection();
    passPhase = true;
    
    // Update UI
    updatePlayerHand();
    updateTrickArea();
    updateTurnIndicator();
    
    // Start pass phase
    if (passDirection !== 'hold') {
        console.log(`Pass phase: ${passDirection}`);
        showTranslatableNotification('GH.hearts.passPhase', 'info');
        passBtn.disabled = false;
    } else {
        // No passing this round, start the game
        console.log('No passing this round (hold)');
        passPhase = false;
        startTrick();
    }
}

function getPassDirection() {
    // In Hearts, players pass cards every round except every 4th round
    const directions = ['left', 'right', 'across', 'hold'];
    return directions[(currentRound - 1) % 4];
}

function completePass() {
    console.log('Completing card pass...');
    if (!passPhase || !isGameActive) return;
    
    // For simplicity, we'll auto-select cards to pass
    const cardsToPass = selectCardsToPass();
    console.log('Selected cards to pass:', cardsToPass);
    
    // Remove from player's hand
    cardsToPass.forEach(card => {
        const index = playerHand.findIndex(c => c.suit === card.suit && c.rank === card.rank);
        if (index !== -1) {
            playerHand.splice(index, 1);
        }
    });
    
    // Add received cards (for simplicity, we'll just generate random ones)
    const receivedCards = selectCardsToReceive();
    playerHand = playerHand.concat(receivedCards);
    playerHand.sort(sortCards);
    
    passPhase = false;
    passBtn.disabled = true;
    
    // Start the first trick
    startTrick();
}

function selectCardsToPass() {
    // Simple strategy: pass high cards, especially spades and hearts
    return playerHand
        .sort((a, b) => getCardValue(b) - getCardValue(a))
        .slice(0, 3);
}

function selectCardsToReceive() {
    // For simplicity, we'll just generate random low cards
    const lowCards = [];
    const lowRanks = ['2', '3', '4', '5', '6'];
    const suits = ['clubs', 'diamonds'];
    
    for (let i = 0; i < 3; i++) {
        const suit = suits[Math.floor(Math.random() * suits.length)];
        const rank = lowRanks[Math.floor(Math.random() * lowRanks.length)];
        lowCards.push({ suit, rank, value: getCardValue({ suit, rank }) });
    }
    
    return lowCards;
}

function startTrick() {
    console.log(`Starting trick ${currentTrick}...`);
    if (!isGameActive) return;
    
    currentTrick++;
    currentTrickCards = { player: null, north: null, east: null, west: null };
    leadingSuit = null;
    
    updateUI();

    // Find who has the 2 of Clubs to start the first trick
    if (currentTrick === 1) {
        const starter = findTwoOfClubsHolder();
        console.log(`First trick starter: ${starter}`);
        isPlayerTurn = (starter === 'player');
        currentTrickLeader = starter;

        console.log(`isPlayerTurn set to: ${isPlayerTurn} for first trick`);
        
        if (isPlayerTurn) {
            showTranslatableNotification('GH.hearts.youStart', 'info');
        } else {
            showTranslatableNotification('GH.hearts.opponentStarts', 'info');
            // AI plays first card with timeout protection
            scheduleAIMove(currentTrickLeader, 800);
        }
    } else {
        // The winner of the previous trick starts
        if (currentTrickLeader) {
            isPlayerTurn = (currentTrickLeader === 'player');
            console.log(`Trick ${currentTrick} leader: ${currentTrickLeader}, isPlayerTurn: ${isPlayerTurn}`);
            
            if (!isPlayerTurn) {
                // AI plays first card with timeout protection
                scheduleAIMove(currentTrickLeader, 800);
            }
        } else {
            // Fallback: player starts if no leader found
            console.warn('No trick leader found, defaulting to player');
            isPlayerTurn = true;
            currentTrickLeader = 'player';
        }
    }
    
    updateTurnIndicator();
    updatePlayerHand();
}

function findTwoOfClubsHolder() {
    // Check who has the 2 of Clubs
    if (playerHand.some(card => card.suit === 'clubs' && card.rank === '2')) {
        return 'player';
    }
    if (northHand.some(card => card.suit === 'clubs' && card.rank === '2')) {
        return 'north';
    }
    if (eastHand.some(card => card.suit === 'clubs' && card.rank === '2')) {
        return 'east';
    }
    if (westHand.some(card => card.suit === 'clubs' && card.rank === '2')) {
        return 'west';
    }
    
    // Fallback: player starts
    return 'player';
}

function playCard(card, player) {
    console.log(`${player} plays ${card.rank} of ${card.suit}`);
    if (!isGameActive) return;

    // Remove card from player's hand
    let hand;
    switch(player) {
        case 'player': hand = playerHand; break;
        case 'north': hand = northHand; break;
        case 'east': hand = eastHand; break;
        case 'west': hand = westHand; break;
        default: 
            console.error('Invalid player in playCard:', player);
            return;
    }

    const cardIndex = hand.findIndex(c => c.suit === card.suit && c.rank === card.rank);
    if (cardIndex !== -1) {
        hand.splice(cardIndex, 1);
    } else {
        console.error('Card not found in player hand:', card, player);
        return;
    }

    // Set leading suit if this is the first card of the trick
    if (leadingSuit === null) {
        leadingSuit = card.suit;
        console.log(`Leading suit set to: ${leadingSuit}`);
        // If a heart is led, hearts are now broken
        if (card.suit === 'hearts') {
            heartsBroken = true;
            console.log('Hearts have been broken!');
        }
    }

    // Add card to trick
    currentTrickCards[player] = card;

    // Update UI
    updateTrickArea();
    updatePlayerHand();

    // Check if trick is complete
    const isTrickComplete = currentTrickCards.player && currentTrickCards.north && 
                           currentTrickCards.east && currentTrickCards.west;
    
    if (isTrickComplete) {
        console.log('Trick complete, determining winner...');
        // Trick is complete, determine winner
        setTimeout(() => {
            completeTrick();
        }, 1500);
    } else {
        // Continue with next player
        const nextPlayer = getNextPlayer(player);
        console.log(`Next player: ${nextPlayer}, Current player: ${player}`);
        
        // Safety check - ensure next player has cards
        const nextPlayerHand = getPlayerHand(nextPlayer);
        if (!nextPlayerHand || nextPlayerHand.length === 0) {
            console.error(`Next player ${nextPlayer} has no cards!`);
            // Force trick completion
            setTimeout(() => {
                completeTrick();
            }, 1000);
            return;
        }

        isPlayerTurn = (nextPlayer === 'player');
        console.log(`isPlayerTurn set to: ${isPlayerTurn}`);
        
        if (!isPlayerTurn) {
            // AI plays next card with a small delay
            console.log(`Scheduling AI move for ${nextPlayer}`);
            setTimeout(() => {
                if (isGameActive) {
                    playAICard(nextPlayer);
                }
            }, 800);
        } else {
            console.log("Player's turn - waiting for user input");
        }
        
        updateTurnIndicator();
        updatePlayerHand(); // Ensure player hand is updated with correct playable state
    }
}

// Helper function to get player hand
function getPlayerHand(player) {
    switch(player) {
        case 'player': return playerHand;
        case 'north': return northHand;
        case 'east': return eastHand;
        case 'west': return westHand;
        default: return null;
    }
}

function playAICard(player) {
    console.log(`AI ${player} making move...`);
    if (!isGameActive) {
        console.log('Game not active, skipping AI move');
        return;
    }

    const hand = getPlayerHand(player);
    if (!hand || hand.length === 0) {
        console.error(`AI ${player} has no cards to play!`);
        // Move to next player
        const nextPlayer = getNextPlayer(player);
        isPlayerTurn = (nextPlayer === 'player');
        if (!isPlayerTurn) {
            setTimeout(() => playAICard(nextPlayer), 800);
        }
        updateTurnIndicator();
        return;
    }

    // Rest of your existing AI logic...
    let playableCards = [...hand];
    
    // If not leading, must follow suit if possible
    if (leadingSuit !== null) {
        const followingSuitCards = hand.filter(card => card.suit === leadingSuit);
        if (followingSuitCards.length > 0) {
            playableCards = followingSuitCards;
        }
    } else {
        // Leading: avoid hearts if possible until broken
        if (!heartsBroken) {
            const nonHearts = hand.filter(card => card.suit !== 'hearts');
            if (nonHearts.length > 0) {
                playableCards = nonHearts;
            }
        }
    }
    
    // Safety check - ensure we have playable cards
    if (playableCards.length === 0) {
        console.warn('No playable cards found for AI, using original hand');
        playableCards = [...hand];
    }
    
    // Avoid taking points if possible
    const safeCards = playableCards.filter(card => 
        !(card.suit === 'hearts' || (card.suit === 'spades' && card.rank === 'Q'))
    );
    
    if (safeCards.length > 0) {
        playableCards = safeCards;
    }
    
    // Play the lowest value card
    playableCards.sort((a, b) => getCardValue(a) - getCardValue(b));
    const cardToPlay = playableCards[0];
    
    if (cardToPlay) {
        playCard(cardToPlay, player);
    } else {
        console.error('No card to play for AI player:', player);
        // Emergency fallback - play first card
        if (hand.length > 0) {
            playCard(hand[0], player);
        }
    }
}

function completeTrick() {
    console.log('Completing trick...');
    if (!isGameActive) return;
    
    // Determine winner of the trick
    const trickWinner = determineTrickWinner();
    currentTrickLeader = trickWinner;
    console.log(`Trick winner: ${trickWinner}`);
    
    // Calculate points in this trick
    let trickPoints = 0;
    Object.values(currentTrickCards).forEach(card => {
        if (card && card.suit === 'hearts') {
            trickPoints += 1;
        } else if (card && card.suit === 'spades' && card.rank === 'Q') {
            trickPoints += 13;
        }
    });
    
    console.log(`Points in this trick: ${trickPoints}`);
    
    // Add points to the winner
    switch(trickWinner) {
        case 'player': playerScore += trickPoints; break;
        case 'north': northScore += trickPoints; break;
        case 'east': eastScore += trickPoints; break;
        case 'west': westScore += trickPoints; break;
    }
    
    // Show notification about trick winner and points
    if (trickPoints > 0) {
        const pointsMsg = trickPoints === 1 ? 
            getTranslation('GH.hearts.onePoint', '1 point') : 
            `${trickPoints} ${getTranslation('GH.hearts.points', 'points')}`;
        
        if (trickWinner === 'player') {
            showNotification(`${getTranslation('GH.hearts.youTakeTrick', 'You take the trick')} (${pointsMsg})`, 'error');
        } else {
            showNotification(`${getTranslation('GH.hearts.opponentTakesTrick', 'Opponent takes the trick')} (${pointsMsg})`, 'info');
        }
    } else {
        if (trickWinner === 'player') {
            showTranslatableNotification('GH.hearts.youTakeTrickNoPoints', 'success');
        } else {
            showTranslatableNotification('GH.hearts.opponentTakesTrickNoPoints', 'info');
        }
    }
    
    updateUI();
    
    // Check if round is over (all hands should be empty)
    const handsEmpty = playerHand.length === 0 && northHand.length === 0 && 
                      eastHand.length === 0 && westHand.length === 0;
    
    if (handsEmpty) {
        console.log('Round over, all hands empty');
        // Round is over
        setTimeout(() => {
            endRound();
        }, 2000);
    } else {
        // Start next trick with protection
        setTimeout(() => {
            if (isGameActive) {
                startTrick();
            }
        }, 2000);
    }
}

function determineTrickWinner() {
    // The winner is the player who played the highest card of the leading suit
    const leadingSuitCards = Object.entries(currentTrickCards)
        .filter(([player, card]) => card && card.suit === leadingSuit)
        .map(([player, card]) => ({ player, card }));
    
    if (leadingSuitCards.length === 0) {
        console.error('No leading suit cards found in trick');
        return 'player'; // Fallback
    }
    
    leadingSuitCards.sort((a, b) => getCardValue(b.card) - getCardValue(a.card));
    
    return leadingSuitCards[0].player;
}

function getNextPlayer(currentPlayer) {
    const players = ['north', 'east', 'south', 'west'];
    // Map our player positions to the standard rotation
    const positionMap = {
        'player': 'south',
        'north': 'north', 
        'east': 'east',
        'west': 'west'
    };
    
    const currentPos = positionMap[currentPlayer];
    const playerOrder = ['north', 'east', 'south', 'west'];
    const currentIndex = playerOrder.indexOf(currentPos);
    const nextIndex = (currentIndex + 1) % 4;
    const nextPos = playerOrder[nextIndex];
    
    // Map back to our internal representation
    return nextPos === 'south' ? 'player' : nextPos;
}

// Add a function to validate game state
function validateGameState() {
    console.log('Validating game state...');
    console.log('Player hands:', {
        player: playerHand.length,
        north: northHand.length,
        east: eastHand.length,
        west: westHand.length
    });
    console.log('Current trick:', currentTrickCards);
    console.log('Leading suit:', leadingSuit);
    console.log('Is player turn:', isPlayerTurn);
}

function endRound() {
    console.log('Ending round...');
    if (!isGameActive) return;
    
    // Check if any player has reached 100 points
    if (playerScore >= 100 || northScore >= 100 || eastScore >= 100 || westScore >= 100) {
        console.log('Game ending condition met (100+ points)');
        endGame();
        return;
    }
    
    // Start next round
    currentRound++;
    startRound();
    
    showTranslatableNotification('GH.hearts.newRound', 'info');
}

function endGame() {
    console.log('Ending game...');
    isGameActive = false;
    clearAllAITimeouts();
    
    // Determine winner (lowest score)
    const scores = [
        { player: 'player', score: playerScore },
        { player: 'north', score: northScore },
        { player: 'east', score: eastScore },
        { player: 'west', score: westScore }
    ];
    
    scores.sort((a, b) => a.score - b.score);
    const winner = scores[0];
    
    console.log(`Game winner: ${winner.player} with score ${winner.score}`);
    
    // Update modal with final stats
    finalPlayerScoreElement.textContent = playerScore;
    finalNorthScoreElement.textContent = northScore;
    finalEastScoreElement.textContent = eastScore;
    finalWestScoreElement.textContent = westScore;
    
    // Set game result title
    if (winner.player === 'player') {
        gameResultTitle.textContent = getTranslation('GH.hearts.youWin', 'You Win!');
    } else {
        gameResultTitle.textContent = getTranslation('GH.hearts.youLose', 'Game Over');
    }
    
    // Show game over modal
    setTimeout(() => {
        gameOverModal.classList.add('active');
    }, 1000);
    
    // Reset buttons
    startBtn.disabled = false;
    passBtn.disabled = true;
    
    const gameOverMessage = winner.player === 'player' ? 
        getTranslation('GH.hearts.congratulations', 'Congratulations! You won with the lowest score.') :
        getTranslation('GH.hearts.betterLuck', 'Better luck next time!');
    showNotification(gameOverMessage, 'info');
}

function restartGame() {
    console.log('Restarting game...');
    clearAllAITimeouts();
    
    if (isGameActive) {
        showTranslatableNotification('GH.hearts.restartConfirm', 'warning');
        startGame();
    } else {
        startGame();
    }
}

function playAgain() {
    console.log('Playing again...');
    gameOverModal.classList.remove('active');
    startGame();
}

function goToMainMenu() {
    console.log('Returning to main menu...');
    clearAllAITimeouts();
    gameOverModal.classList.remove('active');
    window.location.href = 'index.html';
}

// Utility functions
function createDeck() {
    console.log('Creating deck...');
    const deck = [];
    suits.forEach(suit => {
        ranks.forEach(rank => {
            deck.push({
                suit,
                rank,
                value: getCardValue({ suit, rank })
            });
        });
    });
    return deck;
}

function shuffleDeck(deck) {
    console.log('Shuffling deck...');
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function getCardValue(card) {
    // Assign values for card comparison
    const rankValues = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
        '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };
    return rankValues[card.rank];
}

function sortCards(a, b) {
    // Sort by suit first, then by rank
    const suitOrder = { 'clubs': 0, 'diamonds': 1, 'spades': 2, 'hearts': 3 };
    
    if (suitOrder[a.suit] !== suitOrder[b.suit]) {
        return suitOrder[a.suit] - suitOrder[b.suit];
    }
    
    return getCardValue(a) - getCardValue(b);
}

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
    
    playerHand.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = `GH-card ${card.suit}`;
        if (card.suit === 'spades' && card.rank === 'Q') {
            cardElement.classList.add('queen');
        }
        
        // Check if card is playable - IMPROVED VERSION
        let isPlayable = false;
        
        if (isPlayerTurn && isGameActive && !passPhase) {
            if (leadingSuit !== null) {
                // Must follow suit if possible
                const hasLeadingSuit = playerHand.some(c => c.suit === leadingSuit);
                if (hasLeadingSuit) {
                    // Must play the leading suit
                    isPlayable = (card.suit === leadingSuit);
                } else {
                    // Can play any card if don't have leading suit
                    isPlayable = true;
                }
            } else {
                // Leading the trick
                if (!heartsBroken) {
                    // Hearts not broken yet - can't lead with hearts unless no other choice
                    const hasNonHearts = playerHand.some(c => c.suit !== 'hearts');
                    isPlayable = (card.suit !== 'hearts') || !hasNonHearts;
                } else {
                    // Hearts broken or no other cards - can play anything
                    isPlayable = true;
                }
            }
            
            // Additional safety: if no valid moves found with above logic, allow any card
            const playableCards = playerHand.filter(c => {
                if (leadingSuit !== null) {
                    const hasLeadingSuit = playerHand.some(card => card.suit === leadingSuit);
                    return hasLeadingSuit ? (c.suit === leadingSuit) : true;
                } else {
                    if (!heartsBroken) {
                        const hasNonHearts = playerHand.some(card => card.suit !== 'hearts');
                        return hasNonHearts ? (c.suit !== 'hearts') : true;
                    }
                    return true;
                }
            });
            
            if (playableCards.length === 0) {
                isPlayable = true; // Emergency fallback
            }
        }
        
        if (!isPlayable) {
            cardElement.classList.add('disabled');
        } else {
            cardElement.classList.remove('disabled');
        }
        
        cardElement.innerHTML = `
            <div class="GH-card-top">
                <span>${card.rank}</span>
                <span>${getSuitSymbol(card.suit)}</span>
            </div>
            <div class="GH-card-center">${getSuitSymbol(card.suit)}</div>
            <div class="GH-card-bottom">
                <span>${card.rank}</span>
                <span>${getSuitSymbol(card.suit)}</span>
            </div>
        `;
        
        if (isPlayable) {
            cardElement.addEventListener('click', () => {
                if (isPlayerTurn && isGameActive && !passPhase) {
                    console.log(`Player playing card: ${card.rank} of ${card.suit}`);
                    playCard(card, 'player');
                }
            });
        }
        
        playerHandElement.appendChild(cardElement);
    });
}

function updateTrickArea() {
    // Clear all slots
    topSlot.innerHTML = '';
    leftSlot.innerHTML = '';
    rightSlot.innerHTML = '';
    playerSlot.innerHTML = '';
    
    // Add cards to slots
    if (currentTrickCards.north) {
        const cardElement = createCardElement(currentTrickCards.north);
        cardElement.classList.add('played');
        topSlot.appendChild(cardElement);
    }
    
    if (currentTrickCards.west) {
        const cardElement = createCardElement(currentTrickCards.west);
        cardElement.classList.add('played');
        leftSlot.appendChild(cardElement);
    }
    
    if (currentTrickCards.east) {
        const cardElement = createCardElement(currentTrickCards.east);
        cardElement.classList.add('played');
        rightSlot.appendChild(cardElement);
    }
    
    if (currentTrickCards.player) {
        const cardElement = createCardElement(currentTrickCards.player);
        cardElement.classList.add('played');
        playerSlot.appendChild(cardElement);
    }
}

function createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.className = `GH-card ${card.suit}`;
    if (card.suit === 'spades' && card.rank === 'Q') {
        cardElement.classList.add('queen');
    }
    
    cardElement.innerHTML = `
        <div class="GH-card-top">
            <span>${card.rank}</span>
            <span>${getSuitSymbol(card.suit)}</span>
        </div>
        <div class="GH-card-center">${getSuitSymbol(card.suit)}</div>
        <div class="GH-card-bottom">
            <span>${card.rank}</span>
            <span>${getSuitSymbol(card.suit)}</span>
        </div>
    `;
    
    return cardElement;
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

// AI timeout management to prevent overlapping moves
function scheduleAIMove(player, delay) {
    console.log(`Scheduling AI move for ${player} in ${delay}ms`);
    const timeoutId = setTimeout(() => {
        if (isGameActive) {
            playAICard(player);
        }
        // Remove this timeout ID from the tracking array
        const index = aiTimeoutIds.indexOf(timeoutId);
        if (index > -1) {
            aiTimeoutIds.splice(index, 1);
        }
    }, delay);
    
    aiTimeoutIds.push(timeoutId);
}

function clearAllAITimeouts() {
    console.log('Clearing all AI timeouts...');
    aiTimeoutIds.forEach(timeoutId => {
        clearTimeout(timeoutId);
    });
    aiTimeoutIds = [];
}

// Enhanced notification function that supports translation keys
function showTranslatableNotification(messageKey, type) {
    console.log(`Showing notification: ${messageKey}`);
    const translations = window.getTranslations ? window.getTranslations() : {};
    
    // Remove 'GH.' prefix if present and split the key
    const cleanKey = messageKey.replace(/^GH\./, '');
    const keys = cleanKey.split('.');
    
    let message = keys.reduce((obj, key) => {
        return obj && obj[key] !== undefined ? obj[key] : undefined;
    }, translations);
    
    // Fallback if translation not found
    if (!message || typeof message !== 'string') {
        console.warn(`Translation not found for key: ${messageKey}`);
        message = getFallbackGameMessage(cleanKey);
    }
    
    showNotification(message, type);
}

function getFallbackGameMessage(key) {
    const fallbackMessages = {
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
        'hearts.restartConfirm': 'Are you sure you want to restart? Your progress will be lost.'
    };
    
    return fallbackMessages[key] || key;
}

function showNotification(message, type) {
    gameNotification.textContent = message;
    gameNotification.className = `GH-game-notification ${type}`;
    gameNotification.style.display = 'block';
    gameNotification.classList.add('show');
    
    setTimeout(() => {
        gameNotification.classList.remove('show');
        setTimeout(() => {
            gameNotification.style.display = 'none';
        }, 300);
    }, 3000);
}

// Helper function to get translations
function getTranslation(key, fallback) {
    const translations = window.getTranslations ? window.getTranslations() : {};
    
    // Remove 'GH.' prefix if present and split the key
    const cleanKey = key.replace(/^GH\./, '');
    const keys = cleanKey.split('.');
    
    let value = keys.reduce((obj, k) => {
        return obj && obj[k] !== undefined ? obj[k] : undefined;
    }, translations);
    
    return value && typeof value === 'string' ? value : fallback;
}

// Helper function to debug game state:
function debugGameState() {
    console.log('Game State:', {
        isGameActive,
        currentRound,
        currentTrick,
        isPlayerTurn,
        leadingSuit,
        heartsBroken,
        playerHand: playerHand.length,
        northHand: northHand.length,
        eastHand: eastHand.length,
        westHand: westHand.length,
        currentTrickCards,
        currentTrickLeader
    });
}
// Add this function to debug the current game state
function debugCurrentState() {
    console.log('=== CURRENT GAME STATE ===');
    console.log('isGameActive:', isGameActive);
    console.log('isPlayerTurn:', isPlayerTurn);
    console.log('passPhase:', passPhase);
    console.log('leadingSuit:', leadingSuit);
    console.log('heartsBroken:', heartsBroken);
    console.log('currentTrick:', currentTrick);
    console.log('currentTrickLeader:', currentTrickLeader);
    console.log('Player hand size:', playerHand.length);
    console.log('Current trick cards:', currentTrickCards);
    console.log('==========================');
}

console.log('Hearts game logic loaded successfully');