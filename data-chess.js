// Chess game logic - moved to external file
console.log('Loading chess game logic...');

// Game state variables
let gameInterval;
let gameTime = 0;
let gameScore = 0;
let gameLevel = 1;
let isGameActive = false;
let isGamePaused = false;
let gameDifficulty = 'easy';
let currentPlayer = 'white';
let selectedPiece = null;
let possibleMoves = [];
let moveHistory = [];
let totalMoves = 0;
let whiteTime = 600; // 10 minutes in seconds
let blackTime = 600; // 10 minutes in seconds
let playerTimer;

// Store previous game states for undo functionality
let previousGameStates = [];
let maxUndoSteps = 10;

// Track check status
let isWhiteInCheck = false;
let isBlackInCheck = false;

// Chess pieces Unicode
const pieces = {
    white: {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙'
    },
    black: {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟'
    }
};

// Initial board setup
let board = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
];

// DOM elements (will be initialized after DOM is loaded)
let timerElement, scoreElement, levelElement, movesElement, chessBoard, statusText;
let whiteTimeElement, blackTimeElement, whitePlayerElement, blackPlayerElement, movesList;
let startBtn, pauseBtn, restartBtn, newGameBtn, undoBtn, hintBtn;
let gameNotification, gameOverModal, gameResultTitle, finalScoreElement, finalLevelElement;
let totalMovesElement, gameTimeElement, playAgainBtn, mainMenuBtn, timerProgress, difficultyButtons;

// Initialize DOM elements
function initializeDOMElements() {
    console.log('Initializing DOM elements...');
    
    try {
        timerElement = document.getElementById('timer');
        scoreElement = document.getElementById('score');
        levelElement = document.getElementById('level');
        movesElement = document.getElementById('moves');
        chessBoard = document.getElementById('chess-board');
        statusText = document.getElementById('status-text');
        whiteTimeElement = document.getElementById('white-time');
        blackTimeElement = document.getElementById('black-time');
        whitePlayerElement = document.getElementById('white-player');
        blackPlayerElement = document.getElementById('black-player');
        movesList = document.getElementById('moves-list');
        startBtn = document.getElementById('start-btn');
        pauseBtn = document.getElementById('pause-btn');
        restartBtn = document.getElementById('restart-btn');
        newGameBtn = document.getElementById('new-game-btn');
        undoBtn = document.getElementById('undo-btn');
        hintBtn = document.getElementById('hint-btn');
        gameNotification = document.getElementById('game-notification');
        gameOverModal = document.getElementById('game-over-modal');
        gameResultTitle = document.getElementById('game-result-title');
        finalScoreElement = document.getElementById('final-score');
        finalLevelElement = document.getElementById('final-level');
        totalMovesElement = document.getElementById('total-moves');
        gameTimeElement = document.getElementById('game-time');
        playAgainBtn = document.getElementById('play-again-btn');
        mainMenuBtn = document.getElementById('main-menu-btn');
        timerProgress = document.querySelector('.GH-timer-progress');
        difficultyButtons = document.querySelectorAll('.GH-difficulty-btn');
        
        console.log('DOM elements initialized successfully');
    } catch (error) {
        console.error('Error initializing DOM elements:', error);
    }
}

// Set up event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    try {
        if (startBtn) startBtn.addEventListener('click', startGame);
        if (pauseBtn) pauseBtn.addEventListener('click', togglePause);
        if (restartBtn) restartBtn.addEventListener('click', restartGame);
        if (newGameBtn) newGameBtn.addEventListener('click', startNewGame);
        if (undoBtn) undoBtn.addEventListener('click', undoMove);
        if (hintBtn) hintBtn.addEventListener('click', showHint);
        if (playAgainBtn) playAgainBtn.addEventListener('click', playAgain);
        if (mainMenuBtn) mainMenuBtn.addEventListener('click', goToMainMenu);
        
        if (difficultyButtons) {
            difficultyButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    difficultyButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    gameDifficulty = this.getAttribute('data-difficulty');
                    console.log(`Difficulty changed to: ${gameDifficulty}`);
                    if (isGameActive) {
                        restartGame();
                    }
                });
            });
        }
        
        console.log('Event listeners set up successfully');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

