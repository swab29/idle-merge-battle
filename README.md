# Idle Merge Battle

A game that combines idle mechanics with merge gameplay and battle elements.

## Developer Terminology

### Merge System Components
- **Grid**: The main 5x5 inventory grid where items can be placed and merged
- **Tiles/Items**: The draggable elements in the grid (referred to as "tiles" in UI, "items" in code)
- **Equip Grid/Player Equipment**: The equipment slots where items can be equipped to the player character

### Developer Tools
- **Battle Editor**: Real-time editing of player and enemy stats with save/reset functionality
  - Direct JSON editing of game configurations
  - Live preview of changes
  - Import/Export configuration files
- **Equipment Editor**: Configure equipment types, variations, and set bonuses
- **Label Editor**: Manage and customize all game text and labels
- **Settings Panel**: Configure game settings and access developer features

## Features

- Merge similar items to create higher-level items
- Equipment system with different slots (helmet, weapon, armor, boots, accessory)
- Grid-based inventory management
- Drag and drop interface
- Comprehensive settings and developer tools

### Settings Features
- Game preferences (effects, volume, auto-save)
- Dark mode toggle
- Progress reset functionality
- Developer tools access

### Developer Features
- Real-time stat editing for battle balancing
- Live JSON configuration editing
- Equipment type and variation management
- Game text customization
- Save/reset functionality for all editors
- Persistent storage of development settings

## Planned Features

### Equipment System
- Add variants for each equipment type (e.g., high defense boots, high attack boots)
- Equipment stats and bonuses
- Equipment set bonuses
- Custom iconography system to replace variation letters (e.g., different helmet designs for each variant)

### Battle System
- Turn-based combat
- Enemy types and progression
- Equipment effects in battle
- Flexible upgrade system with active/inactive purchased upgrades
- Increased upgrade tier caps (50% of total upgrades available)
- Strategic upgrade management for progression
- HP Regeneration System:
  - Base regeneration rate: 5 HP per second
  - Regenerates between battles and when battle is stopped
  - No regeneration during active or paused battles
  - Can be increased through upgrades
- Wave & Boss System:
  - Every 10 waves, you'll have the opportunity to fight a boss
  - Boss Battle Mechanics:
    - Boss fights are required to unlock (but not immediately advance to) the next level
    - If you defeat the boss:
      - The next level becomes available
      - You can choose to stay at your current level or advance when ready
      - Auto-advance option becomes available later in the game
      - Boss remains available to challenge again
    - If you lose to the boss:
      - You return to wave 10 of the current level
      - You can continue fighting regular enemies to gain resources
      - A "Fight Boss" button becomes available to challenge the boss again
      - The boss must be defeated to unlock the next level
  - Level Progression:
    - Complete waves 1-10 to reach the boss
    - Defeat the boss to unlock the next level
    - Choose when to advance to maintain optimal progression
    - Return to previous levels to farm resources
    - Auto-progression unlockable through upgrades:
      - Auto-advance waves (early game unlock)
      - Auto-fight bosses (mid game unlock)
      - Auto-advance levels (late game unlock)

### Idle Mechanics
- Auto-merge options
- Resource generation
- Offline progress

### Save System
- Import/Export save files
- Cloud save support
- Multiple save slots
- Save file validation and recovery

## Upcoming Features

### Player Abilities (Story Points: 8)
Players will have access to a set of combat abilities that can be activated during battle. Each ability has a cooldown and provides unique effects:

- **Quick Strike** (5s cooldown): Temporarily increases attack speed by 50% for 3 seconds
- **Battle Focus** (15s cooldown): Increases critical chance by 25% for 5 seconds
- **Iron Will** (20s cooldown): Increases defense by 100% for 4 seconds
- **Adrenaline Rush** (30s cooldown): Increases all damage by 50% for 6 seconds
- **Life Surge** (25s cooldown): Heals for 25% of max health

Players start with one random ability and can unlock more through progression. Abilities are automatically activated when their cooldown is ready, similar to enemy abilities.

### TODO
- [x] Implement boss enemies with unique mechanics and rewards
- [ ] Add equipment set bonuses
- [ ] Implement prestige system
- [x] Fix player death reset mechanics:
  - [x] Reset and generate new enemy on player death
  - [x] Generate new boss variant if died to boss
  - [x] Maintain wave progress and boss accessibility on death
- [x] Add "Fight Boss" button:
  - [x] Available after reaching wave 10
  - [x] Instantly starts boss battle
  - [x] Stops current battle if one is in progress
  - [x] Always available on previously completed levels
  - [x] Remains available after boss defeat
- [x] Implement HP regeneration system:
  - [x] Regenerate HP between battles
  - [x] Regenerate HP when battle is stopped
  - [x] No regeneration during paused battles

### Recent Updates
- Wave System Improvements:
  - Waves now cap at 10
  - Previous levels automatically start at wave 10
  - Boss fights always available at wave 10
  - Wave progress maintained on death
  - Boss accessibility maintained after defeat
- Battle UI Improvements:
  - Reduced battle area size for better information visibility
  - Improved boss fight button visibility
  - Streamlined wave progression

## Development

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

### Development Tools

