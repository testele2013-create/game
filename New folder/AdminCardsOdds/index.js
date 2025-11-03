const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const dataManager = require('./utils/dataManager');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

const ADMIN_ROLE = 'Admin';
const STONE_HP = 170;

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    await registerCommands();
    
    startPassiveIncome();
});

async function registerCommands() {
    const commands = [
        new SlashCommandBuilder()
            .setName('addcard')
            .setDescription('[Admin] Create a new card')
            .addStringOption(option => option.setName('name').setDescription('Card name').setRequired(true))
            .addStringOption(option => option.setName('image').setDescription('Imgur link').setRequired(true))
            .addIntegerOption(option => option.setName('value').setDescription('Value (income/attack/defend power)').setRequired(true))
            .addStringOption(option => option.setName('rarity').setDescription('Rarity').setRequired(true)
                .addChoices(
                    { name: 'common', value: 'common' },
                    { name: 'rare', value: 'rare' },
                    { name: 'epic', value: 'epic' },
                    { name: 'legendary', value: 'legendary' },
                    { name: 'mythic', value: 'mythic' },
                    { name: 'unique', value: 'unique' }
                )),
        
        new SlashCommandBuilder()
            .setName('hitstoneadd')
            .setDescription('[Admin] Add card to default stone drops')
            .addStringOption(option => option.setName('cardname').setDescription('Card name').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('create')
            .setDescription('[Admin] Create an event')
            .addStringOption(option => option.setName('eventname').setDescription('Event name').setRequired(true))
            .addIntegerOption(option => option.setName('hp').setDescription('Stone HP').setRequired(true))
            .addStringOption(option => option.setName('requiredcard').setDescription('Required card name').setRequired(true))
            .addIntegerOption(option => option.setName('amount').setDescription('Required amount').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('eventcards')
            .setDescription('[Admin] Add cards to event drop pool')
            .addStringOption(option => option.setName('eventname').setDescription('Event name').setRequired(true))
            .addStringOption(option => option.setName('cardname').setDescription('Card name to add').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('start')
            .setDescription('[Admin] Start an event')
            .addStringOption(option => option.setName('eventname').setDescription('Event name').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('stop')
            .setDescription('[Admin] Stop an event')
            .addStringOption(option => option.setName('eventname').setDescription('Event name').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('give')
            .setDescription('[Admin] Give player money or cards')
            .addUserOption(option => option.setName('player').setDescription('Target player').setRequired(true))
            .addStringOption(option => option.setName('type').setDescription('Give type').setRequired(true)
                .addChoices(
                    { name: 'money', value: 'money' },
                    { name: 'card', value: 'card' }
                ))
            .addStringOption(option => option.setName('value').setDescription('Amount (for money) or card name (for card)').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('shieldcode')
            .setDescription('[Admin] Create shield code')
            .addStringOption(option => option.setName('code').setDescription('Shield code').setRequired(true))
            .addIntegerOption(option => option.setName('duration').setDescription('Duration in hours').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('shop')
            .setDescription('[Admin] Add card to shop')
            .addStringOption(option => option.setName('cardname').setDescription('Card name').setRequired(true))
            .addIntegerOption(option => option.setName('price').setDescription('Price').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('removecardshop')
            .setDescription('[Admin] Remove card from shop')
            .addStringOption(option => option.setName('cardname').setDescription('Card name').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('hitstone')
            .setDescription('Break the stone to get cards'),
        
        new SlashCommandBuilder()
            .setName('hitstonevent')
            .setDescription('Break event stone to get cards'),
        
        new SlashCommandBuilder()
            .setName('trade')
            .setDescription('Trade with another player')
            .addUserOption(option => option.setName('player').setDescription('Player to trade with').setRequired(true))
            .addStringOption(option => option.setName('offer').setDescription('What you offer (money:100 or card:cardname)').setRequired(true))
            .addStringOption(option => option.setName('request').setDescription('What you want (money:100 or card:cardname)').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('setincome')
            .setDescription('Set card for passive income')
            .addStringOption(option => option.setName('cardname').setDescription('Card name').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('setattack')
            .setDescription('Set card for attack lineup')
            .addStringOption(option => option.setName('cardname').setDescription('Card name').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('setdefend')
            .setDescription('Set card for defense lineup')
            .addStringOption(option => option.setName('cardname').setDescription('Card name').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('resetsetincome')
            .setDescription('Remove all cards from income lineup'),
        
        new SlashCommandBuilder()
            .setName('resetsetattack')
            .setDescription('Remove all cards from attack lineup'),
        
        new SlashCommandBuilder()
            .setName('resetsetdefend')
            .setDescription('Remove all cards from defense lineup'),
        
        new SlashCommandBuilder()
            .setName('attack')
            .setDescription('Attack another player')
            .addUserOption(option => option.setName('player').setDescription('Player to attack').setRequired(true))
            .addIntegerOption(option => option.setName('pick').setDescription('Pick a number 1-10').setRequired(true).setMinValue(1).setMaxValue(10)),
        
        new SlashCommandBuilder()
            .setName('useshield')
            .setDescription('Activate shield protection')
            .addStringOption(option => option.setName('code').setDescription('Shield code').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('upgrade')
            .setDescription('Upgrade stone damage'),
        
        new SlashCommandBuilder()
            .setName('contract')
            .setDescription('Exchange 100 cards for higher rarity')
            .addStringOption(option => option.setName('rarity').setDescription('Rarity to exchange').setRequired(true)
                .addChoices(
                    { name: 'common', value: 'common' },
                    { name: 'rare', value: 'rare' },
                    { name: 'epic', value: 'epic' },
                    { name: 'legendary', value: 'legendary' },
                    { name: 'mythic', value: 'mythic' }
                )),
        
        new SlashCommandBuilder()
            .setName('lock')
            .setDescription('Lock a card from contracts')
            .addStringOption(option => option.setName('cardname').setDescription('Card name').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('unlock')
            .setDescription('Unlock a card')
            .addStringOption(option => option.setName('cardname').setDescription('Card name').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('shoplist')
            .setDescription('View available cards in shop'),
        
        new SlashCommandBuilder()
            .setName('shopbuy')
            .setDescription('Buy a card from shop')
            .addStringOption(option => option.setName('cardname').setDescription('Card name').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('viewcard')
            .setDescription('View card image')
            .addStringOption(option => option.setName('cardname').setDescription('Card name').setRequired(true)),
        
        new SlashCommandBuilder()
            .setName('viewattackset')
            .setDescription('View your attack lineup'),
        
        new SlashCommandBuilder()
            .setName('viewdefendset')
            .setDescription('View your defense lineup'),
        
        new SlashCommandBuilder()
            .setName('viewlock')
            .setDescription('View your locked cards'),

        new SlashCommandBuilder()
            .setName('balance')
            .setDescription('View your money balance'),

        new SlashCommandBuilder()
            .setName('inventory')
            .setDescription('View your card inventory')
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
}

function isAdmin(interaction) {
    return interaction.member.permissions.has(PermissionFlagsBits.Administrator);
}

function startPassiveIncome() {
    setInterval(() => {
        const players = dataManager.loadData('players.json');
        const cards = dataManager.getCards();
        
        for (const [userId, playerData] of Object.entries(players)) {
            if (playerData.income && playerData.income.length > 0) {
                let totalIncome = 0;
                playerData.income.forEach(cardName => {
                    const cardBase = Object.keys(cards).find(k => cardName.startsWith(k));
                    if (cardBase && cards[cardBase]) {
                        totalIncome += cards[cardBase].value;
                    }
                });
                
                playerData.money += totalIncome;
            }
        }
        
        dataManager.saveData('players.json', players);
    }, 1000);
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    try {
        const commandHandlers = require('./commands/handlers');
        await commandHandlers.handleCommand(interaction, isAdmin(interaction));
    } catch (error) {
        console.error('Error handling command:', error);
        const reply = { content: 'An error occurred while executing this command.', ephemeral: true };
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp(reply);
        } else {
            await interaction.reply(reply);
        }
    }
});

if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_APPLICATION_ID) {
    console.error('Missing DISCORD_BOT_TOKEN or DISCORD_APPLICATION_ID environment variables');
    console.log('Please set up your Discord bot token using the Discord integration in Replit');
    process.exit(1);
}

client.login(process.env.DISCORD_BOT_TOKEN);
