# Discord Card Game Bot - Setup Guide

## ✅ Bot Status
Your bot is **live and running**! All commands are registered and ready to use.

## 🔗 Invite Your Bot to Discord Server

**Step 1:** Use this invite URL (replace `YOUR_APPLICATION_ID` with your actual Application ID):
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_APPLICATION_ID&permissions=2147485696&scope=bot%20applications.commands
```

**Step 2:** Select the server you want to add the bot to and click "Authorize"

## 🎮 Getting Started

### For Admins - First Steps
1. Create some cards:
   ```
   /addcard name:Dragon image:https://i.imgur.com/example.png value:100 rarity:legendary
   /addcard name:Knight image:https://i.imgur.com/example2.png value:50 rarity:rare
   /addcard name:Peasant image:https://i.imgur.com/example3.png value:10 rarity:common
   ```

2. Add cards to the default stone:
   ```
   /hitstoneadd cardname:Dragon
   /hitstoneadd cardname:Knight
   /hitstoneadd cardname:Peasant
   ```

3. Set up the shop (optional):
   ```
   /shop cardname:Dragon price:10000
   /shop cardname:Knight price:5000
   ```

4. Give players starting money:
   ```
   /give player:@username type:money value:1000
   ```

### For Players - How to Play

**Break Stones to Get Cards:**
```
/hitstone
```
Automatically hits until the 170 HP stone breaks and you receive a random card!

**Check Your Balance:**
```
/balance
```
See how much money you have.

**Build Your Lineups:**
```
/setincome cardname:Dragon     # Earn passive money
/setattack cardname:Knight     # Increase attack power
/setdefend cardname:Peasant    # Increase defense power
```

**Upgrade Your Damage:**
```
/upgrade
```
Each upgrade increases your stone damage by 1 (costs 1M-10M randomly)

**Attack Other Players:**
```
/attack player:@opponent pick:5
```
If you win, pick a number 1-10. If you guess one of the 3 random reward numbers, you get 10%, 25%, or 50% of their money!

**Trade with Others:**
```
/trade player:@friend offer:money:500 request:card:Dragon
/trade player:@friend offer:card:Knight request:money:1000
```

**Upgrade Card Rarity:**
```
/lock cardname:Dragon1           # Protect your favorite cards
/contract rarity:common          # Trade 100 commons for 1 rare
```

**Shop Commands:**
```
/shoplist                        # See available cards
/shopbuy cardname:Dragon         # Purchase a card
```

**View Your Stuff:**
```
/balance                         # Check your money
/inventory                       # See all your cards
/viewattackset                   # View attack lineup
/viewdefendset                   # View defense lineup
```

## 🎲 Rarity System
- **Common**: 60% drop rate
- **Rare**: 30% drop rate
- **Epic**: 10% drop rate
- **Legendary**: 4% drop rate
- **Mythic**: 2% drop rate
- **Unique**: 0.2% drop rate

## 🛡️ Advanced Features

**Event System (Admin):**
```
/create eventname:Holiday hp:300 requiredcard:Dragon amount:5
/eventcards eventname:Holiday cardname:SpecialCard
/start eventname:Holiday
```
Players with 5+ Dragons can now use `/hitstonevent` to break the event stone!

**Shield Protection (Admin):**
```
/shieldcode code:SAFE123 duration:24
```
Players use `/useshield code:SAFE123` to protect against attacks for 24 hours.

## 📊 Game Mechanics
- **Stone HP**: 170 HP (default), breaks after enough hits
- **Passive Income**: Runs every second based on cards in income lineup
- **Card Lineups**: Max 10 cards each (income/attack/defend)
- **One Card Per Set**: Cards can only be in one lineup at a time
- **Card Numbering**: Duplicates get numbers (Dragon, Dragon1, Dragon2, etc.)

## 🚀 Publishing Your Bot
To keep your bot running 24/7, click the "Publish" button in Replit!

---
**Need Help?** Check the README.md or replit.md files for more detailed documentation.
