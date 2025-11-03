const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

const ensureDataDir = () => {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
};

const loadData = (filename) => {
    ensureDataDir();
    const filepath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filepath)) {
        return {};
    }
    try {
        const data = fs.readFileSync(filepath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return {};
    }
};

const saveData = (filename, data) => {
    ensureDataDir();
    const filepath = path.join(DATA_DIR, filename);
    try {
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error saving ${filename}:`, error);
        return false;
    }
};

const getPlayerData = (userId) => {
    const players = loadData('players.json');
    if (!players[userId]) {
        players[userId] = {
            money: 0,
            inventory: {},
            income: [],
            attack: [],
            defend: [],
            locked: [],
            damageLevel: 1,
            activeShield: null,
            stoneProgress: 0
        };
        saveData('players.json', players);
    }
    return players[userId];
};

const updatePlayerData = (userId, updates) => {
    const players = loadData('players.json');
    if (!players[userId]) {
        players[userId] = getPlayerData(userId);
    }
    players[userId] = { ...players[userId], ...updates };
    saveData('players.json', players);
    return players[userId];
};

const getCards = () => {
    return loadData('cards.json');
};

const saveCards = (cards) => {
    return saveData('cards.json', cards);
};

const getShop = () => {
    return loadData('shop.json');
};

const saveShop = (shop) => {
    return saveData('shop.json', shop);
};

const getEvents = () => {
    return loadData('events.json');
};

const saveEvents = (events) => {
    return saveData('events.json', events);
};

const getShields = () => {
    return loadData('shields.json');
};

const saveShields = (shields) => {
    return saveData('shields.json', shields);
};

const getStones = () => {
    return loadData('stones.json');
};

const saveStones = (stones) => {
    return saveData('stones.json', stones);
};

const getNextCardNumber = (baseName, inventory) => {
    let counter = 0;
    let newName = baseName;
    
    while (inventory[newName]) {
        counter++;
        newName = `${baseName}${counter}`;
    }
    
    return newName;
};

const RARITIES = {
    common: { weight: 60, nextRarity: 'rare' },
    rare: { weight: 30, nextRarity: 'epic' },
    epic: { weight: 10, nextRarity: 'legendary' },
    legendary: { weight: 4, nextRarity: 'mythic' },
    mythic: { weight: 2, nextRarity: 'unique' },
    unique: { weight: 0.2, nextRarity: null }
};

const getRandomRarity = () => {
    const totalWeight = Object.values(RARITIES).reduce((sum, { weight }) => sum + weight, 0);
    const random = Math.random() * totalWeight;
    let cumulative = 0;
    
    for (const [rarity, { weight }] of Object.entries(RARITIES)) {
        cumulative += weight;
        if (random <= cumulative) {
            return rarity;
        }
    }
    
    return 'common';
};

module.exports = {
    loadData,
    saveData,
    getPlayerData,
    updatePlayerData,
    getCards,
    saveCards,
    getShop,
    saveShop,
    getEvents,
    saveEvents,
    getShields,
    saveShields,
    getStones,
    saveStones,
    getNextCardNumber,
    RARITIES,
    getRandomRarity
};
