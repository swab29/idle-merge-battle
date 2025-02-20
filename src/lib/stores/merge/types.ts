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

export interface MergeStore {
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