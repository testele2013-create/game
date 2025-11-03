# Discord Card Game Bot

A Discord bot for a card collection and battling game with automated mining mechanics.

## Features

- **Automated Stone Mining**: `/hitstone` now deals damage per second automatically until the stone breaks
- **Card Collection**: Collect cards of various rarities (common, rare, epic, legendary, mythic, unique)
- **Trading System**: Trade cards and money with other players
- **PvP Combat**: Attack other players with your card lineup
- **Passive Income**: Set cards for passive money generation
- **Card Contracts**: Exchange 100 cards for higher rarity
- **Shop System**: Buy and sell cards
- **Event Stones**: Special limited-time mining events

## Setup

1. Create a Discord bot at [Discord Developer Portal](https://discord.com/developers/applications)
2. Get your bot token and application ID
3. Set up environment variables:
   - `DISCORD_BOT_TOKEN` - Your bot token
   - `DISCORD_APPLICATION_ID` - Your application ID
4. Install dependencies: `npm install`
5. Run the bot: `npm start`

## Commands

### Admin Commands
- `/addcard` - Create a new card
- `/hitstoneadd` - Add card to default stone drops
- `/create` - Create an event stone
- `/eventcards` - Add cards to event drop pool
- `/start` - Start an event
- `/stop` - Stop an event
- `/give` - Give player money or cards
- `/shieldcode` - Create shield code
- `/shop` - Add card to shop
- `/removecardshop` - Remove card from shop

### Player Commands
- `/hitstone` - Mine the stone automatically (deals damage per second)
- `/hitstonevent` - Hit event stone
- `/upgrade` - Upgrade stone damage
- `/balance` - View your money
- `/inventory` - View your cards
- `/setincome` - Set card for passive income
- `/setattack` - Set card for attack lineup
- `/setdefend` - Set card for defense lineup
- `/attack` - Attack another player
- `/trade` - Trade with another player
- `/contract` - Exchange 100 cards for higher rarity
- `/lock` / `/unlock` - Lock/unlock cards from contracts
- `/shoplist` - View shop
- `/shopbuy` - Buy from shop
- `/viewcard` - View card details
- `/useshield` - Activate shield protection

## Key Changes in `/hitstone`

The `/hitstone` command now features:
- **Automatic Mining**: Deals damage every second based on your damage level
- **Real-time Progress**: Shows HP remaining, progress bar, and percentage
- **Visual Updates**: Discord embed updates every second with current status
- **Session Protection**: Prevents starting multiple mining sessions simultaneously
- **Auto-completion**: Stone automatically breaks at 0 HP and awards a card
- **Damage Scaling**: Higher damage levels mine faster

Stone HP: 170  
Default Damage: 1 per second  
Upgrade to increase damage!
