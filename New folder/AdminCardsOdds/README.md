# Discord Card Game Bot

A feature-rich Discord bot for a card collection and battling game!

## Quick Start

1. **Set up your Discord Bot**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to the "Bot" section and create a bot
   - Copy your bot token
   - Go to "OAuth2" > "General" and copy your Application ID

2. **Configure Secrets**:
   - In Replit, add these secrets:
     - `DISCORD_BOT_TOKEN`: Your bot token
     - `DISCORD_APPLICATION_ID`: Your application ID

3. **Invite the Bot**:
   - Use this URL (replace YOUR_APPLICATION_ID):
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_APPLICATION_ID&permissions=2147485696&scope=bot%20applications.commands
   ```

4. **Run the Bot**:
   - Click the "Run" button in Replit
   - The bot will come online and register all commands

## Game Overview

### Card Rarity
- Common (60%), Rare (30%), Epic (10%), Legendary (4%), Mythic (2%), Unique (0.2%)

### Key Features
- Break stones to collect cards
- Build attack/defense/income lineups (max 10 cards each)
- PvP battles with money rewards
- Upgrade system for increased stone damage
- Contract system to exchange 100 cards for higher rarity
- Shop system for buying/selling cards
- Shield protection against attacks
- Passive income generation

## Admin Commands
- `/addcard` - Create cards
- `/hitstoneadd` - Add cards to stone drops
- `/create` - Create events
- `/give` - Give players resources
- `/shop` - Manage shop
- And more...

## Player Commands
- `/hitstone` - Auto-break stones for cards (hits until destroyed)
- `/balance` - Check your money
- `/attack` - Attack other players
- `/upgrade` - Increase damage (costs 1M-10M)
- `/setincome`, `/setattack`, `/setdefend` - Manage lineups
- `/contract` - Upgrade card rarity
- `/shopbuy` - Purchase cards
- And more...

## Support
For issues or questions, check the replit.md file for detailed documentation.
