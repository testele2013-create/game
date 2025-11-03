const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const dataManager = require('./utils/dataManager');
const http = require('http');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

const ADMIN_ROLE = 'Admin';
const STONE_HP = 170;

// Simple HTTP server for Replit health check
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Discord Card Game Bot</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
                h1 { color: #5865F2; }
                .status { padding: 10px; background: #43B581; color: white; border-radius: 5px; display: inline-block; }
                .info { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
                code { background: #e0e0e0; padding: 2px 6px; border-radius: 3px; }
            </style>
        </head>
        <body>
            <h1>🎮 Discord Card Game Bot</h1>
            <div class="status">✅ Bot is running</div>
            <div class="info">
                <h2>Features</h2>
                <ul>
                    <li><strong>Automated Mining:</strong> <code>/hitstone</code> now deals damage per second automatically</li>
                    <li><strong>Real-time Progress:</strong> Live HP tracking with progress bars</li>
                    <li><strong>Card Collection:</strong> Collect cards across 6 rarity tiers</li>
                    <li><strong>PvP Combat:</strong> Battle other players</li>
                    <li><strong>Trading System:</strong> Trade cards and currency</li>
                    <li><strong>Passive Income:</strong> Set cards for automatic money generation</li>
                </ul>
                <h2>Getting Started</h2>
                <p>Use <code>/hitstone</code> in Discord to start mining! The bot will automatically mine the stone and show you real-time progress.</p>
            </div>
        </body>
        </html>
    `);
});

server.listen(5000, '0.0.0.0', () => {
    console.log('Health check server running on port 5000');
});

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    await registerCommands();
    
    startPassiveIncome();
    startMathChallengeSystem();
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
            .setDescription('Break the stone to get cards (auto-mines over time)'),
        
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
            .setDescription('View your card inventory'),

        new SlashCommandBuilder()
            .setName('removecard')
            .setDescription('[Admin] Remove a card from the entire game')
            .addStringOption(option => option.setName('cardname').setDescription('Card name to remove').setRequired(true)),

        new SlashCommandBuilder()
            .setName('mycollection')
            .setDescription('View your collection sorted by card value')
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

let mathChallenge = null;

function startMathChallengeSystem() {
    setInterval(async () => {
        const num1 = Math.floor(Math.random() * 100) + 1;
        const num2 = Math.floor(Math.random() * 100) + 1;
        const operation = Math.random() < 0.5 ? '+' : '-';
        const correctAnswer = operation === '+' ? num1 + num2 : num1 - num2;
        
        const wrongAnswer1 = correctAnswer + Math.floor(Math.random() * 10) + 1;
        const wrongAnswer2 = correctAnswer - Math.floor(Math.random() * 10) - 1;
        
        const answers = [correctAnswer, wrongAnswer1, wrongAnswer2].sort(() => Math.random() - 0.5);
        
        mathChallenge = {
            question: `${num1} ${operation} ${num2}`,
            answer: correctAnswer,
            timestamp: Date.now()
        };
        
        console.log(`Math challenge created: ${mathChallenge.question} = ${mathChallenge.answer}`);
        
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`math_${answers[0]}`)
                    .setLabel(`${answers[0]}`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`math_${answers[1]}`)
                    .setLabel(`${answers[1]}`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`math_${answers[2]}`)
                    .setLabel(`${answers[2]}`)
                    .setStyle(ButtonStyle.Primary)
            );
        
        client.guilds.cache.forEach(async guild => {
            const channel = guild.channels.cache.find(ch => ch.name === 'general' || ch.isTextBased());
            if (channel && channel.isTextBased()) {
                await channel.send({
                    content: `🧮 **Math Challenge!** Solve this problem and win 1,000,000 coins!\n\n**${mathChallenge.question} = ?**\n\nClick the correct answer below!`,
                    components: [row]
                });
            }
        });
    }, 300000);
}

client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId.startsWith('math_')) {
        if (!mathChallenge) {
            return await interaction.reply({ content: 'This challenge has already been solved!', ephemeral: true });
        }
        
        const userAnswer = parseInt(interaction.customId.replace('math_', ''));
        
        if (userAnswer === mathChallenge.answer) {
            const playerData = dataManager.getPlayerData(interaction.user.id);
            playerData.money += 1000000;
            dataManager.updatePlayerData(interaction.user.id, playerData);
            
            await interaction.update({ 
                content: `🎉 ${interaction.user.username} answered correctly! **${mathChallenge.question} = ${mathChallenge.answer}**\n\nThey won 1,000,000 coins! 💰`,
                components: []
            });
            mathChallenge = null;
        } else {
            await interaction.reply({ content: `❌ Wrong answer! Try again!`, ephemeral: true });
        }
        return;
    }
    
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
