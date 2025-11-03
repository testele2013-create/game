# Discord Card Game Bot - Design Guidelines

## Project Context
A Discord bot for card collection, stone-breaking mechanics, PvP battles, and idle income generation. The interface is entirely within Discord using embeds, commands, and interactive components.

## Design Approach
**System-Based**: Following Discord's established design patterns and embed conventions for consistency with user expectations in Discord environments.

## Core Design Principles
1. **Instant Feedback**: Every command provides immediate visual confirmation
2. **Progressive Disclosure**: Complex data revealed through organized embed fields
3. **Game Feel**: Visual progression and reward celebration through rich embeds
4. **Clarity Over Decoration**: Information hierarchy prioritizes readability

## Color System

### Rarity-Based Colors
```
Common: #95A5A6 (muted gray)
Rare: #3498DB (vibrant blue)
Epic: #9B59B6 (rich purple)
Legendary: #F39C12 (golden orange)
Mythic: #E74C3C (intense red)
Unique: #1ABC9C (teal/cyan)
```

### System Colors
```
Success: #2ECC71 (green)
Error: #E74C3C (red)
Info: #3498DB (blue)
Warning: #F39C12 (orange)
Neutral: #34495E (dark gray-blue)
```

## Typography Hierarchy

### Embed Titles
- **Primary Actions**: Bold, clear verbs (e.g., "Stone Broken! 🎉", "Attack Successful! ⚔️")
- **Status Updates**: Descriptive states (e.g., "Mining in Progress...", "Inventory")

### Embed Descriptions
- Main narrative or action summary
- 1-2 sentences maximum for quick scanning
- Use Discord markdown for emphasis (\*\*bold\*\*, \*italic\*)

### Field Organization
- **Inline Fields**: For paired data (Name: Value, Rarity: Epic)
- **Full-Width Fields**: For lists or longer content
- **Maximum 25 fields** per embed (Discord limit)

## Component Specifications

### Stone Breaking Progress Embeds
```
Structure:
- Title: "⛏️ Mining Stone..." with emoji
- Description: Current HP / Total HP with progress bar
- Fields (inline):
  - Current HP: "125/170"
  - Damage/sec: "3"
  - Time Remaining: "~42s"
- Color: Info blue (#3498DB)
- Updates: Every 3-5 seconds
- Thumbnail: Stone/pickaxe icon (optional)
```

### Card Reward Embeds
```
Structure:
- Title: "Stone Broken! 🎉"
- Description: "You received: **CardName**"
- Fields (inline):
  - Rarity: "[rarity]"
  - Value: "[value]"
  - Total Hits: "[count]"
- Image: Full card artwork (large display)
- Color: Rarity-based color
- Footer: Subtle stats or tips
```

### Inventory/Lineup Displays
```
Structure:
- Title: "[Type] Lineup" or "Card Inventory"
- Description: Summary count
- Fields: Grouped by rarity or slot
  - Format: "Slot 1: **CardName** (Rare, Value: 50)"
- Organization: 
  - Attack/Defense: Show 2 columns of 5 cards
  - Income: List with power totals
  - Inventory: Group by rarity, paginate if >25 cards
- Color: Neutral (#34495E)
```

### Battle/Attack Results
```
Structure:
- Title: "⚔️ Attack Results"
- Description: Win/loss outcome
- Fields (inline):
  - Attacker Power: "[value]"
  - Defender Power: "[value]"
  - Reward: "[money amount]" or "No reward"
- Color: Success (green) or Error (red)
- Thumbnail: Trophy or crossed swords icon
```

### Shop Displays
```
Structure:
- Title: "🛒 Card Shop"
- Fields: Each card as separate field
  - Format: "**CardName** - Rarity | 💰 [price]"
  - Include small thumbnail per card (inline)
- Color: Warning orange (#F39C12)
- Footer: Player's current balance
```

## Visual Elements

### Icons & Emojis
Use consistently throughout:
- ⛏️ Stone/mining
- 🎉 Success/rewards
- ⚔️ Attack/combat
- 🛡️ Defense
- 💰 Money/economy
- 🔒 Locked items
- 📊 Stats/progress
- 🛒 Shop
- ⚡ Power/energy
- 🎴 Cards

### Progress Indicators
```
Visual progress bars using Discord formatting:
[████████░░] 80%
[███░░░░░░░] 30%

Format: [filled][empty] percentage
Use in: Stone HP, upgrade progress, time remaining
```

### Thumbnails vs. Full Images
- **Thumbnails**: Small icons for status, shops, lineups (top-right corner)
- **Full Images**: Card artwork reveals, major rewards (bottom full-width)

### Footers
- Subtle, informative
- Format: "Tip: Use /upgrade to increase damage | Balance: 5,000 💰"
- Timestamp for time-sensitive actions

## Interaction Patterns

### Command Feedback Timing
- **Instant (<100ms)**: Acknowledgment message
- **Progressive (1-5s)**: Status updates during mining
- **Final**: Result embed with full details

### Error Handling
- Clear, friendly error messages
- Suggest corrective action
- Use Error color (#E74C3C)
- Format: "❌ Error: [Issue]. Try: [Solution]"

### Success Celebrations
- Animated emoji sequences for rare drops
- Rarity-based color flashing (through embed color)
- Congratulatory language for milestones

## Spacing & Layout

### Embed Field Spacing
- Group related fields together
- Use blank fields for visual separation if needed
- Inline fields: 2-3 max per row for readability

### List Formatting
Within descriptions or fields:
```
• Item one
• Item two
• Item three

OR numbered:
1. First item
2. Second item
```

## Accessibility Considerations
- Always provide text alternatives for emoji-only communication
- Use color AND icons to indicate status (not color alone)
- Clear, concise language for all users
- Maintain consistent command naming conventions

## Images Strategy
**Card Images**: Imgur-hosted, displayed as full embed images when revealing rewards or viewing individual cards. Hero-style display for major card acquisitions (legendary+).

**Icon/Thumbnails**: Small emoji or thumbnail images for status indicators, shop items, and progress tracking.

This design system ensures Discord bot responses are visually engaging, information-rich, and consistent with Discord's UX patterns while celebrating the game's card-collecting mechanics.