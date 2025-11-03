const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const dataManager = require('../utils/dataManager');

const STONE_HP = 170;
const activeMining = new Map();

async function handleCommand(interaction, isAdmin) {
    const commandName = interaction.commandName;

    const adminCommands = ['addcard', 'hitstoneadd', 'create', 'eventcards', 'start', 'stop', 'give', 'shieldcode', 'shop', 'removecardshop', 'removecard'];
    
    if (adminCommands.includes(commandName) && !isAdmin) {
        return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    switch (commandName) {
        case 'addcard':
            return await handleAddCard(interaction);
        case 'hitstoneadd':
            return await handleHitStoneAdd(interaction);
        case 'create':
            return await handleCreateEvent(interaction);
        case 'eventcards':
            return await handleEventCards(interaction);
        case 'start':
            return await handleStartEvent(interaction);
        case 'stop':
            return await handleStopEvent(interaction);
        case 'give':
            return await handleGive(interaction);
        case 'shieldcode':
            return await handleShieldCode(interaction);
        case 'shop':
            return await handleShop(interaction);
        case 'removecardshop':
            return await handleRemoveCardShop(interaction);
        case 'removecard':
            return await handleRemoveCard(interaction);
        case 'hitstone':
            return await handleHitStone(interaction);
        case 'hitstonevent':
            return await handleHitStoneEvent(interaction);
        case 'trade':
            return await handleTrade(interaction);
        case 'setincome':
            return await handleSetIncome(interaction);
        case 'setattack':
            return await handleSetAttack(interaction);
        case 'setdefend':
            return await handleSetDefend(interaction);
        case 'resetsetincome':
            return await handleResetSetIncome(interaction);
        case 'resetsetattack':
            return await handleResetSetAttack(interaction);
        case 'resetsetdefend':
            return await handleResetSetDefend(interaction);
        case 'attack':
            return await handleAttack(interaction);
        case 'useshield':
            return await handleUseShield(interaction);
        case 'upgrade':
            return await handleUpgrade(interaction);
        case 'contract':
            return await handleContract(interaction);
        case 'lock':
            return await handleLock(interaction);
        case 'unlock':
            return await handleUnlock(interaction);
        case 'shoplist':
            return await handleShopList(interaction);
        case 'shopbuy':
            return await handleShopBuy(interaction);
        case 'viewcard':
            return await handleViewCard(interaction);
        case 'viewattackset':
            return await handleViewAttackSet(interaction);
        case 'viewdefendset':
            return await handleViewDefendSet(interaction);
        case 'viewlock':
            return await handleViewLock(interaction);
        case 'balance':
            return await handleBalance(interaction);
        case 'inventory':
            return await handleInventory(interaction);
        case 'mycollection':
            return await handleMyCollection(interaction);
        default:
            return await interaction.reply({ content: 'Unknown command.', ephemeral: true });
    }
}

async function handleAddCard(interaction) {
    const name = interaction.options.getString('name');
    const image = interaction.options.getString('image');
    const value = interaction.options.getInteger('value');
    const rarity = interaction.options.getString('rarity');

    const cards = dataManager.getCards();
    
    if (cards[name]) {
        return await interaction.reply({ content: `Card "${name}" already exists!`, ephemeral: true });
    }

    cards[name] = { image, value, rarity };
    dataManager.saveCards(cards);

    const embed = new EmbedBuilder()
        .setTitle('Card Created!')
        .setDescription(`**${name}**`)
        .addFields(
            { name: 'Rarity', value: rarity, inline: true },
            { name: 'Value', value: value.toString(), inline: true }
        )
        .setImage(image)
        .setColor(getRarityColor(rarity));

    return await interaction.reply({ embeds: [embed] });
}

async function handleHitStoneAdd(interaction) {
    const cardName = interaction.options.getString('cardname');
    const cards = dataManager.getCards();
    
    if (!cards[cardName]) {
        return await interaction.reply({ content: `Card "${cardName}" does not exist!`, ephemeral: true });
    }

    const stones = dataManager.getStones();
    if (!stones.default) {
        stones.default = { cards: [] };
    }
    
    if (!stones.default.cards.includes(cardName)) {
        stones.default.cards.push(cardName);
        dataManager.saveStones(stones);
        return await interaction.reply({ content: `Added "${cardName}" to default stone drops.`, ephemeral: true });
    } else {
        return await interaction.reply({ content: `Card "${cardName}" is already in the default stone drop pool.`, ephemeral: true });
    }
}

async function handleCreateEvent(interaction) {
    const eventName = interaction.options.getString('eventname');
    const hp = interaction.options.getInteger('hp');
    const requiredCard = interaction.options.getString('requiredcard');
    const amount = interaction.options.getInteger('amount');

    const events = dataManager.getEvents();
    
    events[eventName] = {
        hp,
        requiredCard,
        requiredAmount: amount,
        cards: [],
        active: false
    };

    dataManager.saveEvents(events);
    return await interaction.reply({ content: `Event "${eventName}" created with ${hp} HP! Requires ${amount}x ${requiredCard}.`, ephemeral: true });
}

async function handleEventCards(interaction) {
    const eventName = interaction.options.getString('eventname');
    const cardName = interaction.options.getString('cardname');

    const events = dataManager.getEvents();
    const cards = dataManager.getCards();

    if (!events[eventName]) {
        return await interaction.reply({ content: `Event "${eventName}" does not exist!`, ephemeral: true });
    }

    if (!cards[cardName]) {
        return await interaction.reply({ content: `Card "${cardName}" does not exist!`, ephemeral: true });
    }

    if (!events[eventName].cards.includes(cardName)) {
        events[eventName].cards.push(cardName);
        dataManager.saveEvents(events);
        return await interaction.reply({ content: `Added "${cardName}" to event "${eventName}".`, ephemeral: true });
    } else {
        return await interaction.reply({ content: `Card "${cardName}" is already in this event.`, ephemeral: true });
    }
}

async function handleStartEvent(interaction) {
    const eventName = interaction.options.getString('eventname');
    const events = dataManager.getEvents();

    if (!events[eventName]) {
        return await interaction.reply({ content: `Event "${eventName}" does not exist!`, ephemeral: true });
    }

    events[eventName].active = true;
    dataManager.saveEvents(events);
    return await interaction.reply({ content: `Event "${eventName}" is now active!` });
}

async function handleStopEvent(interaction) {
    const eventName = interaction.options.getString('eventname');
    const events = dataManager.getEvents();

    if (!events[eventName]) {
        return await interaction.reply({ content: `Event "${eventName}" does not exist!`, ephemeral: true });
    }

    events[eventName].active = false;
    dataManager.saveEvents(events);
    return await interaction.reply({ content: `Event "${eventName}" is now stopped!` });
}

async function handleGive(interaction) {
    const targetUser = interaction.options.getUser('player');
    const type = interaction.options.getString('type');
    const value = interaction.options.getString('value');

    const playerData = dataManager.getPlayerData(targetUser.id);

    if (type === 'money') {
        const amount = parseInt(value);
        if (isNaN(amount)) {
            return await interaction.reply({ content: 'Invalid money amount!', ephemeral: true });
        }
        playerData.money += amount;
        dataManager.updatePlayerData(targetUser.id, playerData);
        return await interaction.reply({ content: `Gave ${amount} money to ${targetUser.username}!`, ephemeral: true });
    } else if (type === 'card') {
        const cards = dataManager.getCards();
        if (!cards[value]) {
            return await interaction.reply({ content: `Card "${value}" does not exist!`, ephemeral: true });
        }
        
        const newCardName = dataManager.getNextCardNumber(value, playerData.inventory);
        playerData.inventory[newCardName] = { baseName: value, rarity: cards[value].rarity };
        dataManager.updatePlayerData(targetUser.id, playerData);
        return await interaction.reply({ content: `Gave "${newCardName}" to ${targetUser.username}!`, ephemeral: true });
    }
}

async function handleShieldCode(interaction) {
    const code = interaction.options.getString('code');
    const duration = interaction.options.getInteger('duration');

    const shields = dataManager.getShields();
    shields[code] = { duration };
    dataManager.saveShields(shields);

    return await interaction.reply({ content: `Shield code "${code}" created with ${duration} hours duration.`, ephemeral: true });
}

async function handleShop(interaction) {
    const cardName = interaction.options.getString('cardname');
    const price = interaction.options.getInteger('price');
    const cards = dataManager.getCards();

    if (!cards[cardName]) {
        return await interaction.reply({ content: `Card "${cardName}" does not exist!`, ephemeral: true });
    }

    const shop = dataManager.getShop();
    shop[cardName] = { price };
    dataManager.saveShop(shop);

    return await interaction.reply({ content: `Added "${cardName}" to shop for ${price} money.`, ephemeral: true });
}

async function handleRemoveCardShop(interaction) {
    const cardName = interaction.options.getString('cardname');
    const shop = dataManager.getShop();

    if (!shop[cardName]) {
        return await interaction.reply({ content: `Card "${cardName}" is not in the shop!`, ephemeral: true });
    }

    delete shop[cardName];
    dataManager.saveShop(shop);

    return await interaction.reply({ content: `Removed "${cardName}" from shop.`, ephemeral: true });
}

async function handleRemoveCard(interaction) {
    const cardName = interaction.options.getString('cardname');
    const cards = dataManager.getCards();

    if (!cards[cardName]) {
        return await interaction.reply({ content: `Card "${cardName}" does not exist!`, ephemeral: true });
    }

    delete cards[cardName];
    dataManager.saveCards(cards);

    const players = dataManager.loadData('players.json');
    let removedCount = 0;
    
    for (const [userId, playerData] of Object.entries(players)) {
        const cardsToRemove = Object.keys(playerData.inventory).filter(card => 
            playerData.inventory[card].baseName === cardName
        );
        
        cardsToRemove.forEach(card => {
            delete playerData.inventory[card];
            playerData.income = playerData.income.filter(c => c !== card);
            playerData.attack = playerData.attack.filter(c => c !== card);
            playerData.defend = playerData.defend.filter(c => c !== card);
            playerData.locked = playerData.locked.filter(c => c !== card);
            removedCount++;
        });
    }
    
    dataManager.saveData('players.json', players);

    const shop = dataManager.getShop();
    if (shop[cardName]) {
        delete shop[cardName];
        dataManager.saveShop(shop);
    }

    const stones = dataManager.getStones();
    if (stones.default && stones.default.cards) {
        stones.default.cards = stones.default.cards.filter(c => c !== cardName);
        dataManager.saveStones(stones);
    }

    const events = dataManager.getEvents();
    for (const [eventName, eventData] of Object.entries(events)) {
        if (eventData.cards) {
            eventData.cards = eventData.cards.filter(c => c !== cardName);
        }
    }
    dataManager.saveEvents(events);

    return await interaction.reply({ 
        content: `Removed "${cardName}" from the game! Deleted ${removedCount} card instances from player inventories.`, 
        ephemeral: true 
    });
}

async function handleHitStone(interaction) {
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);
    const stones = dataManager.getStones();

    if (!stones.default || !stones.default.cards || stones.default.cards.length === 0) {
        return await interaction.reply({ content: 'The stone has no cards to drop! Contact an admin.', ephemeral: true });
    }

    if (activeMining.has(userId)) {
        return await interaction.reply({ content: 'You are already mining a stone! Wait for it to complete.', ephemeral: true });
    }

    let currentHP = STONE_HP - playerData.stoneProgress;

    const getProgressBar = (current, max) => {
        const percentage = Math.max(0, current / max);
        const filled = Math.floor(percentage * 20);
        const empty = 20 - filled;
        return '█'.repeat(filled) + '░'.repeat(empty);
    };

    const createProgressEmbed = (currentHP) => {
        const progress = STONE_HP - currentHP;
        const percentage = ((progress / STONE_HP) * 100).toFixed(1);
        
        return new EmbedBuilder()
            .setTitle('⛏️ Mining Stone...')
            .setDescription(`**HP Remaining:** ${currentHP}/${STONE_HP}\n${getProgressBar(progress, STONE_HP)}\n**Progress:** ${percentage}%\n**Damage per second:** ${playerData.damageLevel}`)
            .setColor('#FFA500')
            .setFooter({ text: 'Mining automatically...' });
    };

    await interaction.reply({ embeds: [createProgressEmbed(currentHP)] });

    activeMining.set(userId, true);

    const miningInterval = setInterval(async () => {
        try {
            const freshPlayerData = dataManager.getPlayerData(userId);
            
            if (!activeMining.has(userId)) {
                clearInterval(miningInterval);
                return;
            }

            currentHP -= freshPlayerData.damageLevel;
            freshPlayerData.stoneProgress += freshPlayerData.damageLevel;

            if (currentHP <= 0 || freshPlayerData.stoneProgress >= STONE_HP) {
                clearInterval(miningInterval);
                activeMining.delete(userId);
                
                freshPlayerData.stoneProgress = 0;
                
                const cards = dataManager.getCards();
                const availableCards = stones.default.cards.filter(cardName => cards[cardName]);
                
                if (availableCards.length === 0) {
                    dataManager.updatePlayerData(userId, freshPlayerData);
                    await interaction.editReply({ content: 'No valid cards available!', embeds: [], components: [] });
                    return;
                }

                const targetRarity = dataManager.getRandomRarity();
                const rarityFiltered = availableCards.filter(cardName => cards[cardName].rarity === targetRarity);
                const cardPool = rarityFiltered.length > 0 ? rarityFiltered : availableCards;
                const selectedCard = cardPool[Math.floor(Math.random() * cardPool.length)];
                const newCardName = dataManager.getNextCardNumber(selectedCard, freshPlayerData.inventory);
                
                freshPlayerData.inventory[newCardName] = { baseName: selectedCard, rarity: cards[selectedCard].rarity };
                dataManager.updatePlayerData(userId, freshPlayerData);

                const rewardEmbed = new EmbedBuilder()
                    .setTitle('✨ Stone Broken!')
                    .setDescription(`You received: **${newCardName}**`)
                    .addFields({ name: 'Rarity', value: cards[selectedCard].rarity, inline: true })
                    .setImage(cards[selectedCard].image)
                    .setColor(getRarityColor(cards[selectedCard].rarity));

                await interaction.editReply({ embeds: [rewardEmbed] });
            } else {
                dataManager.updatePlayerData(userId, freshPlayerData);
                await interaction.editReply({ embeds: [createProgressEmbed(currentHP)] });
            }
        } catch (error) {
            console.error('Mining error:', error);
            clearInterval(miningInterval);
            activeMining.delete(userId);
        }
    }, 1000);

    setTimeout(() => {
        if (activeMining.has(userId)) {
            clearInterval(miningInterval);
            activeMining.delete(userId);
        }
    }, 300000);
}

