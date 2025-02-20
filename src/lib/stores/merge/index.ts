import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { type MergeStore, type Item, type EquipmentSlot } from './types';
import { ITEM_TYPES, VARIATIONS, SUB_LEVEL_MAX } from './constants';
import { calculateBaseStats } from './item-stats';

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
                      subLevel: 0,
                      stats: calculateBaseStats(item.type, item1.level, item.variation)
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
                        subLevel: 0,
                        stats: calculateBaseStats(item.type, item.level + 1, item.variation)
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
                        subLevel: 0,
                        stats: calculateBaseStats(item.type, item.level + 1, item.variation)
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
                      subLevel: 0,
                      stats: calculateBaseStats(item.type, item.level + 1, item.variation)
                    };
                  }
                }
                return item;
              })
          };
        });
      },

      moveItem: (itemId: string, newPosition: number) => {
        const { items, equippedItems } = get();
        
        // Find the item being moved
        const movingItem = items.find(i => i.id === itemId);
        if (!movingItem) return;

        // Check if item is equipped
        const equippedSlot = Object.entries(equippedItems)
          .find(([_, id]) => id === itemId)?.[0] as EquipmentSlot | undefined;

        // If position is invalid, return item to its original position
        if (newPosition < 0 || newPosition >= 25) {
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
          set(state => ({
            equippedItems: {
              ...state.equippedItems,
              [equippedSlot]: null
            },
            items: state.items.map(item =>
              item.id === itemId 
                ? { ...item, position: newPosition, isEquipped: false }
                : item
            )
          }));
          return;
        }

        // Handle normal grid movement
        const existingItem = items.find(i => i.position === newPosition && !i.isEquipped);
        
        // If there's an existing item and it's not the same item
        if (existingItem && existingItem.id !== itemId) {
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

            return {
              ...state,
              items: newItems
            };
          });
        } else {
          set(state => ({
            items: state.items.map(item =>
              item.id === itemId ? { ...item, position: newPosition, isEquipped: false } : item
            )
          }));
        }
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
        const { items, equippedItems } = get();
        const itemId = equippedItems[slot];
        if (!itemId) return;

        // Find first available grid position
        const occupiedPositions = new Set(items.filter(i => !i.isEquipped).map(i => i.position));
        let newPosition = 0;
        while (occupiedPositions.has(newPosition)) {
          newPosition++;
        }

        // Only unequip if there's space in the grid
        if (newPosition < 25) {
          set(state => ({
            items: state.items.map(i => 
              i.id === itemId 
                ? { ...i, isEquipped: false, position: newPosition }
                : i
            ),
            equippedItems: {
              ...state.equippedItems,
              [slot]: null
            }
          }));
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

export * from './types';
export * from './constants';
export * from './item-stats'; 