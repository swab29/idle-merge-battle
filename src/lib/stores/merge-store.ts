import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export type ItemType = 'weapon' | 'armor' | 'helmet' | 'boots' | 'accessory';
export type EquipmentSlot = ItemType;
export type Variation = 'A' | 'B' | 'C' | 'D' | 'E';

export interface ItemStats {
  attack: number;
  defense: number;
  health: number;
  criticalChance: number;
  criticalDamage: number;
  attackSpeed: number;
  blockChance: number;
  moveSpeed: number;
}

export interface ItemBonus {
  type: keyof ItemStats;
  value: number;
}

export interface ItemSetBonus {
  requiredPieces: number;
  bonuses: ItemBonus[];
}

export interface ItemVariationStats {
  A: { primary: keyof ItemStats; secondary: keyof ItemStats };
  B: { primary: keyof ItemStats; secondary: keyof ItemStats };
  C: { primary: keyof ItemStats; secondary: keyof ItemStats };
  D: { primary: keyof ItemStats; secondary: keyof ItemStats };
  E: { primary: keyof ItemStats; secondary: keyof ItemStats };
}

export interface Item {
  id: string;
  type: ItemType;
  variation: Variation;
  level: number;
  subLevel: number;
  position: number;
  isEquipped?: boolean;
  stats: ItemStats;
}

interface MergeStore {
  items: Item[];
  equippedItems: Record<EquipmentSlot, string | null>;
  isDeleteMode: boolean;
  showDeletePrompt: boolean;
  spawnItem: () => void;
  mergeItems: (itemId1: string, itemId2: string) => void;
  moveItem: (itemId: string, newPosition: number) => void;
  equipItem: (itemId: string, slot: EquipmentSlot) => void;
  unequipItem: (slot: EquipmentSlot) => void;
  toggleDeleteMode: () => void;
  toggleDeletePrompt: () => void;
  deleteItem: (itemId: string) => void;
  resetGrid: () => void;
  arrangeItems: () => void;
}

const ITEM_TYPES: ItemType[] = ['weapon', 'armor', 'helmet', 'boots', 'accessory'];
const VARIATIONS: Variation[] = ['A', 'B', 'C', 'D', 'E'];
const SUB_LEVEL_MAX = 10;

