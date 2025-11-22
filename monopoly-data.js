// monopoly-data.js
// Game data and logic for Monopoly Deal

// Card types
const cardTypes = {
    PROPERTY: 'property',
    MONEY: 'money',
    ACTION: 'action',
    RENT: 'rent'
};

// Property set definitions
const propertySets = [
    { 
        color: 'brown', 
        name: 'Brown', 
        cardsNeeded: 2, 
        rent: [1, 2],
        fullSetRent: 2
    },
    { 
        color: 'lightblue', 
        name: 'Light Blue', 
        cardsNeeded: 3, 
        rent: [1, 2, 3],
        fullSetRent: 3
    },
    { 
        color: 'pink', 
        name: 'Pink', 
        cardsNeeded: 3, 
        rent: [1, 2, 4],
        fullSetRent: 4
    },
    { 
        color: 'orange', 
        name: 'Orange', 
        cardsNeeded: 3, 
        rent: [1, 3, 5],
        fullSetRent: 5
    },
    { 
        color: 'red', 
        name: 'Red', 
        cardsNeeded: 3, 
        rent: [2, 3, 6],
        fullSetRent: 6
    },
    { 
        color: 'yellow', 
        name: 'Yellow', 
        cardsNeeded: 3, 
        rent: [2, 4, 6],
        fullSetRent: 6
    },
    { 
        color: 'green', 
        name: 'Green', 
        cardsNeeded: 3, 
        rent: [2, 4, 7],
        fullSetRent: 7
    },
    { 
        color: 'darkblue', 
        name: 'Dark Blue', 
        cardsNeeded: 2, 
        rent: [3, 8],
        fullSetRent: 8
    },
    { 
        color: 'railroad', 
        name: 'Railroad', 
        cardsNeeded: 4, 
        rent: [1, 2, 3, 4],
        fullSetRent: 4
    },
    { 
        color: 'utility', 
        name: 'Utility', 
        cardsNeeded: 2, 
        rent: [1, 2],
        fullSetRent: 2
    }
];

// Action card types
const actionCards = [
    {
        type: 'debt_collector',
        name: 'Debt Collector',
        description: 'Force any player to pay you 5M',
        value: 5
    },
    {
        type: 'deal_breaker',
        name: 'Deal Breaker',
        description: 'Steal a complete set from any player',
        value: 0
    },
    {
        type: 'double_rent',
        name: 'Double the Rent',
        description: 'Double your next rent card',
        value: 0
    },
    {
        type: 'forced_deal',
        name: 'Forced Deal',
        description: 'Swap a property with any player',
        value: 0
    },
    {
        type: 'hotel',
        name: 'Hotel',
        description: 'Add to complete set to increase rent',
        value: 0
    },
    {
        type: 'house',
        name: 'House',
        description: 'Add to complete set to increase rent',
        value: 0
    },
    {
        type: 'sly_deal',
        name: 'Sly Deal',
        description: 'Steal a property from any player',
        value: 0
    }
];

// Game rules and constants
const gameRules = {
    WINNING_SETS: 3,
    INITIAL_CARDS: 5,
    DRAW_COUNT: 2,
    MAX_HAND_SIZE: 7,
    MAX_PLAYERS: 4,
    MIN_PLAYERS: 2
};

// Utility functions
function getPropertySetByColor(color) {
    return propertySets.find(set => set.color === color);
}

function calculateRent(player, color) {
    const set = getPropertySetByColor(color);
    if (!set || !player.properties[color]) return 0;
    
    const propertyCount = player.properties[color].length;
    if (propertyCount < set.cardsNeeded) {
        return set.rent[propertyCount - 1] || 0;
    } else {
        return set.fullSetRent;
    }
}

function canPlayCard(player, card, gameState) {
    // Check if player can play this card
    switch (card.type) {
        case cardTypes.PROPERTY:
            return true; // Can always play property cards
        case cardTypes.MONEY:
            return true; // Can always play money cards
        case cardTypes.RENT:
            // Check if player has properties to charge rent
            return Object.keys(player.properties).length > 0;
        case cardTypes.ACTION:
            // Check action-specific conditions
            return true; // Simplified for now
        default:
            return false;
    }
}

function isValidMove(player, card, target, gameState) {
    // Validate if this move is allowed
    if (!canPlayCard(player, card, gameState)) return false;
    
    // Add more specific validation based on card type and target
    return true;
}

function getPlayerById(players, id) {
    return players.find(player => player.id === id);
}

function getNextPlayer(currentPlayerIndex, players) {
    return (currentPlayerIndex + 1) % players.length;
}

function getPlayerPropertiesSummary(player) {
    const summary = {};
    Object.keys(player.properties).forEach(color => {
        const set = getPropertySetByColor(color);
        summary[color] = {
            count: player.properties[color].length,
            needed: set.cardsNeeded,
            complete: player.properties[color].length >= set.cardsNeeded,
            name: set.name
        };
    });
    return summary;
}

function checkGameWinner(players) {
    return players.find(player => player.setsCompleted >= gameRules.WINNING_SETS);
}

function createDeck() {
    const deck = [];
    
    // Add property cards
    propertySets.forEach(set => {
        for (let i = 0; i < 6; i++) {
            deck.push({
                id: `property_${set.color}_${i}`,
                type: cardTypes.PROPERTY,
                color: set.color,
                name: set.name,
                value: 0,
                set: set
            });
        }
    });
    
    // Add money cards
    const moneyValues = [1, 2, 3, 5, 10];
    moneyValues.forEach(value => {
        const count = value <= 3 ? 8 : value === 5 ? 4 : 2;
        for (let i = 0; i < count; i++) {
            deck.push({
                id: `money_${value}_${i}`,
                type: cardTypes.MONEY,
                value: value,
                name: `$${value}M`
            });
        }
    });
    
    // Add rent cards
    propertySets.forEach(set => {
        for (let i = 0; i < 3; i++) {
            deck.push({
                id: `rent_${set.color}_${i}`,
                type: cardTypes.RENT,
                color: set.color,
                value: 1,
                name: 'Rent'
            });
        }
    });
    
    // Add wild rent cards
    for (let i = 0; i < 4; i++) {
        deck.push({
            id: `rent_wild_${i}`,
            type: cardTypes.RENT,
            color: 'wild',
            value: 3,
            name: 'Wild Rent'
        });
    }
    
    // Add action cards
    actionCards.forEach(action => {
        for (let i = 0; i < 2; i++) {
            deck.push({
                id: `action_${action.type}_${i}`,
                type: cardTypes.ACTION,
                actionType: action.type,
                name: action.name,
                description: action.description,
                value: action.value
            });
        }
    });
    
    return deck;
}

function shuffleDeck(deck) {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cardTypes,
        propertySets,
        actionCards,
        gameRules,
        getPropertySetByColor,
        calculateRent,
        canPlayCard,
        isValidMove,
        getPlayerById,
        getNextPlayer,
        getPlayerPropertiesSummary,
        checkGameWinner,
        createDeck,
        shuffleDeck
    };
}