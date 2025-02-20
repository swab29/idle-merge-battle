# Auto Battle System

## Overview
An automated battle system where a player fights through waves of increasingly difficult enemies. Each level consists of 10 enemies, with rewards scaling based on progress.

## Layout & Animations

### Battle Scene Layout
- Main battle area takes up most of the screen width
- Player character positioned on the left side
- Enemy character positioned on the right side
- Stats panels displayed below each character
- Currency/rewards panel at the top
- Upgrade panel accessible via tab or side panel

### Character Animations
1. **Idle Animation**
   - Basic 2-frame breathing animation while standing
   - Weapon/equipment visible in idle stance

2. **Combat Animations**
   - Quick forward movement toward opponent (~20% of distance)
   - Return to original position
   - Attack effect on contact
   - Hit reaction animation for receiving damage

3. **Progress Animations**
   - 5-6 frame walking cycle for between-battle movement
   - Progress bar showing distance to next enemy
   - Smooth transition between walking and combat stance

4. **Effect Animations**
   - Critical hit flash/particles
   - Block effect shield
   - Healing sparkles
   - Currency gain floating numbers

## Player Stats
- **Health**
  - Max HP
  - Current HP
  - Prestige HP Multiplier

- **Combat**
  - Attack Damage
  - Attack Speed (attacks per second)
  - Critical Chance (%)
  - Critical Damage Multiplier
  - Block Chance (%)
  - Prestige Damage Multiplier

- **Speed**
  - Move Speed (time between battles)
  - Game Speed (overall speed multiplier)

- **Rewards**
  - 2x Currency Chance (%)
  - 5x Currency Chance (%)

## Enemy Scaling
- Each level contains 10 enemies
- Enemy stats increase with each level
- After defeating all enemies in a level, player advances to next level
- If player dies, they reset to level 1

## Currency System
Earn different types of currency based on progress:
- **Currency A**: Earned every wave
- **Currency B**: Earned every 5 waves
- **Currency C**: Earned every 10 waves
- **Currency D**: Earned every 15 waves

### Currency Scaling Example (Level 10)
- Currency A: 10 points
- Currency B: 2 points
- Currency C: 1 point
- Currency D: 0 points

## Upgrade System

### Tier 1 Upgrades (Currency A)
1. Attack Boost I: +1 Attack Damage
2. Health Boost I: +2 HP
3. Speed Boost I: +0.03 Move Speed
4. Game Speed I: +2% Game Speed
5. Critical Package I: +1% Crit Chance, +0.10 Crit Damage
6. Balanced Growth I: +1 Damage, +2 HP
7. Tier 1 Capacity: +1 Tier 1 Upgrade Cap
8. Prestige Boost I: +1% Prestige Bonus
9. Advanced Growth I: +3 Damage, +3 HP

### Tier 2 Upgrades (Currency B)
1. Health Boost II: +3 HP
2. Enemy Slowdown I: -0.02 Enemy Attack Speed
3. Enemy Weakening I: -1 Enemy Damage
4. Enemy Critical Reduction: -1% Enemy Crit Chance, -0.10 Enemy Crit Damage
5. Combat Package I: +1 Damage, +0.01 Attack Speed
6. Tier 2 Capacity: +1 Tier 2 Upgrade Cap
7. Prestige Boost II: +2% Prestige Bonus

### Tier 3 Upgrades (Currency C)
1. Attack Boost III: +2 Damage
2. Speed Boost III: +0.02 Attack Speed
3. Critical Boost III: +1% Crit Chance
4. Game Speed III: +3% Game Speed
5. Balanced Growth III: +3 Damage, +3 HP
6. Tier 3 Capacity: +1 Tier 3 Upgrade Cap
7. Lucky Boost: +3% 5x Drop Chance
8. Advanced Package III: +5 HP, +0.03 Attack Speed

