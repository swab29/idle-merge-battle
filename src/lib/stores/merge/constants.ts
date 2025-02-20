import { type ItemType, type ItemStats, type Variation, type ItemVariationStats, type ItemSetBonus } from './types';

export const ITEM_TYPES: ItemType[] = ['weapon', 'armor', 'helmet', 'boots', 'accessory'];
export const VARIATIONS: Variation[] = ['A', 'B', 'C', 'D', 'E'];
export const SUB_LEVEL_MAX = 10;

// Base stats for each equipment type
export const BASE_STATS: Record<ItemType, Partial<ItemStats>> = {
  weapon: {
    attack: 1,
    criticalChance: 1,
    criticalDamage: 0.1,
    attackSpeed: 0.1
  },
  armor: {
    defense: 2,
    health: 5,
    blockChance: 1
  },
  helmet: {
    defense: 1,
    health: 3,
    criticalChance: 0.5
  },
  boots: {
    moveSpeed: 0.1,
    defense: 1,
    attackSpeed: 0.05
  },
  accessory: {
    criticalDamage: 0.05,
    blockChance: 0.5,
    moveSpeed: 0.05
  }
};

// Variation bonuses - each variation specializes in different stats
export const VARIATION_STATS: ItemVariationStats = {
  A: { primary: 'attack', secondary: 'criticalDamage' },      // Offensive
  B: { primary: 'defense', secondary: 'health' },             // Defensive
  C: { primary: 'criticalChance', secondary: 'attackSpeed' }, // Speed
  D: { primary: 'blockChance', secondary: 'defense' },        // Tank
  E: { primary: 'moveSpeed', secondary: 'attackSpeed' }       // Mobility
};

// Set bonuses for matching variations
export const SET_BONUSES: Record<Variation, ItemSetBonus[]> = {
  A: [
    { 
      requiredPieces: 2,
      bonuses: [{ type: 'criticalDamage', value: 0.2 }]
    },
    {
      requiredPieces: 4,
      bonuses: [
        { type: 'attack', value: 5 },
        { type: 'criticalChance', value: 5 }
      ]
    }
  ],
  B: [
    {
      requiredPieces: 2,
      bonuses: [{ type: 'health', value: 10 }]
    },
    {
      requiredPieces: 4,
      bonuses: [
        { type: 'defense', value: 10 },
        { type: 'blockChance', value: 5 }
      ]
    }
  ],
  C: [
    {
      requiredPieces: 2,
      bonuses: [{ type: 'attackSpeed', value: 0.2 }]
    },
    {
      requiredPieces: 4,
      bonuses: [
        { type: 'criticalChance', value: 10 },
        { type: 'moveSpeed', value: 0.2 }
      ]
    }
  ],
  D: [
    {
      requiredPieces: 2,
      bonuses: [{ type: 'blockChance', value: 5 }]
    },
    {
      requiredPieces: 4,
      bonuses: [
        { type: 'defense', value: 15 },
        { type: 'health', value: 20 }
      ]
    }
  ],
  E: [
    {
      requiredPieces: 2,
      bonuses: [{ type: 'moveSpeed', value: 0.15 }]
    },
    {
      requiredPieces: 4,
      bonuses: [
        { type: 'attackSpeed', value: 0.3 },
        { type: 'criticalChance', value: 5 }
      ]
    }
  ]
}; 