async function handleHitStoneEvent(interaction) {
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);
    const events = dataManager.getEvents();

    const activeEvent = Object.entries(events).find(([name, data]) => data.active);
    
    if (!activeEvent) {
        return await interaction.reply({ content: 'No active event!', ephemeral: true });
    }

    const [eventName, eventData] = activeEvent;

    const hasRequiredCards = Object.entries(playerData.inventory).filter(([cardName, cardData]) => {
        return cardData.baseName === eventData.requiredCard;
    }).length >= eventData.requiredAmount;

    if (!hasRequiredCards) {
        return await interaction.reply({ content: `You need ${eventData.requiredAmount}x ${eventData.requiredCard} to participate in this event!`, ephemeral: true });
    }

    if (!playerData.eventProgress) {
        playerData.eventProgress = 0;
    }

    playerData.eventProgress += playerData.damageLevel;

    if (playerData.eventProgress >= eventData.hp) {
        playerData.eventProgress = 0;
        
        const cards = dataManager.getCards();
        const availableCards = eventData.cards.filter(cardName => cards[cardName]);
        
        if (availableCards.length === 0) {
            return await interaction.reply({ content: 'No valid cards in this event!', ephemeral: true });
        }

        const targetRarity = dataManager.getRandomRarity();
        const rarityFiltered = availableCards.filter(cardName => cards[cardName].rarity === targetRarity);

        const cardPool = rarityFiltered.length > 0 ? rarityFiltered : availableCards;
        const selectedCard = cardPool[Math.floor(Math.random() * cardPool.length)];
        const newCardName = dataManager.getNextCardNumber(selectedCard, playerData.inventory);
        
        playerData.inventory[newCardName] = { baseName: selectedCard, rarity: cards[selectedCard].rarity };
        dataManager.updatePlayerData(userId, playerData);

        const embed = new EmbedBuilder()
            .setTitle(`Event Stone Broken! 🎉`)
            .setDescription(`You received: **${newCardName}**`)
            .addFields({ name: 'Rarity', value: cards[selectedCard].rarity, inline: true })
            .setImage(cards[selectedCard].image)
            .setColor(getRarityColor(cards[selectedCard].rarity));

        return await interaction.reply({ embeds: [embed] });
    } else {
        dataManager.updatePlayerData(userId, playerData);
        return await interaction.reply({ content: `You hit the event stone for ${playerData.damageLevel} damage! Progress: ${playerData.eventProgress}/${eventData.hp}` });
    }
}