To access the developer tools:
1. Navigate to the Settings page
2. Enable Developer Tools
3. Access the following editors:
   - Battle Editor: Configure player and enemy stats
     - Use the JSON Editor tab for direct configuration editing
     - Modify base stats, variations, and scaling values
     - Changes take effect immediately
   - Equipment Editor: Manage equipment types and variations
   - Label Editor: Customize game text and labels

## License

MIT

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Code Refactoring Plan

### Overview
This refactoring plan aims to improve code maintainability by splitting large files into smaller, more focused components and modules. Each component should be under 300 lines of code.

### Battle View Component Refactor (8 points)
- [x] Create battle-view directory structure (1pt)
  ```
  components/battle/
  ├── index.tsx              # Main export
  ├── components/            # Subcomponents
  │   ├── battle-area.tsx    # Battle visualization
  │   ├── stats-display.tsx  # Stats cards
  │   ├── battle-controls.tsx # Buttons and controls
  │   └── enemy-abilities.tsx # Enemy ability display
  └── utils/                 # Helper functions
  ```
- [x] Extract BattleArea component (2pt)
- [x] Extract StatsDisplay component (2pt)
- [x] Extract BattleControls component (2pt)
- [x] Update imports and test functionality (1pt)

### Battle Store Refactor (13 points)
- [x] Create battle store directory structure (1pt)
  ```
  stores/battle/
  ├── index.ts              # Main store
  ├── types.ts              # Interfaces and types
  ├── constants.ts          # Initial states and configs
  ├── combat-logic.ts       # Damage and rewards
  └── enemy-generation.ts   # Enemy and boss generation
  ```
- [x] Extract types and interfaces (2pt)
- [x] Extract combat logic (3pt)
- [x] Extract enemy generation (3pt)
- [x] Extract constants and configurations (2pt)
- [x] Update imports and test functionality (2pt)

### Merge Store Refactor (8 points) ✅
- [x] Create merge store directory structure
- [x] Extract merge store types to separate file
- [x] Create constants file for item types and stats
- [x] Create item stats calculation module
- [x] Implement main merge store with Zustand
- [x] Update imports across codebase
- [x] Test merge store functionality
- [x] Document merge store API

### Documentation Updates (3 points)
- [ ] Update README with new file structure (1pt)
- [ ] Document component boundaries (1pt)
- [ ] Update developer guidelines (1pt)

### Testing Checkpoints
- ✅ After Battle Store types extraction (5 points)
- ✅ After Battle Store logic extraction (10 points)
- ✅ After Battle View refactor (18 points)
- After Merge Store refactor (26 points)
- Final testing after documentation (32 points)

### Total Story Points: 32

## Core Game Concepts

### Progression Through Automation
The game follows a key principle: features start as manual tasks and evolve into automated systems as you progress.
This creates a satisfying progression where players:
1. Learn mechanics through manual interaction
2. Unlock automation features through achievements or upgrades
3. Strategically choose which aspects to automate
4. Balance resources between different automation upgrades

Examples of Automation Progression:
- Battle System:
  - Manual: Initially control each battle and level progression
  - Semi-Auto: Unlock auto-advance after boss defeats
  - Full-Auto: Eventually automate entire battle sequences
- Merge System:
  - Manual: Hand-place and merge items
  - Semi-Auto: Unlock auto-merge for specific tiers
  - Full-Auto: Complete inventory management
- Resource Collection:
  - Manual: Claim rewards after each battle
  - Semi-Auto: Periodic auto-collection
  - Full-Auto: Offline progress and resource generation

## Merge Store API
The merge store provides the following functionality:

#### Item Management
- `spawnItem()` - Spawns a new random item in the first available grid position
- `mergeItems(itemId1, itemId2)` - Merges two items, applying level and variation rules
- `moveItem(itemId, newPosition)` - Moves an item to a new grid position
- `arrangeItems()` - Sorts and arranges items by type and level

#### Equipment
- `equipItem(itemId, slot)` - Equips an item to a specific slot
- `unequipItem(slot)` - Unequips an item from a slot

#### Grid Management
- `toggleDeleteMode()` - Toggles item deletion mode
- `deleteItem(itemId)` - Deletes an item from the grid
- `resetGrid()` - Resets the entire grid and equipped items

## TODO List

### High Priority
- [ ] Rebalance boss scaling for better progression:
  - Level 1-5: 1.3x health multiplier (currently 3x)
  - Level 6-10: 2x health multiplier
  - Level 11+: 3x health multiplier
  - Consider adjusting attack/defense scaling similarly
  - Goal: Make early bosses beatable but still challenging

### Battle Improvements
- [ ] Add visual indicator for boss fight cooldown
- [ ] Show DPS and battle statistics in UI
- [ ] Add battle summary after each fight
- [ ] Consider adding "retreat" option during battles
- [ ] Add boss fight preparation phase

### Balance & Progression
- [ ] Review currency rewards scaling
- [ ] Balance upgrade costs and effects
- [ ] Add more meaningful progression between levels
- [ ] Consider adding prestige mechanics

### UI/UX
- [ ] Improve visual feedback during combat
- [ ] Add tooltips for all stats and abilities
- [ ] Show upcoming enemy preview
- [ ] Add sound effects and visual effects for abilities

### Features
- [ ] Save/load system improvements
- [ ] Achievement system
- [ ] Daily challenges
- [ ] Different game modes
