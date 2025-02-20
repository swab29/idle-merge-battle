# Level & Boss Progression Tracking Options

This document outlines different approaches to track level and boss progression in the game.

## 1. Boolean Flags with Level Context
```typescript
{
  bossUnlocked: boolean;
  bossAttempted: boolean;
  bossUnlockedLevel: number; // Track which level these flags apply to
}
```
### Pros
- Simple to understand
- Easy to implement
### Cons
- Need to manage resetting flags when changing levels
- Could get out of sync with current level

## 2. Level-Based Progress Tracking
```typescript
{
  latestBossDefeated: number; // Highest level where boss was defeated
  currentBossAttempted: boolean; // Only for current level
}
```
### Pros
- Clear progression tracking
- Previous levels implicitly completed
- Only need to track current level's attempt state
### Cons
- Less flexible for future features

## 3. Level-State Map
```typescript
{
  levelStates: {
    [level: number]: {
      bossUnlocked: boolean;
      bossAttempted: boolean;
      bossDefeated: boolean;
    }
  }
}
```
### Pros
- Complete history for each level
- Most flexible for future features
- Clear state per level
### Cons
- More complex
- More state to manage
- Larger save file

## 4. Achievement-Style Progress
```typescript
{
  defeatedBosses: number[]; // Array of level numbers where boss was defeated
  currentLevelBossAttempted: boolean;
}
```
### Pros
- Simple to check if a level's boss was defeated
- Easy to add new boss-related achievements
- Clear progression history
### Cons
- Need to search array for checks
- Less structured than other approaches

## 5. Milestone-Based System
```typescript
{
  highestDefeatedBoss: number; // Highest level with defeated boss
  currentLevelState: {
    winsToUnlock: number; // How many more wins needed (10 - current wins)
    attempted: boolean;
    defeated: boolean;
  }
}
```
### Pros
- Clear progression tracking
- Includes "distance to boss" tracking
- Separates current level state from overall progress
### Cons
- More complex state updates
- Needs careful synchronization with level changes

## Current Implementation
We are currently using Option 4: Achievement-Style Progress. This approach was chosen for its simplicity and clear progression tracking, while maintaining the ability to expand with future achievements or tracking needs.

### Implementation Notes
- Boss defeats are tracked in an array of level numbers
- Current level boss attempts are tracked with a single boolean
- Previous levels' bosses are assumed defeated if their level number exists in the array 