async function handleTrade(interaction) {
    const targetUser = interaction.options.getUser('player');
    const offer = interaction.options.getString('offer');
    const request = interaction.options.getString('request');
    const userId = interaction.user.id;

    if (targetUser.id === userId) {
        return await interaction.reply({ content: 'You cannot trade with yourself!', ephemeral: true });
    }

    if (targetUser.bot) {
        return await interaction.reply({ content: 'You cannot trade with bots!', ephemeral: true });
    }

    const parseTradeItem = (item) => {
        const parts = item.split(':');
        if (parts.length !== 2) return null;
        const type = parts[0].toLowerCase();
        const value = parts[1];
        
        if (type === 'money') {
            const amount = parseInt(value);
            if (isNaN(amount) || amount <= 0) return null;
            return { type: 'money', value: amount };
        } else if (type === 'card') {
            return { type: 'card', value: value };
        }
        return null;
    };

    const offerItem = parseTradeItem(offer);
    const requestItem = parseTradeItem(request);

    if (!offerItem || !requestItem) {
        return await interaction.reply({ content: 'Invalid trade format! Use "money:100" or "card:cardname"', ephemeral: true });
    }

    const initiatorData = dataManager.getPlayerData(userId);
    const targetData = dataManager.getPlayerData(targetUser.id);

    if (offerItem.type === 'money' && initiatorData.money < offerItem.value) {
        return await interaction.reply({ content: `You don't have enough money! You need ${offerItem.value}.`, ephemeral: true });
    }

    if (offerItem.type === 'card' && !initiatorData.inventory[offerItem.value]) {
        return await interaction.reply({ content: `You don't own "${offerItem.value}"!`, ephemeral: true });
    }

    if (requestItem.type === 'money' && targetData.money < requestItem.value) {
        return await interaction.reply({ content: `${targetUser.username} doesn't have enough money!`, ephemeral: true });
    }

    if (requestItem.type === 'card' && !targetData.inventory[requestItem.value]) {
        return await interaction.reply({ content: `${targetUser.username} doesn't own "${requestItem.value}"!`, ephemeral: true });
    }

    const acceptButton = new ButtonBuilder()
        .setCustomId('trade_accept')
        .setLabel('Accept Trade')
        .setStyle(ButtonStyle.Success);

    const declineButton = new ButtonBuilder()
        .setCustomId('trade_decline')
        .setLabel('Decline Trade')
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(acceptButton, declineButton);

    const offerText = offerItem.type === 'money' ? `${offerItem.value} money` : `card "${offerItem.value}"`;
    const requestText = requestItem.type === 'money' ? `${requestItem.value} money` : `card "${requestItem.value}"`;

    const embed = new EmbedBuilder()
        .setTitle('Trade Proposal')
        .setDescription(`${interaction.user.username} wants to trade with ${targetUser.username}`)
        .addFields(
            { name: `${interaction.user.username} offers:`, value: offerText, inline: true },
            { name: `${targetUser.username} gives:`, value: requestText, inline: true }
        )
        .setColor('#FFD700')
        .setFooter({ text: `${targetUser.username}, click Accept or Decline` });

    const response = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    const collector = response.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async i => {
        if (i.user.id !== targetUser.id) {
            await i.reply({ content: 'Only the trade recipient can accept or decline this trade!', ephemeral: true });
            return;
        }

        if (i.customId === 'trade_accept') {
            const freshInitiatorData = dataManager.getPlayerData(userId);
            const freshTargetData = dataManager.getPlayerData(targetUser.id);

            if (offerItem.type === 'money' && freshInitiatorData.money < offerItem.value) {
                await i.update({ content: 'Trade failed: Initiator no longer has enough money!', embeds: [], components: [] });
                collector.stop();
                return;
            }

            if (offerItem.type === 'card' && !freshInitiatorData.inventory[offerItem.value]) {
                await i.update({ content: 'Trade failed: Initiator no longer owns the card!', embeds: [], components: [] });
                collector.stop();
                return;
            }

            if (requestItem.type === 'money' && freshTargetData.money < requestItem.value) {
                await i.update({ content: 'Trade failed: You no longer have enough money!', embeds: [], components: [] });
                collector.stop();
                return;
            }

            if (requestItem.type === 'card' && !freshTargetData.inventory[requestItem.value]) {
                await i.update({ content: 'Trade failed: You no longer own the card!', embeds: [], components: [] });
                collector.stop();
                return;
            }

            if (offerItem.type === 'money') {
                freshInitiatorData.money -= offerItem.value;
                freshTargetData.money += offerItem.value;
            } else {
                const cardData = freshInitiatorData.inventory[offerItem.value];
                delete freshInitiatorData.inventory[offerItem.value];
                freshInitiatorData.income = freshInitiatorData.income.filter(c => c !== offerItem.value);
                freshInitiatorData.attack = freshInitiatorData.attack.filter(c => c !== offerItem.value);
                freshInitiatorData.defend = freshInitiatorData.defend.filter(c => c !== offerItem.value);
                freshInitiatorData.locked = freshInitiatorData.locked.filter(c => c !== offerItem.value);
                
                const newCardName = dataManager.getNextCardNumber(cardData.baseName, freshTargetData.inventory);
                freshTargetData.inventory[newCardName] = cardData;
            }

            if (requestItem.type === 'money') {
                freshTargetData.money -= requestItem.value;
                freshInitiatorData.money += requestItem.value;
            } else {
                const cardData = freshTargetData.inventory[requestItem.value];
                delete freshTargetData.inventory[requestItem.value];
                freshTargetData.income = freshTargetData.income.filter(c => c !== requestItem.value);
                freshTargetData.attack = freshTargetData.attack.filter(c => c !== requestItem.value);
                freshTargetData.defend = freshTargetData.defend.filter(c => c !== requestItem.value);
                freshTargetData.locked = freshTargetData.locked.filter(c => c !== requestItem.value);
                
                const newCardName = dataManager.getNextCardNumber(cardData.baseName, freshInitiatorData.inventory);
                freshInitiatorData.inventory[newCardName] = cardData;
            }

            dataManager.updatePlayerData(userId, freshInitiatorData);
            dataManager.updatePlayerData(targetUser.id, freshTargetData);

            await i.update({ content: '✅ Trade completed successfully!', embeds: [], components: [] });
            collector.stop();
        } else if (i.customId === 'trade_decline') {
            await i.update({ content: '❌ Trade declined.', embeds: [], components: [] });
            collector.stop();
        }
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            interaction.editReply({ content: '⏱️ Trade expired (60 seconds).', embeds: [], components: [] });
        }
    });
}