// Save game state for undo functionality
function saveGameState() {
    console.log('Saving game state for undo...');
    
    try {
        // Create a deep copy of the board
        const boardCopy = JSON.parse(JSON.stringify(board));
        
        // Save the current game state
        previousGameStates.push({
            board: boardCopy,
            currentPlayer: currentPlayer,
            moveHistory: JSON.parse(JSON.stringify(moveHistory)),
            totalMoves: totalMoves,
            gameScore: gameScore,
            whiteTime: whiteTime,
            blackTime: blackTime,
            isWhiteInCheck: isWhiteInCheck,
            isBlackInCheck: isBlackInCheck
        });
        
        // Limit the number of stored states
        if (previousGameStates.length > maxUndoSteps) {
            previousGameStates.shift();
        }
        
        // Enable the undo button
        if (undoBtn) undoBtn.disabled = previousGameStates.length === 0;
        
        console.log(`Game state saved. Total states: ${previousGameStates.length}`);
    } catch (error) {
        console.error('Error saving game state:', error);
    }
}

// Restore previous game state for undo
function restorePreviousGameState() {
    console.log('Attempting to restore previous game state...');
    
    try {
        if (previousGameStates.length === 0) {
            console.log('No previous game states to restore');
            return false;
        }
        
        const previousState = previousGameStates.pop();
        
        board = previousState.board;
        currentPlayer = previousState.currentPlayer;
        moveHistory = previousState.moveHistory;
        totalMoves = previousState.totalMoves;
        gameScore = previousState.gameScore;
        whiteTime = previousState.whiteTime;
        blackTime = previousState.blackTime;
        isWhiteInCheck = previousState.isWhiteInCheck;
        isBlackInCheck = previousState.isBlackInCheck;
        
        // Update UI
        updateUI();
        initializeBoard();
        updatePlayerDisplay();
        updateMoveHistory();
        
        // Update undo button state
        if (undoBtn) undoBtn.disabled = previousGameStates.length === 0;
        
        console.log('Game state restored successfully');
        return true;
    } catch (error) {
        console.error('Error restoring game state:', error);
        return false;
    }
}

// Check if a king is in check
function isKingInCheck(kingColor) {
    console.log(`Checking if ${kingColor} king is in check...`);
    
    try {
        // Find the king's position
        let kingRow, kingCol;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col] === `${kingColor[0]}k`) {
                    kingRow = row;
                    kingCol = col;
                    break;
                }
            }
        }
        
        // Check if any opponent piece can attack the king
        const opponentColor = kingColor === 'white' ? 'black' : 'white';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece[0] === opponentColor[0]) {
                    const moves = calculatePossibleMoves(row, col, true); // Check without validation
                    if (moves.some(([r, c]) => r === kingRow && c === kingCol)) {
                        console.log(`${kingColor} king is in check!`);
                        return true;
                    }
                }
            }
        }
        
        console.log(`${kingColor} king is not in check`);
        return false;
    } catch (error) {
        console.error('Error checking king status:', error);
        return false;
    }
}

// Filter moves that would leave the king in check
function filterMovesThatLeaveKingInCheck(row, col, moves) {
    console.log(`Filtering moves for piece at [${row}, ${col}] that leave king in check...`);
    
    try {
        const pieceColor = board[row][col][0];
        const validMoves = [];
        
        for (const [toRow, toCol] of moves) {
            // Save the current state
            const originalPiece = board[toRow][toCol];
            const movingPiece = board[row][col];
            
            // Make the move temporarily
            board[toRow][toCol] = movingPiece;
            board[row][col] = '';
            
            // Check if the king is still in check after the move
            const kingInCheck = isKingInCheck(pieceColor === 'w' ? 'white' : 'black');
            
            // Restore the board
            board[row][col] = movingPiece;
            board[toRow][toCol] = originalPiece;
            
            // If the king is not in check, add to valid moves
            if (!kingInCheck) {
                validMoves.push([toRow, toCol]);
            }
        }
        
        console.log(`Filtered moves: ${validMoves.length} valid moves out of ${moves.length}`);
        return validMoves;
    } catch (error) {
        console.error('Error filtering moves:', error);
        return [];
    }
}

