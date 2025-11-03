# Discord Card Collection & Battling Game Bot

## Overview
A Discord bot for a card collection and battling game with stone breaking mechanics, PvP combat, trading, passive income, and rarity-based progression system. Players collect cards by breaking stones, organize them into lineups for attack/defense/income, and engage in player-versus-player battles.

## Recent Changes
- **2025-11-03**: Initial project setup with all core features implemented
  - Created Discord bot with slash commands
  - Implemented JSON file-based data persistence
  - Added all admin and player commands
  - Set up passive income system
  - Implemented card rarity system with weighted drops

## Project Architecture
- **index.js**: Main bot file with Discord client setup and command registration
- **utils/dataManager.js**: Data persistence layer handling JSON file operations for players, cards, shop, events, shields, and stones
- **commands/handlers.js**: Command logic for all admin and player commands
- **data/**: Directory for JSON data files (gitignored)

## User Preferences
- Using Discord.js v14 for slash commands
- JSON file storage for data persistence
- Modular command structure for maintainability

## Tech Stack
- Node.js 20
- Discord.js 14
- Axios for image validation
- JSON file storage

## Game Features

### Card Rarity System
- Common: 60% drop chance
- Rare: 30% drop chance
- Epic: 10% drop chance
- Legendary: 4% drop chance
- Mythic: 2% drop chance
- Unique: 0.2% drop chance

### Admin Commands
- `/addcard` - Create new cards with name, image, value, and rarity
- `/hitstoneadd` - Add cards to default stone drop pool
- `/create` - Create events with custom stone HP and card requirements
- `/eventcards` - Add cards to event drop pools
- `/start` / `/stop` - Control event activation
- `/give` - Give players money or cards
- `/shieldcode` - Create shield codes for attack protection
- `/shop` / `/removecardshop` - Manage shop inventory

### Player Commands
- `/hitstone` - Break stones (170 HP) to earn cards
- `/hitstonevent` - Break event stones (requires specific cards)
- `/upgrade` - Increase stone damage (costs random 10k-100k)
- `/setincome` / `/setattack` / `/setdefend` - Organize cards into lineups (max 10 each)
- `/resetsetincome` / `/resetsetattack` / `/resetsetdefend` - Clear lineups
- `/attack` - PvP combat with money rewards (10%/25%/50% of defender's money)
- `/useshield` - Activate shield protection
- `/contract` - Exchange 100 cards of one rarity for random card of next rarity
- `/lock` / `/unlock` - Protect cards from contract exchanges
- `/shoplist` / `/shopbuy` - Browse and purchase shop cards
- `/viewcard` - Display card image and stats
- `/viewattackset` / `/viewdefendset` / `/viewlock` - View lineup details
- `/balance` - Check money balance
- `/inventory` - View all owned cards

### Passive Income
Cards in the income lineup generate money per second based on their value. The system runs continuously in the background.

### Card Numbering
Duplicate cards receive sequential numbers (e.g., "Dragon", "Dragon1", "Dragon2") to track individual instances.

## Setup Instructions

### Prerequisites
1. Create a Discord bot in the [Discord Developer Portal](https://discord.com/developers/applications)
2. Enable the following bot settings:
   - Message Content Intent
   - Server Members Intent
   - Presence Intent
3. Copy your bot token and application ID

### Replit Setup
1. Add the following secrets in your Replit project:
   - `DISCORD_BOT_TOKEN`: Your Discord bot token
   - `DISCORD_APPLICATION_ID`: Your Discord application ID
2. Invite the bot to your server using this URL format:
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_APPLICATION_ID&permissions=2147485696&scope=bot%20applications.commands
   ```
3. Run the project - the workflow will start automatically

## Dependencies
- discord.js: ^14.14.1
- axios: ^1.6.5