async function handleSetIncome(interaction) {
    const cardName = interaction.options.getString('cardname');
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);

    if (!playerData.inventory[cardName]) {
        return await interaction.reply({ content: `You don't own "${cardName}"!`, ephemeral: true });
    }

    if (playerData.attack.includes(cardName) || playerData.defend.includes(cardName)) {
        return await interaction.reply({ content: 'This card is already in another set!', ephemeral: true });
    }

    if (playerData.income.includes(cardName)) {
        return await interaction.reply({ content: 'This card is already in your income set!', ephemeral: true });
    }

    if (playerData.income.length >= 10) {
        return await interaction.reply({ content: 'Income set is full (max 10 cards)!', ephemeral: true });
    }

    playerData.income.push(cardName);
    dataManager.updatePlayerData(userId, playerData);

    return await interaction.reply({ content: `Added "${cardName}" to income set!` });
}

async function handleSetAttack(interaction) {
    const cardName = interaction.options.getString('cardname');
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);

    if (!playerData.inventory[cardName]) {
        return await interaction.reply({ content: `You don't own "${cardName}"!`, ephemeral: true });
    }

    if (playerData.income.includes(cardName) || playerData.defend.includes(cardName)) {
        return await interaction.reply({ content: 'This card is already in another set!', ephemeral: true });
    }

    if (playerData.attack.includes(cardName)) {
        return await interaction.reply({ content: 'This card is already in your attack set!', ephemeral: true });
    }

    if (playerData.attack.length >= 10) {
        return await interaction.reply({ content: 'Attack set is full (max 10 cards)!', ephemeral: true });
    }

    playerData.attack.push(cardName);
    dataManager.updatePlayerData(userId, playerData);

    return await interaction.reply({ content: `Added "${cardName}" to attack set!` });
}