// Initialize the chess board
function initializeBoard() {
    console.log('Initializing chess board...');
    
    try {
        if (!chessBoard) {
            console.error('Chess board element not found');
            return;
        }
        
        chessBoard.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `GH-chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = board[row][col];
                if (piece) {
                    const pieceColor = piece[0] === 'w' ? 'white' : 'black';
                    const pieceType = piece[1];
                    
                    // Map piece codes to piece names
                    const pieceNameMap = {
                        'k': 'king',
                        'q': 'queen',
                        'r': 'rook',
                        'b': 'bishop',
                        'n': 'knight',
                        'p': 'pawn'
                    };
                    
                    const pieceName = pieceNameMap[pieceType];
                    if (pieceName && pieces[pieceColor] && pieces[pieceColor][pieceName]) {
                        square.innerHTML = pieces[pieceColor][pieceName];
                        square.dataset.piece = piece;
                    } else {
                        console.warn(`Piece not found: ${pieceColor} ${pieceType}`);
                    }
                }
                
                square.addEventListener('click', () => handleSquareClick(row, col));
                chessBoard.appendChild(square);
            }
        }
        
        updatePlayerDisplay();
        updateCheckIndicators();
        
        console.log('Chess board initialized successfully');
    } catch (error) {
        console.error('Error initializing chess board:', error);
    }
}

// Update check indicators on the board
function updateCheckIndicators() {
    console.log('Updating check indicators...');
    
    try {
        // Clear all check indicators
        document.querySelectorAll('.GH-chess-square').forEach(square => {
            square.classList.remove('check');
        });
        
        // Find kings and mark if in check
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece === 'wk' && isWhiteInCheck) {
                    const square = document.querySelector(`.GH-chess-square[data-row="${row}"][data-col="${col}"]`);
                    if (square) square.classList.add('check');
                } else if (piece === 'bk' && isBlackInCheck) {
                    const square = document.querySelector(`.GH-chess-square[data-row="${row}"][data-col="${col}"]`);
                    if (square) square.classList.add('check');
                }
            }
        }
        
        console.log('Check indicators updated');
    } catch (error) {
        console.error('Error updating check indicators:', error);
    }
}

// Update a specific square on the board
function updateSquare(row, col) {
    console.log(`Updating square [${row}, ${col}]...`);
    
    try {
        const squareElement = document.querySelector(`.GH-chess-square[data-row="${row}"][data-col="${col}"]`);
        if (!squareElement) {
            console.error(`Square element not found for [${row}, ${col}]`);
            return;
        }
        
        const piece = board[row][col];
        
        // Clear the square
        squareElement.innerHTML = '';
        delete squareElement.dataset.piece;
        
        // If there's a piece, add it to the square
        if (piece) {
            const pieceColor = piece[0] === 'w' ? 'white' : 'black';
            const pieceType = piece[1];
            
            // Map piece codes to piece names
            const pieceNameMap = {
                'k': 'king',
                'q': 'queen',
                'r': 'rook',
                'b': 'bishop',
                'n': 'knight',
                'p': 'pawn'
            };
            
            const pieceName = pieceNameMap[pieceType];
            if (pieceName && pieces[pieceColor] && pieces[pieceColor][pieceName]) {
                squareElement.innerHTML = pieces[pieceColor][pieceName];
                squareElement.dataset.piece = piece;
            }
        }
    } catch (error) {
        console.error(`Error updating square [${row}, ${col}]:`, error);
    }
}

// Handle square click
function handleSquareClick(row, col) {
    console.log(`Square clicked: [${row}, ${col}]`);
    
    if (!isGameActive || isGamePaused) {
        console.log('Game is not active or is paused, ignoring click');
        return;
    }
    
    try {
        const square = board[row][col];
        const squareElement = document.querySelector(`.GH-chess-square[data-row="${row}"][data-col="${col}"]`);
        
        // If a piece is already selected
        if (selectedPiece) {
            const [selectedRow, selectedCol] = selectedPiece;
            
            // Check if the clicked square is a valid move
            const isValidMove = possibleMoves.some(move => 
                move[0] === row && move[1] === col
            );
            
            if (isValidMove) {
                console.log(`Valid move detected from [${selectedRow}, ${selectedCol}] to [${row}, ${col}]`);
                
                // Save game state before making the move
                saveGameState();
                
                // Move the piece
                movePiece(selectedRow, selectedCol, row, col);
                clearSelection();
            } else if (square && square[0] === currentPlayer[0]) {
                // Select a different piece of the same color
                console.log(`Selecting different piece at [${row}, ${col}]`);
                selectPiece(row, col);
            } else {
                // Invalid move, clear selection
                console.log('Invalid move, clearing selection');
                clearSelection();
            }
        } else if (square && square[0] === currentPlayer[0]) {
            // Select a piece
            console.log(`Selecting piece at [${row}, ${col}]`);
            selectPiece(row, col);
        } else {
            console.log('No piece selected and clicked square is empty or opponent piece');
        }
    } catch (error) {
        console.error('Error handling square click:', error);
    }
}

// Select a piece and show possible moves
function selectPiece(row, col) {
    console.log(`Selecting piece at [${row}, ${col}]`);
    
    try {
        clearSelection();
        
        selectedPiece = [row, col];
        const squareElement = document.querySelector(`.GH-chess-square[data-row="${row}"][data-col="${col}"]`);
        if (squareElement) {
            squareElement.classList.add('selected');
        }
        
        // Calculate possible moves
        possibleMoves = calculatePossibleMoves(row, col);
        console.log(`Found ${possibleMoves.length} possible moves`);
        
        // Filter moves that would leave the king in check
        possibleMoves = filterMovesThatLeaveKingInCheck(row, col, possibleMoves);
        console.log(`After filtering: ${possibleMoves.length} valid moves`);
        
        // Highlight possible moves
        possibleMoves.forEach(([r, c]) => {
            const moveSquare = document.querySelector(`.GH-chess-square[data-row="${r}"][data-col="${c}"]`);
            if (moveSquare) {
                if (board[r][c]) {
                    moveSquare.classList.add('possible-capture');
                } else {
                    moveSquare.classList.add('possible-move');
                }
            }
        });
        
        console.log('Piece selection completed');
    } catch (error) {
        console.error('Error selecting piece:', error);
    }
}

// Calculate possible moves for a piece (simplified)
function calculatePossibleMoves(row, col, skipCheckValidation = false) {
    console.log(`Calculating possible moves for piece at [${row}, ${col}]`);
    
    try {
        const piece = board[row][col];
        if (!piece) {
            console.log('No piece at this position');
            return [];
        }
        
        const color = piece[0];
        const type = piece[1];
        const moves = [];
        
        // Simplified move calculation (not following all chess rules)
        switch(type) {
            case 'p': // Pawn
                const direction = color === 'w' ? -1 : 1;
                // Move forward
                if (isValidPosition(row + direction, col) && !board[row + direction][col]) {
                    moves.push([row + direction, col]);
                    // Double move from starting position
                    if ((color === 'w' && row === 6) || (color === 'b' && row === 1)) {
                        if (!board[row + 2 * direction][col]) {
                            moves.push([row + 2 * direction, col]);
                        }
                    }
                }
                // Capture diagonally
                if (isValidPosition(row + direction, col - 1) && 
                    board[row + direction][col - 1] && 
                    board[row + direction][col - 1][0] !== color) {
                    moves.push([row + direction, col - 1]);
                }
                if (isValidPosition(row + direction, col + 1) && 
                    board[row + direction][col + 1] && 
                    board[row + direction][col + 1][0] !== color) {
                    moves.push([row + direction, col + 1]);
                }
                break;
                
            case 'r': // Rook
                addLinearMoves(moves, row, col, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
                break;
                
            case 'n': // Knight
                const knightMoves = [
                    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
                    [1, -2], [1, 2], [2, -1], [2, 1]
                ];
                knightMoves.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (isValidPosition(newRow, newCol) && 
                        (!board[newRow][newCol] || board[newRow][newCol][0] !== color)) {
                        moves.push([newRow, newCol]);
                    }
                });
                break;
                
            case 'b': // Bishop
                addLinearMoves(moves, row, col, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
                break;
                
            case 'q': // Queen
                addLinearMoves(moves, row, col, [
                    [-1, 0], [1, 0], [0, -1], [0, 1],
                    [-1, -1], [-1, 1], [1, -1], [1, 1]
                ]);
                break;
                
            case 'k': // King
                const kingMoves = [
                    [-1, -1], [-1, 0], [-1, 1],
                    [0, -1],           [0, 1],
                    [1, -1],  [1, 0],  [1, 1]
                ];
                kingMoves.forEach(([dr, dc]) => {
                    const newRow = row + dr;
                    const newCol = col + dc;
                    if (isValidPosition(newRow, newCol) && 
                        (!board[newRow][newCol] || board[newRow][newCol][0] !== color)) {
                        moves.push([newRow, newCol]);
                    }
                });
                break;
        }
        
        console.log(`Calculated ${moves.length} possible moves for ${color}${type}`);
        return moves;
    } catch (error) {
        console.error('Error calculating possible moves:', error);
        return [];
    }
}

// Add linear moves for pieces like rook, bishop, queen
function addLinearMoves(moves, row, col, directions) {
    console.log(`Adding linear moves from [${row}, ${col}]`);
    
    try {
        const color = board[row][col][0];
        
        directions.forEach(([dr, dc]) => {
            let newRow = row + dr;
            let newCol = col + dc;
            
            while (isValidPosition(newRow, newCol)) {
                if (!board[newRow][newCol]) {
                    moves.push([newRow, newCol]);
                } else {
                    if (board[newRow][newCol][0] !== color) {
                        moves.push([newRow, newCol]);
                    }
                    break;
                }
                
                newRow += dr;
                newCol += dc;
            }
        });
    } catch (error) {
        console.error('Error adding linear moves:', error);
    }
}

// Check if position is valid
function isValidPosition(row, col) {
    const isValid = row >= 0 && row < 8 && col >= 0 && col < 8;
    if (!isValid) {
        console.log(`Invalid position: [${row}, ${col}]`);
    }
    return isValid;
}

// Move a piece
function movePiece(fromRow, fromCol, toRow, toCol) {
    console.log(`Moving piece from [${fromRow}, ${fromCol}] to [${toRow}, ${toCol}]`);
    
    try {
        const piece = board[fromRow][fromCol];
        const capturedPiece = board[toRow][toCol];
        
        // Update board
        board[toRow][toCol] = piece;
        board[fromRow][fromCol] = '';
        
        // Update the visual representation of both squares
        updateSquare(fromRow, fromCol);
        updateSquare(toRow, toCol);
        
        // Check for check after the move
        const opponentColor = currentPlayer === 'white' ? 'black' : 'white';
        const isOpponentInCheck = isKingInCheck(opponentColor);
        
        if (currentPlayer === 'white') {
            isBlackInCheck = isOpponentInCheck;
        } else {
            isWhiteInCheck = isOpponentInCheck;
        }
        
        // Update check indicators
        updateCheckIndicators();
        
        // Update move history
        const fromSquare = String.fromCharCode(97 + fromCol) + (8 - fromRow);
        const toSquare = String.fromCharCode(97 + toCol) + (8 - toRow);
        const moveNotation = `${piece[1].toUpperCase()}${fromSquare}${capturedPiece ? 'x' : ''}${toSquare}${isOpponentInCheck ? '+' : ''}`;
        
        moveHistory.push({
            move: totalMoves + 1,
            white: currentPlayer === 'white' ? moveNotation : '',
            black: currentPlayer === 'black' ? moveNotation : ''
        });
        
        totalMoves++;
        if (movesElement) movesElement.textContent = totalMoves;
        
        // Update score based on captured piece
        if (capturedPiece) {
            const pieceValues = {
                'p': 1,
                'n': 3,
                'b': 3,
                'r': 5,
                'q': 9,
                'k': 0
            };
            
            const value = pieceValues[capturedPiece[1]] || 0;
            gameScore += value * gameLevel;
            if (scoreElement) scoreElement.textContent = gameScore;
            
            console.log(`Captured ${capturedPiece[1].toUpperCase()}! +${value * gameLevel} points`);
            showNotification(`Captured ${capturedPiece[1].toUpperCase()}! +${value * gameLevel} points`, 'success');
        }
        
        // Switch player
        currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
        updatePlayerDisplay();
        updateMoveHistory();
        
        // Check for game end conditions
        checkGameEnd();
        
        console.log('Piece move completed successfully');
    } catch (error) {
        console.error('Error moving piece:', error);
    }
}

// Clear selection and highlights
function clearSelection() {
    console.log('Clearing selection and highlights');
    
    try {
        document.querySelectorAll('.GH-chess-square').forEach(square => {
            square.classList.remove('selected', 'possible-move', 'possible-capture');
        });
        
        selectedPiece = null;
        possibleMoves = [];
    } catch (error) {
        console.error('Error clearing selection:', error);
    }
}

// Update player display
function updatePlayerDisplay() {
    console.log('Updating player display...');
    
    try {
        let statusMessage = currentPlayer === 'white' ? 
            getTranslation('GH.chess.whiteToMove', 'White to move') : 
            getTranslation('GH.chess.blackToMove', 'Black to move');
        
        // Add check status to display
        if (currentPlayer === 'white' && isWhiteInCheck) {
            statusMessage += ' - CHECK!';
        } else if (currentPlayer === 'black' && isBlackInCheck) {
            statusMessage += ' - CHECK!';
        }
        
        if (statusText) statusText.textContent = statusMessage;
            
        if (whitePlayerElement) whitePlayerElement.classList.toggle('active', currentPlayer === 'white');
        if (blackPlayerElement) blackPlayerElement.classList.toggle('active', currentPlayer === 'black');
        
        console.log(`Player display updated: ${statusMessage}`);
    } catch (error) {
        console.error('Error updating player display:', error);
    }
}

// Update move history display
function updateMoveHistory() {
    console.log('Updating move history...');
    
    try {
        if (!movesList) {
            console.error('Moves list element not found');
            return;
        }
        
        movesList.innerHTML = '';
        
        moveHistory.forEach(record => {
            const moveElement = document.createElement('div');
            moveElement.className = 'GH-move';
            moveElement.textContent = `${record.move}. ${record.white} ${record.black}`;
            movesList.appendChild(moveElement);
        });
        
        // Scroll to bottom
        movesList.scrollTop = movesList.scrollHeight;
        
        console.log(`Move history updated with ${moveHistory.length} moves`);
    } catch (error) {
        console.error('Error updating move history:', error);
    }
}

// Check for game end conditions
function checkGameEnd() {
    console.log('Checking for game end conditions...');
    
    try {
        // Check for checkmate
        // For simplicity, we'll check if the current player has any valid moves
        let hasValidMoves = false;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (piece && piece[0] === currentPlayer[0]) {
                    const moves = calculatePossibleMoves(row, col);
                    const validMoves = filterMovesThatLeaveKingInCheck(row, col, moves);
                    
                    if (validMoves.length > 0) {
                        hasValidMoves = true;
                        break;
                    }
                }
            }
            if (hasValidMoves) break;
        }
        
        // If no valid moves and king is in check, it's checkmate
        if (!hasValidMoves) {
            if ((currentPlayer === 'white' && isWhiteInCheck) || 
                (currentPlayer === 'black' && isBlackInCheck)) {
                console.log('Checkmate detected!');
                endGame('checkmate');
            } else {
                // Stalemate
                console.log('Stalemate detected!');
                endGame('stalemate');
            }
        }
        
        // For demo purposes, also end game after 50 moves
        if (totalMoves >= 50) {
            console.log('Draw by 50-move rule');
            endGame('draw');
        }
    } catch (error) {
        console.error('Error checking game end conditions:', error);
    }
}

// Game functions
function startGame() {
    console.log('Starting new game...');
    
    try {
        isGameActive = true;
        isGamePaused = false;
        gameTime = 0;
        gameScore = 0;
        gameLevel = 1;
        totalMoves = 0;
        currentPlayer = 'white';
        moveHistory = [];
        whiteTime = 600;
        blackTime = 600;
        
        // Reset check status and undo history
        isWhiteInCheck = false;
        isBlackInCheck = false;
        previousGameStates = [];
        
        // Reset board
        board = [
            ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
            ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
            ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
        ];
        
        updateUI();
        initializeBoard();
        if (startBtn) startBtn.disabled = true;
        if (pauseBtn) pauseBtn.disabled = false;
        if (undoBtn) undoBtn.disabled = true; // Initially disabled until moves are made
        
        // Start timers
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, 1000);
        
        clearInterval(playerTimer);
        playerTimer = setInterval(updatePlayerTime, 1000);
        
        showTranslatableNotification('GH.chess.gameStarted', 'info');
        
        console.log('Game started successfully');
    } catch (error) {
        console.error('Error starting game:', error);
    }
}

function startNewGame() {
    console.log('Starting new game request...');
    
    try {
        if (isGameActive) {
            showTranslatableNotification('GH.chess.restartConfirm', 'warning');
            clearInterval(gameInterval);
            clearInterval(playerTimer);
            startGame();
        } else {
            startGame();
        }
    } catch (error) {
        console.error('Error in startNewGame:', error);
    }
}

function updateGame() {
    if (!isGameActive || isGamePaused) return;
    
    gameTime++;
    updateTimer();
}

function updatePlayerTime() {
    if (!isGameActive || isGamePaused) return;
    
    try {
        if (currentPlayer === 'white') {
            whiteTime--;
            if (whiteTime <= 0) {
                console.log('White time expired');
                endGame('time', 'black');
                return;
            }
        } else {
            blackTime--;
            if (blackTime <= 0) {
                console.log('Black time expired');
                endGame('time', 'white');
                return;
            }
        }
        
        updateTimeDisplay();
    } catch (error) {
        console.error('Error updating player time:', error);
    }
}

function updateTimer() {
    try {
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        if (timerElement) timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    } catch (error) {
        console.error('Error updating timer:', error);
    }
}

function updateTimeDisplay() {
    try {
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };
        
        if (whiteTimeElement) whiteTimeElement.textContent = formatTime(whiteTime);
        if (blackTimeElement) blackTimeElement.textContent = formatTime(blackTime);
    } catch (error) {
        console.error('Error updating time display:', error);
    }
}

function togglePause() {
    console.log('Toggling pause...');
    
    try {
        isGamePaused = !isGamePaused;
        const pauseIcon = isGamePaused ? '▶️' : '⏸️';
        const pauseText = isGamePaused ? 
            getTranslation('GH.chess.resume', 'Resume') : 
            getTranslation('GH.chess.pause', 'Pause');
        if (pauseBtn) pauseBtn.innerHTML = `<span>${pauseIcon}</span> ${pauseText}`;
        
        const messageKey = isGamePaused ? 'GH.chess.gamePaused' : 'GH.chess.gameResumed';
        showTranslatableNotification(messageKey, 'info');
        
        console.log(`Game ${isGamePaused ? 'paused' : 'resumed'}`);
    } catch (error) {
        console.error('Error toggling pause:', error);
    }
}

function restartGame() {
    console.log('Restarting game...');
    
    try {
        if (isGameActive) {
            showTranslatableNotification('GH.chess.restartConfirm', 'warning');
            clearInterval(gameInterval);
            clearInterval(playerTimer);
            startGame();
        } else {
            clearInterval(gameInterval);
            clearInterval(playerTimer);
            startGame();
        }
    } catch (error) {
        console.error('Error restarting game:', error);
    }
}

// Implement undo functionality
function undoMove() {
    console.log('Undo move requested...');
    
    try {
        if (restorePreviousGameState()) {
            showTranslatableNotification('GH.chess.moveUndone', 'info');
        } else {
            showTranslatableNotification('GH.chess.noMovesToUndo', 'warning');
        }
    } catch (error) {
        console.error('Error undoing move:', error);
    }
}

function showHint() {
    console.log('Showing hint...');
    
    try {
        // For simplicity, we'll just show a random possible move
        if (selectedPiece) {
            const [row, col] = selectedPiece;
            if (possibleMoves.length > 0) {
                const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                const [r, c] = randomMove;
                const square = document.querySelector(`.GH-chess-square[data-row="${r}"][data-col="${c}"]`);
                if (square) {
                    square.classList.add('highlight');
                    
                    setTimeout(() => {
                        square.classList.remove('highlight');
                    }, 2000);
                    
                    showTranslatableNotification('GH.chess.hintShown', 'info');
                    console.log(`Hint shown for move to [${r}, ${c}]`);
                }
            } else {
                console.log('No possible moves for hint');
                showTranslatableNotification('GH.chess.selectPieceFirst', 'warning');
            }
        } else {
            console.log('No piece selected for hint');
            showTranslatableNotification('GH.chess.selectPieceFirst', 'warning');
        }
    } catch (error) {
        console.error('Error showing hint:', error);
    }
}

function playAgain() {
    console.log('Playing again...');
    
    try {
        if (gameOverModal) gameOverModal.classList.remove('active');
        startGame();
    } catch (error) {
        console.error('Error in playAgain:', error);
    }
}

function goToMainMenu() {
    console.log('Going to main menu...');
    
    try {
        if (gameOverModal) gameOverModal.classList.remove('active');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error going to main menu:', error);
    }
}

function endGame(result, winner = null) {
    console.log(`Ending game with result: ${result}, winner: ${winner}`);
    
    try {
        isGameActive = false;
        clearInterval(gameInterval);
        clearInterval(playerTimer);
        
        // Update modal based on result
        if (result === 'checkmate') {
            if (gameResultTitle) {
                gameResultTitle.textContent = getTranslation('GH.chess.checkmate', 'Checkmate!');
                gameResultTitle.setAttribute('data-i18n', 'GH.chess.checkmate');
            }
        } else if (result === 'stalemate') {
            if (gameResultTitle) {
                gameResultTitle.textContent = getTranslation('GH.chess.stalemate', 'Stalemate!');
                gameResultTitle.setAttribute('data-i18n', 'GH.chess.stalemate');
            }
        } else if (result === 'draw') {
            if (gameResultTitle) {
                gameResultTitle.textContent = getTranslation('GH.chess.draw', 'Draw!');
                gameResultTitle.setAttribute('data-i18n', 'GH.chess.draw');
            }
        } else if (result === 'time') {
            if (gameResultTitle) {
                gameResultTitle.textContent = `${winner === 'white' ? 
                    getTranslation('GH.chess.white', 'White') : 
                    getTranslation('GH.chess.black', 'Black')} ${getTranslation('GH.chess.winsOnTime', 'wins on time!')}`;
            }
        }
        
        // Update modal stats
        if (finalScoreElement) finalScoreElement.textContent = gameScore;
        if (finalLevelElement) finalLevelElement.textContent = gameLevel;
        if (totalMovesElement) totalMovesElement.textContent = totalMoves;
        
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        if (gameTimeElement) gameTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Show game over modal
        setTimeout(() => {
            if (gameOverModal) gameOverModal.classList.add('active');
        }, 500);
        
        // Reset buttons
        if (startBtn) startBtn.disabled = false;
        if (pauseBtn) pauseBtn.disabled = true;
        if (undoBtn) undoBtn.disabled = true;
        
        const gameOverMessage = `${getTranslation('GH.chess.gameOver', 'Game Over!')} ${getTranslation('GH.chess.finalScore', 'Final Score')}: ${gameScore}`;
        showNotification(gameOverMessage, 'info');
        
        console.log('Game ended successfully');
    } catch (error) {
        console.error('Error ending game:', error);
    }
}

function updateUI() {
    console.log('Updating UI...');
    
    try {
        if (scoreElement) scoreElement.textContent = gameScore;
        if (levelElement) levelElement.textContent = gameLevel;
        if (movesElement) movesElement.textContent = totalMoves;
        updateTimeDisplay();
        updateTimer();
        
        console.log('UI updated successfully');
    } catch (error) {
        console.error('Error updating UI:', error);
    }
}

// Enhanced notification function that supports translation keys
function showTranslatableNotification(messageKey, type) {
    console.log(`Showing translatable notification: ${messageKey}`);
    
    try {
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
    } catch (error) {
        console.error('Error showing translatable notification:', error);
    }
}

function getFallbackGameMessage(key) {
    const fallbackMessages = {
        'chess.gameStarted': 'Game started! Good luck!',
        'chess.gamePaused': 'Game paused',
        'chess.gameResumed': 'Game resumed',
        'chess.restartConfirm': 'Are you sure you want to restart? Your progress will be lost.',
        'chess.undoNotImplemented': 'Undo feature not implemented in this demo.',
        'chess.moveUndone': 'Move undone!',
        'chess.noMovesToUndo': 'No moves to undo!',
        'chess.hintShown': 'Hint shown!',
        'chess.selectPieceFirst': 'Select a piece first to get a hint.',
        'chess.gameOver': 'Game Over!',
        'chess.stalemate': 'Stalemate!',
        'chess.draw': 'Draw!'
    };
    
    return fallbackMessages[key] || key;
}

function showNotification(message, type) {
    console.log(`Showing notification: ${message} (${type})`);
    
    try {
        if (!gameNotification) {
            console.error('Game notification element not found');
            return;
        }
        
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
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}

// Helper function to get translations
function getTranslation(key, fallback) {
    try {
        const translations = window.getTranslations ? window.getTranslations() : {};
        
        // Remove 'GH.' prefix if present and split the key
        const cleanKey = key.replace(/^GH\./, '');
        const keys = cleanKey.split('.');
        
        let value = keys.reduce((obj, k) => {
            return obj && obj[k] !== undefined ? obj[k] : undefined;
        }, translations);
        
        return value && typeof value === 'string' ? value : fallback;
    } catch (error) {
        console.error('Error getting translation:', error);
        return fallback;
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing chess game...');
    
    try {
        initializeDOMElements();
        setupEventListeners();
        initializeBoard();
        updateUI();
        
        console.log('Chess game initialized successfully');
    } catch (error) {
        console.error('Error initializing chess game:', error);
    }
});

// Make functions available globally for HTML event handlers
window.chessGame = {
    startGame,
    togglePause,
    restartGame,
    startNewGame,
    undoMove,
    showHint,
    playAgain,
    goToMainMenu
};