### Tier 4 Upgrades (Currency D)
1. Block Chance I: +1% Block Chance
2. Health Boost IV: +5 HP
3. Critical Balance: +0.10 Crit Damage, -0.10 Enemy Crit Damage
4. Speed Package IV: +0.02 Attack Speed, +0.02 Move Speed
5. Balanced Growth IV: +4 HP, +4 Damage
6. Tier 4 Capacity: +1 Tier 4 Upgrade Cap
7. Universal Capacity: +1 All Tier Upgrade Caps
8. Master Package: +10 HP, +0.05 Attack Speed

## Implementation Stories

### Core Battle System
1. Create battle store with player and enemy state [✓]
2. Implement basic player stats and state management [✓]
3. Add enemy generation with level-based scaling [✓]
4. Create battle loop with attack speed timing [✓]
5. Implement damage calculation system [✓]
6. Add wave progression and level tracking [✓]
7. Create player death and reset mechanism [✓]

### Currency & Rewards
8. Implement base currency earning system [✓]
9. Add multi-currency types (A, B, C, D) [✓]
10. Create currency scaling based on level [✓]
11. Implement currency multiplier chances (2x, 5x) [✓]

### Upgrade System Implementation
31. Create upgrade data structures and configs [ ]
32. Implement upgrade purchase and validation system [ ]
33. Add upgrade cap management [ ]
34. Create upgrade effect application system [ ]
35. Implement upgrade state persistence [ ]
36. Add upgrade reset mechanism [ ]

### Tier 1 Upgrades
37. Implement basic stat upgrades (Attack, HP) [ ]
38. Add speed-based upgrades [ ]
39. Implement critical hit upgrades [ ]
40. Add tier 1 capacity system [ ]
41. Create prestige bonus calculation [ ]

### Tier 2 Upgrades
42. Implement enemy stat reduction system [ ]
43. Add combined stat upgrades [ ]
44. Create tier 2 capacity system [ ]
45. Implement enemy critical reduction [ ]

### Tier 3 Upgrades
46. Implement advanced stat combinations [ ]
47. Add game speed modifications [ ]
48. Create drop chance modifiers [ ]
49. Implement tier 3 capacity system [ ]

### Tier 4 Upgrades
50. Implement block chance system [ ]
51. Add advanced critical modifiers [ ]
52. Create universal capacity system [ ]
53. Implement master package effects [ ]

### Upgrade UI
54. Create upgrade tier navigation [ ]
55. Implement upgrade purchase buttons [ ]
56. Add upgrade level indicators [ ]
57. Create upgrade cap displays [ ]
58. Implement cost scaling display [ ]
59. Add upgrade effect preview [ ]
60. Create upgrade reset confirmation [ ]

### Effects & Polish
22. Add visual attack indicators [ ]
23. Implement critical hit effects [ ]
24. Create block effect display [ ]
25. Add currency gain animations [ ]
26. Implement wave completion effects [ ]

### Persistence & Settings
27. Add save/load system for battle progress [ ]
28. Implement prestige system [ ]
29. Create battle speed controls [ ]
30. Add auto-prestige options [ ]

### Animation System
61. Create basic character sprite component [✓]
62. Implement idle animation system [✓]
63. Add combat movement animations [✓]
64. Create walking cycle animation [✓]
65. Add hit effects and reactions [✓]
66. Implement progress bar and transitions [✓]
67. Create particle effect system [ ]
68. Add currency and reward animations [ ]

## Technical Considerations
- Use precise timing for attack and move speeds [ ]
- Implement efficient state updates for smooth performance [ ]
- Use animation frame for battle loop [ ]
- Ensure accurate currency calculations [ ]
- Implement proper save state management [ ]
- Implement efficient upgrade state management [ ]
- Ensure accurate upgrade effect calculations [ ]
- Create robust upgrade validation system [ ]
- Implement upgrade cap enforcement [ ]
- Design scalable upgrade UI system [ ]
- Use CSS animations for simple effects [ ]
- Implement sprite-based animation system [ ]
- Ensure smooth transitions between animation states [ ]
- Optimize animation performance [ ]
- Handle animation interrupts (death during attack, etc.) [ ]

## Future Enhancements
- Special abilities system
- Equipment integration
- Boss battles
- Achievement system
- Prestige rewards
- Multiple fighter types 