async function handleSetDefend(interaction) {
    const cardName = interaction.options.getString('cardname');
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);

    if (!playerData.inventory[cardName]) {
        return await interaction.reply({ content: `You don't own "${cardName}"!`, ephemeral: true });
    }

    if (playerData.income.includes(cardName) || playerData.attack.includes(cardName)) {
        return await interaction.reply({ content: 'This card is already in another set!', ephemeral: true });
    }

    if (playerData.defend.includes(cardName)) {
        return await interaction.reply({ content: 'This card is already in your defense set!', ephemeral: true });
    }

    if (playerData.defend.length >= 10) {
        return await interaction.reply({ content: 'Defense set is full (max 10 cards)!', ephemeral: true });
    }

    playerData.defend.push(cardName);
    dataManager.updatePlayerData(userId, playerData);

    return await interaction.reply({ content: `Added "${cardName}" to defense set!` });
}

async function handleResetSetIncome(interaction) {
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);
    playerData.income = [];
    dataManager.updatePlayerData(userId, playerData);
    return await interaction.reply({ content: 'Income set cleared!' });
}

async function handleResetSetAttack(interaction) {
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);
    playerData.attack = [];
    dataManager.updatePlayerData(userId, playerData);
    return await interaction.reply({ content: 'Attack set cleared!' });
}