// Base stats for each equipment type
const BASE_STATS: Record<ItemType, Partial<ItemStats>> = {
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
const VARIATION_STATS: ItemVariationStats = {
  A: { primary: 'attack', secondary: 'criticalDamage' },      // Offensive
  B: { primary: 'defense', secondary: 'health' },             // Defensive
  C: { primary: 'criticalChance', secondary: 'attackSpeed' }, // Speed
  D: { primary: 'blockChance', secondary: 'defense' },        // Tank
  E: { primary: 'moveSpeed', secondary: 'attackSpeed' }       // Mobility
};

// Set bonuses for matching variations
const SET_BONUSES: Record<Variation, ItemSetBonus[]> = {
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

// Helper function to calculate base stats for an item
function calculateBaseStats(type: ItemType, level: number, variation: Variation): ItemStats {
  const baseStats = BASE_STATS[type];
  const variationBonus = VARIATION_STATS[variation];
  
  // Initialize all stats to 0
  const stats: ItemStats = {
    attack: 0,
    defense: 0,
    health: 0,
    criticalChance: 0,
    criticalDamage: 0,
    attackSpeed: 0,
    blockChance: 0,
    moveSpeed: 0
  };

  // Apply base stats with level scaling
  Object.entries(baseStats).forEach(([stat, value]) => {
    stats[stat as keyof ItemStats] = value * level;
  });

  // Apply variation bonuses
  stats[variationBonus.primary] *= 1.5;  // 50% bonus to primary stat
  stats[variationBonus.secondary] *= 1.25;  // 25% bonus to secondary stat

  return stats;
}

// Helper function to calculate set bonuses
function calculateSetBonuses(items: Item[]): ItemStats {
  const stats: ItemStats = {
    attack: 0,
    defense: 0,
    health: 0,
    criticalChance: 0,
    criticalDamage: 0,
    attackSpeed: 0,
    blockChance: 0,
    moveSpeed: 0
  };

  // Count equipped items of each variation
  const variationCounts = items.reduce((acc, item) => {
    if (item.isEquipped) {
      acc[item.variation] = (acc[item.variation] || 0) + 1;
    }
    return acc;
  }, {} as Record<Variation, number>);

  // Apply set bonuses
  Object.entries(variationCounts).forEach(([variation, count]) => {
    const bonuses = SET_BONUSES[variation as Variation];
    bonuses.forEach(bonus => {
      if (count >= bonus.requiredPieces) {
        bonus.bonuses.forEach(({ type, value }) => {
          stats[type] += value;
        });
      }
    });
  });

  return stats;
}

export const useMergeStore = create<MergeStore>()(
  persist(
    (set, get) => ({
      items: [],
      equippedItems: {
        weapon: null,
        armor: null,
        helmet: null,
        boots: null,
        accessory: null
      },
      isDeleteMode: false,
      showDeletePrompt: true,

      spawnItem: () => {
        set(state => {
          const unequippedItems = state.items.filter(item => !item.isEquipped);
          
          if (unequippedItems.length >= 25) {
            return state;
          }

          // Find first available position
          let position = 0;
          while (unequippedItems.some(item => item.position === position)) {
            position++;
          }

          const type = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
          const variation = VARIATIONS[Math.floor(Math.random() * VARIATIONS.length)];
          const level = 1;

          const newItem = {
            id: nanoid(),
            type,
            variation,
            level,
            subLevel: 0,
            position,
            isEquipped: false,
            stats: calculateBaseStats(type, level, variation)
          };

          return {
            ...state,
            items: [...state.items, newItem]
          };
        });
      },

      equipItem: (itemId: string, slot: EquipmentSlot) => {
        const { items, equippedItems } = get();
        const item = items.find(i => i.id === itemId);
        if (!item) return;

        // If there's already an item equipped in this slot, unequip it first
        const currentEquippedId = equippedItems[slot];
        if (currentEquippedId) {
          // Find first available grid position
          const occupiedPositions = new Set(items.filter(i => !i.isEquipped).map(i => i.position));
          let newPosition = 0;
          while (occupiedPositions.has(newPosition)) {
            newPosition++;
          }
          
          // Only unequip if there's space in the grid
          if (newPosition < 25) {
            // First move the currently equipped item to the grid
            set(state => ({
              items: state.items.map(i => 
                i.id === currentEquippedId 
                  ? { ...i, isEquipped: false, position: newPosition }
                  : i
              ),
              equippedItems: {
                ...state.equippedItems,
                [slot]: null
              }
            }));
          } else {
            // If grid is full, don't allow equipping
            return;
          }
        }

        // Now equip the new item
        set(state => ({
          equippedItems: {
            ...state.equippedItems,
            [slot]: itemId
          },
          items: state.items.map(i => 
            i.id === itemId 
              ? { ...i, isEquipped: true }
              : i
          )
        }));
      },

      unequipItem: (slot: EquipmentSlot) => {
        console.log('Unequipping from slot:', slot);
        const { equippedItems, items } = get();
        const itemId = equippedItems[slot];
        
        console.log('Current state:', {
          items: items.map(i => ({ id: i.id, type: i.type, position: i.position })),
          equippedItems
        });

        if (!itemId) {
          console.error('No item in slot:', slot);
          return;
        }

        // Find the first empty position in the grid
        const occupiedPositions = new Set(
          items
            .filter(i => !i.isEquipped)
            .map(item => item.position)
        );
        let emptyPosition = 0;
        while (occupiedPositions.has(emptyPosition)) {
          emptyPosition++;
        }

        console.log('Unequipping to position:', emptyPosition);
        set(state => {
          const newState = {
            equippedItems: { ...state.equippedItems, [slot]: null },
            items: state.items.map(i => 
              i.id === itemId ? { ...i, position: emptyPosition, isEquipped: false } : i
            )
          };
          console.log('New state:', {
            items: newState.items.map(i => ({ id: i.id, type: i.type, position: i.position, isEquipped: i.isEquipped })),
            equippedItems: newState.equippedItems
          });
          return newState;
        });
      },

      mergeItems: (itemId1: string, itemId2: string) => {
        const { items } = get();
        const item1 = items.find(i => i.id === itemId1);
        const item2 = items.find(i => i.id === itemId2);

        if (!item1 || !item2) return;

        // Items must be of the same type
        if (item1.type !== item2.type) return;

        set(state => {
          // Remove the dragged item (item1) and update the target item (item2)
          return {
            ...state,
            items: state.items
              .filter(item => item.id !== itemId1) // Remove dragged item
              .map(item => {
                if (item.id === itemId2) {
                  // If consumed item has higher level, take that level
                  if (item1.level > item2.level) {
                    return {
                      ...item,
                      level: item1.level,
                      subLevel: 0
                    };
                  }
                  // If consumed item has lower level, increment sub-level
                  else if (item1.level < item2.level) {
                    const newSubLevel = item.subLevel + 1;
                    // If sub-level reaches max, level up and reset
                    if (newSubLevel >= SUB_LEVEL_MAX) {
                      return {
                        ...item,
                        level: item.level + 1,
                        subLevel: 0
                      };
                    }
                    return {
                      ...item,
                      subLevel: newSubLevel
                    };
                  }
                  // Same level but different variation, increment sub-level
                  else if (item1.variation !== item2.variation) {
                    const newSubLevel = item.subLevel + 1;
                    // If sub-level reaches max, level up and reset
                    if (newSubLevel >= SUB_LEVEL_MAX) {
                      return {
                        ...item,
                        level: item.level + 1,
                        subLevel: 0
                      };
                    }
                    return {
                      ...item,
                      subLevel: newSubLevel
                    };
                  }
                  // Same level and variation
                  else {
                    return {
                      ...item,
                      level: item.level + 1,
                      subLevel: 0
                    };
                  }
                }
                return item;
              })
          };
        });
      },

      moveItem: (itemId: string, newPosition: number) => {
        console.log('moveItem called:', {
          itemId,
          newPosition,
          currentState: get()
        });
        
        const { items, equippedItems } = get();
        
        // Find the item being moved
        const movingItem = items.find(i => i.id === itemId);
        if (!movingItem) {
          console.error('Moving item not found:', itemId);
          return;
        }

        console.log('Moving item details:', {
          item: movingItem,
          currentPosition: movingItem.position,
          isEquipped: movingItem.isEquipped
        });

        // Check if item is equipped
        const equippedSlot = Object.entries(equippedItems)
          .find(([_, id]) => id === itemId)?.[0] as EquipmentSlot | undefined;

        // If position is invalid, return item to its original position
        if (newPosition < 0 || newPosition >= 25) {
          console.log('Invalid position, returning to original position:', movingItem.position);
          set(state => ({
            ...state,
            items: state.items.map(item =>
              item.id === itemId ? { ...item, position: movingItem.position } : item
            )
          }));
          return;
        }

        // If item is equipped, handle unequipping
        if (equippedSlot) {
          console.log('Unequipping item from slot:', equippedSlot);
          set(state => {
            const newState = {
              ...state,
              equippedItems: {
                ...state.equippedItems,
                [equippedSlot]: null
              },
              items: state.items.map(item =>
                item.id === itemId 
                  ? { ...item, position: newPosition, isEquipped: false }
                  : item
              )
            };
            console.log('New state after unequipping:', newState);
            return newState;
          });
          return;
        }

        // Handle normal grid movement
        const existingItem = items.find(i => i.position === newPosition && !i.isEquipped);
        
        // If there's an existing item and it's not the same item
        if (existingItem && existingItem.id !== itemId) {
          console.log('Swapping positions with existing item:', {
            existing: existingItem,
            moving: movingItem
          });
          
          set(state => {
            // Create a new items array with swapped positions
            const newItems = state.items.map(item => {
              if (item.id === itemId) {
                return { ...item, position: newPosition, isEquipped: false };
              }
              if (item.id === existingItem.id) {
                return { ...item, position: movingItem.position };
              }
              return item;
            });

            // Ensure no duplicates
            const uniqueItems = Array.from(new Map(newItems.map(item => [item.id, item])).values());

            const newState = {
              ...state,
              items: uniqueItems
            };
            console.log('New state after swap:', newState);
            return newState;
          });
        } else {
          console.log('Moving to empty position:', newPosition);
          
          set(state => {
            const newItems = state.items.map(item =>
              item.id === itemId ? { ...item, position: newPosition, isEquipped: false } : item
            );

            // Ensure no duplicates
            const uniqueItems = Array.from(new Map(newItems.map(item => [item.id, item])).values());

            const newState = {
              ...state,
              items: uniqueItems
            };
            console.log('New state after move:', newState);
            return newState;
          });
        }
      },

      arrangeItems: () => {
        set(state => {
          const unequippedItems = state.items.filter(item => !item.isEquipped);
          const equippedItems = state.items.filter(item => item.isEquipped);

          const arrangedBackpackItems = [...unequippedItems].sort((a, b) => {
            if (a.type === b.type) {
              if (a.level === b.level) {
                return b.subLevel - a.subLevel;
              }
              return b.level - a.level;
            }
            return a.type.localeCompare(b.type);
          });

          arrangedBackpackItems.forEach((item, index) => {
            if (index < 25) {
              item.position = index;
            }
          });

          return {
            ...state,
            items: [...equippedItems, ...arrangedBackpackItems]
          };
        });
      },

      toggleDeleteMode: () => set(state => ({ isDeleteMode: !state.isDeleteMode })),
      
      toggleDeletePrompt: () => set(state => ({ showDeletePrompt: !state.showDeletePrompt })),
      
      deleteItem: (itemId: string) => {
        const { equippedItems } = get();
        Object.entries(equippedItems).forEach(([slot, eqItemId]) => {
          if (eqItemId === itemId) {
            get().unequipItem(slot as EquipmentSlot);
          }
        });
        
        set(state => ({
          items: state.items.filter(item => item.id !== itemId),
        }));
      },
      
      resetGrid: () => {
        set({ 
          items: [],
          equippedItems: {
            weapon: null,
            armor: null,
            helmet: null,
            boots: null,
            accessory: null
          }
        });
      },
    }),
    {
      name: 'merge-storage',
    }
  )
); 