async function handleResetSetDefend(interaction) {
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);
    playerData.defend = [];
    dataManager.updatePlayerData(userId, playerData);
    return await interaction.reply({ content: 'Defense set cleared!' });
}

async function handleAttack(interaction) {
    const targetUser = interaction.options.getUser('player');
    const pick = interaction.options.getInteger('pick');
    const userId = interaction.user.id;

    if (targetUser.id === userId) {
        return await interaction.reply({ content: 'You cannot attack yourself!', ephemeral: true });
    }

    const attackerData = dataManager.getPlayerData(userId);
    const defenderData = dataManager.getPlayerData(targetUser.id);

    if (defenderData.activeShield && new Date(defenderData.activeShield) > new Date()) {
        return await interaction.reply({ content: `${targetUser.username} is protected by a shield!`, ephemeral: true });
    }

    const cards = dataManager.getCards();
    let attackPower = 0;
    let defensePower = 0;

    attackerData.attack.forEach(cardName => {
        const baseName = attackerData.inventory[cardName]?.baseName;
        if (baseName && cards[baseName]) {
            attackPower += cards[baseName].value;
        }
    });

    defenderData.defend.forEach(cardName => {
        const baseName = defenderData.inventory[cardName]?.baseName;
        if (baseName && cards[baseName]) {
            defensePower += cards[baseName].value;
        }
    });

    const attackWins = attackPower > defensePower;

    if (attackWins) {
        const rewards = [10, 25, 50];
        const randomNumbers = [];
        for (let i = 0; i < 3; i++) {
            randomNumbers.push(Math.floor(Math.random() * 10) + 1);
        }

        let reward = 0;
        if (randomNumbers.includes(pick)) {
            const rewardIndex = randomNumbers.indexOf(pick);
            const rewardPercent = rewards[rewardIndex];
            reward = Math.floor(defenderData.money * (rewardPercent / 100));
            
            defenderData.money -= reward;
            attackerData.money += reward;

            dataManager.updatePlayerData(userId, attackerData);
            dataManager.updatePlayerData(targetUser.id, defenderData);

            return await interaction.reply({ 
                content: `🎉 You won! You picked number ${pick} which was one of ${randomNumbers.join(', ')}! You received ${reward} money (${rewards[rewardIndex]}% of defender's money)!` 
            });
        } else {
            return await interaction.reply({ 
                content: `You won the battle, but your pick (${pick}) wasn't in ${randomNumbers.join(', ')}! No reward this time.` 
            });
        }
    } else {
        return await interaction.reply({ 
            content: `You lost! Your attack power (${attackPower}) was not enough to overcome their defense (${defensePower}).` 
        });
    }
}

async function handleUseShield(interaction) {
    const code = interaction.options.getString('code');
    const userId = interaction.user.id;
    const shields = dataManager.getShields();

    if (!shields[code]) {
        return await interaction.reply({ content: 'Invalid shield code!', ephemeral: true });
    }

    const playerData = dataManager.getPlayerData(userId);
    const shieldExpiry = new Date();
    shieldExpiry.setHours(shieldExpiry.getHours() + shields[code].duration);
    
    playerData.activeShield = shieldExpiry.toISOString();
    dataManager.updatePlayerData(userId, playerData);

    return await interaction.reply({ content: `Shield activated for ${shields[code].duration} hours!` });
}

async function handleUpgrade(interaction) {
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);
    
    if (!playerData.upgradeCount) {
        playerData.upgradeCount = 0;
    }
    
    const baseCost = 10000000 + (playerData.upgradeCount * 10000000);
    const randomAddition = Math.floor(Math.random() * 90000000);
    const cost = baseCost + randomAddition;

    if (playerData.money < cost) {
        return await interaction.reply({ content: `Not enough money! Upgrade costs ${cost.toLocaleString()}.`, ephemeral: true });
    }

    playerData.money -= cost;
    
    const failChance = Math.random();
    if (failChance < 0.3) {
        dataManager.updatePlayerData(userId, playerData);
        return await interaction.reply({ content: `❌ Upgrade failed! You lost ${cost.toLocaleString()} coins but your damage remains at ${playerData.damageLevel}.` });
    }
    
    playerData.damageLevel += 1;
    playerData.upgradeCount += 1;
    dataManager.updatePlayerData(userId, playerData);

    return await interaction.reply({ content: `✅ Upgrade successful! Your damage is now ${playerData.damageLevel}. Cost: ${cost.toLocaleString()}\n\nNext upgrade will cost between ${(baseCost + 10000000).toLocaleString()} and ${(baseCost + 10000000 + 90000000).toLocaleString()}.` });
}

async function handleContract(interaction) {
    const rarity = interaction.options.getString('rarity');
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);
    const cards = dataManager.getCards();

    const nextRarity = dataManager.RARITIES[rarity]?.nextRarity;
    if (!nextRarity) {
        return await interaction.reply({ content: 'Cannot upgrade from this rarity!', ephemeral: true });
    }

    const cardsOfRarity = Object.entries(playerData.inventory).filter(([cardName, cardData]) => {
        return cardData.rarity === rarity && !playerData.locked.includes(cardName);
    });

    if (cardsOfRarity.length < 100) {
        return await interaction.reply({ content: `You need 100 unlocked ${rarity} cards! You have ${cardsOfRarity.length}.`, ephemeral: true });
    }

    for (let i = 0; i < 100; i++) {
        delete playerData.inventory[cardsOfRarity[i][0]];
        playerData.income = playerData.income.filter(c => c !== cardsOfRarity[i][0]);
        playerData.attack = playerData.attack.filter(c => c !== cardsOfRarity[i][0]);
        playerData.defend = playerData.defend.filter(c => c !== cardsOfRarity[i][0]);
    }

    const higherRarityCards = Object.keys(cards).filter(cardName => cards[cardName].rarity === nextRarity);
    
    if (higherRarityCards.length === 0) {
        return await interaction.reply({ content: `No ${nextRarity} cards exist yet!`, ephemeral: true });
    }

    const selectedCard = higherRarityCards[Math.floor(Math.random() * higherRarityCards.length)];
    const newCardName = dataManager.getNextCardNumber(selectedCard, playerData.inventory);
    
    playerData.inventory[newCardName] = { baseName: selectedCard, rarity: cards[selectedCard].rarity };
    dataManager.updatePlayerData(userId, playerData);

    const embed = new EmbedBuilder()
        .setTitle('Contract Complete! 🎉')
        .setDescription(`You exchanged 100 ${rarity} cards for: **${newCardName}**`)
        .addFields({ name: 'Rarity', value: nextRarity, inline: true })
        .setImage(cards[selectedCard].image)
        .setColor(getRarityColor(nextRarity));

    return await interaction.reply({ embeds: [embed] });
}

async function handleLock(interaction) {
    const cardName = interaction.options.getString('cardname');
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);

    if (!playerData.inventory[cardName]) {
        return await interaction.reply({ content: `You don't own "${cardName}"!`, ephemeral: true });
    }

    if (playerData.locked.includes(cardName)) {
        return await interaction.reply({ content: 'This card is already locked!', ephemeral: true });
    }

    playerData.locked.push(cardName);
    dataManager.updatePlayerData(userId, playerData);

    return await interaction.reply({ content: `Locked "${cardName}"!` });
}

async function handleUnlock(interaction) {
    const cardName = interaction.options.getString('cardname');
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);

    if (!playerData.locked.includes(cardName)) {
        return await interaction.reply({ content: 'This card is not locked!', ephemeral: true });
    }

    playerData.locked = playerData.locked.filter(c => c !== cardName);
    dataManager.updatePlayerData(userId, playerData);

    return await interaction.reply({ content: `Unlocked "${cardName}"!` });
}

async function handleShopList(interaction) {
    const shop = dataManager.getShop();
    
    if (Object.keys(shop).length === 0) {
        return await interaction.reply({ content: 'The shop is empty!', ephemeral: true });
    }

    const embed = new EmbedBuilder()
        .setTitle('🛒 Shop')
        .setColor('#00ff00');

    for (const [cardName, data] of Object.entries(shop)) {
        embed.addFields({ name: cardName, value: `Price: ${data.price}`, inline: true });
    }

    return await interaction.reply({ embeds: [embed] });
}

async function handleShopBuy(interaction) {
    const cardName = interaction.options.getString('cardname');
    const userId = interaction.user.id;
    const shop = dataManager.getShop();
    const cards = dataManager.getCards();

    if (!shop[cardName]) {
        return await interaction.reply({ content: `"${cardName}" is not in the shop!`, ephemeral: true });
    }

    const playerData = dataManager.getPlayerData(userId);
    const price = shop[cardName].price;

    if (playerData.money < price) {
        return await interaction.reply({ content: `Not enough money! You need ${price}.`, ephemeral: true });
    }

    playerData.money -= price;
    const newCardName = dataManager.getNextCardNumber(cardName, playerData.inventory);
    playerData.inventory[newCardName] = { baseName: cardName, rarity: cards[cardName].rarity };
    dataManager.updatePlayerData(userId, playerData);

    return await interaction.reply({ content: `Purchased "${newCardName}" for ${price}!` });
}

async function handleViewCard(interaction) {
    const cardName = interaction.options.getString('cardname');
    const cards = dataManager.getCards();
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);

    let baseName = cardName;
    if (playerData.inventory[cardName]) {
        baseName = playerData.inventory[cardName].baseName;
    }

    if (!cards[baseName]) {
        return await interaction.reply({ content: `Card "${cardName}" does not exist!`, ephemeral: true });
    }

    const card = cards[baseName];
    const embed = new EmbedBuilder()
        .setTitle(baseName)
        .addFields(
            { name: 'Rarity', value: card.rarity, inline: true },
            { name: 'Value', value: card.value.toString(), inline: true }
        )
        .setImage(card.image)
        .setColor(getRarityColor(card.rarity));

    return await interaction.reply({ embeds: [embed] });
}

async function handleViewAttackSet(interaction) {
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);

    if (playerData.attack.length === 0) {
        return await interaction.reply({ content: 'Your attack set is empty!', ephemeral: true });
    }

    const line1 = playerData.attack.slice(0, 5).join(', ');
    const line2 = playerData.attack.slice(5, 10).join(', ');

    return await interaction.reply({ content: `**Attack Lineup:**\n${line1}\n${line2}` });
}

async function handleViewDefendSet(interaction) {
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);

    if (playerData.defend.length === 0) {
        return await interaction.reply({ content: 'Your defense set is empty!', ephemeral: true });
    }

    const line1 = playerData.defend.slice(0, 5).join(', ');
    const line2 = playerData.defend.slice(5, 10).join(', ');

    return await interaction.reply({ content: `**Defense Lineup:**\n${line1}\n${line2}` });
}

async function handleViewLock(interaction) {
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);

    if (playerData.locked.length === 0) {
        return await interaction.reply({ content: 'You have no locked cards!', ephemeral: true });
    }

    return await interaction.reply({ content: `**Locked Cards:**\n${playerData.locked.join(', ')}` });
}

async function handleBalance(interaction) {
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);

    return await interaction.reply({ content: `💰 Your balance: ${playerData.money}` });
}

async function handleInventory(interaction) {
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);

    if (Object.keys(playerData.inventory).length === 0) {
        return await interaction.reply({ content: 'Your inventory is empty!', ephemeral: true });
    }

    const embed = new EmbedBuilder()
        .setTitle('📦 Your Inventory')
        .setColor('#0099ff');

    const cardsByRarity = {};
    for (const [cardName, cardData] of Object.entries(playerData.inventory)) {
        if (!cardsByRarity[cardData.rarity]) {
            cardsByRarity[cardData.rarity] = [];
        }
        cardsByRarity[cardData.rarity].push(cardName);
    }

    for (const [rarity, cardNames] of Object.entries(cardsByRarity)) {
        embed.addFields({ name: `${rarity} (${cardNames.length})`, value: cardNames.join(', ').substring(0, 1024), inline: false });
    }

    return await interaction.reply({ embeds: [embed] });
}

async function handleMyCollection(interaction) {
    const userId = interaction.user.id;
    const playerData = dataManager.getPlayerData(userId);
    const cards = dataManager.getCards();

    if (Object.keys(playerData.inventory).length === 0) {
        return await interaction.reply({ content: 'Your collection is empty!', ephemeral: true });
    }

    const cardList = Object.entries(playerData.inventory).map(([cardName, cardData]) => {
        const baseCard = cards[cardData.baseName];
        return {
            name: cardName,
            baseName: cardData.baseName,
            value: baseCard ? baseCard.value : 0,
            rarity: cardData.rarity
        };
    });

    cardList.sort((a, b) => b.value - a.value);

    const embed = new EmbedBuilder()
        .setTitle('💎 Your Collection (Sorted by Value)')
        .setColor('#FFD700');

    let description = '';
    cardList.forEach((card, index) => {
        description += `${index + 1}. **${card.name}** (${card.rarity}) - Value: ${card.value}\n`;
    });

    if (description.length > 4096) {
        description = description.substring(0, 4090) + '...';
    }

    embed.setDescription(description);

    return await interaction.reply({ embeds: [embed] });
}

function getRarityColor(rarity) {
    const colors = {
        common: '#808080',
        rare: '#0099ff',
        epic: '#9b59b6',
        legendary: '#f39c12',
        mythic: '#e74c3c',
        unique: '#1abc9c'
    };
    return colors[rarity] || '#ffffff';
}

module.exports = { handleCommand };
