import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useBattleStore } from './battle';

export type UpgradeTier = 'tier1' | 'tier2' | 'tier3' | 'tier4';
export type CurrencyType = 'A' | 'B' | 'C' | 'D';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  tier: UpgradeTier;
  cost: {
    type: CurrencyType;
    amount: number;
    scaling: number; // Cost multiplier per level
  };
  effect: {
    type: 'attack' | 'health' | 'speed' | 'gameSpeed' | 'critical' | 'block' | 'currency' | 'prestige' | 'enemySpeed' | 'enemyAttack' | 'enemyCritical' | 'combat' | 'upgradeCap';
    value: number;
    scaling: number; // Effect multiplier per level
    subType?: 'chance' | 'multiplier' | 'flat' | 'tier1' | 'tier2' | 'tier3' | 'tier4';
  };
  purchased: boolean;
  isActive: boolean;
  maxLevel: number;
  currentLevel: number;
}

interface UpgradeStore {
  upgrades: Upgrade[];
  purchaseUpgrade: (id: string) => void;
  toggleUpgrade: (id: string) => void;
  canPurchaseUpgrade: (id: string) => boolean;
  resetUpgrades: () => void;
  getUpgradesByTier: (tier: UpgradeTier) => Upgrade[];
  getTierPurchaseCount: (tier: UpgradeTier) => number;
  calculateUpgradeCost: (upgrade: Upgrade) => number;
  calculateUpgradeEffect: (upgrade: Upgrade) => number;
}

// Initial upgrades data
const INITIAL_UPGRADES: Upgrade[] = [
  // Tier 1 Upgrades
  {
    id: 'attack_boost_1',
    name: 'Attack Boost I',
    description: '+1 Attack Damage',
    tier: 'tier1',
    cost: { type: 'A', amount: 10, scaling: 1.5 },
    effect: { type: 'attack', value: 1, scaling: 1, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 10,
    currentLevel: 0
  },
  {
    id: 'health_boost_1',
    name: 'Health Boost I',
    description: '+2 HP',
    tier: 'tier1',
    cost: { type: 'A', amount: 10, scaling: 1.5 },
    effect: { type: 'health', value: 2, scaling: 1, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 10,
    currentLevel: 0
  },
  {
    id: 'speed_boost_1',
    name: 'Speed Boost I',
    description: '+0.03 Move Speed',
    tier: 'tier1',
    cost: { type: 'A', amount: 15, scaling: 1.5 },
    effect: { type: 'speed', value: 0.03, scaling: 1, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },
  {
    id: 'game_speed_1',
    name: 'Game Speed I',
    description: '+2% Game Speed',
    tier: 'tier1',
    cost: { type: 'A', amount: 20, scaling: 1.5 },
    effect: { type: 'gameSpeed', value: 0.02, scaling: 1, subType: 'multiplier' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },
  {
    id: 'critical_package_1',
    name: 'Critical Package I',
    description: '+1% Crit Chance, +0.10 Crit Damage',
    tier: 'tier1',
    cost: { type: 'A', amount: 25, scaling: 1.5 },
    effect: { type: 'critical', value: 1, scaling: 1, subType: 'chance' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },

  // Tier 2 Upgrades
  {
    id: 'health_boost_2',
    name: 'Health Boost II',
    description: '+3 HP',
    tier: 'tier2',
    cost: { type: 'B', amount: 5, scaling: 1.5 },
    effect: { type: 'health', value: 3, scaling: 1, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 10,
    currentLevel: 0
  },
  {
    id: 'enemy_slowdown_1',
    name: 'Enemy Slowdown I',
    description: '-0.02 Enemy Attack Speed',
    tier: 'tier2',
    cost: { type: 'B', amount: 8, scaling: 1.5 },
    effect: { type: 'enemySpeed', value: -0.02, scaling: 1, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },
  {
    id: 'enemy_weakening_1',
    name: 'Enemy Weakening I',
    description: '-1 Enemy Damage',
    tier: 'tier2',
    cost: { type: 'B', amount: 8, scaling: 1.5 },
    effect: { type: 'enemyAttack', value: -1, scaling: 1, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },
  {
    id: 'enemy_critical_reduction',
    name: 'Enemy Critical Reduction',
    description: '-1% Enemy Crit Chance, -0.10 Enemy Crit Damage',
    tier: 'tier2',
    cost: { type: 'B', amount: 10, scaling: 1.5 },
    effect: { type: 'enemyCritical', value: -1, scaling: 1, subType: 'chance' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },
  {
    id: 'combat_package_1',
    name: 'Combat Package I',
    description: '+1 Damage, +0.01 Attack Speed',
    tier: 'tier2',
    cost: { type: 'B', amount: 12, scaling: 1.5 },
    effect: { type: 'combat', value: 1, scaling: 1, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },
  {
    id: 'tier2_capacity',
    name: 'Tier 2 Capacity',
    description: '+1 Tier 2 Upgrade Cap',
    tier: 'tier2',
    cost: { type: 'B', amount: 15, scaling: 1.5 },
    effect: { type: 'upgradeCap', value: 1, scaling: 1, subType: 'tier2' },
    purchased: false,
    isActive: true,
    maxLevel: 3,
    currentLevel: 0
  },
  {
    id: 'prestige_boost_2',
    name: 'Prestige Boost II',
    description: '+2% Prestige Bonus',
    tier: 'tier2',
    cost: { type: 'B', amount: 20, scaling: 1.5 },
    effect: { type: 'prestige', value: 0.02, scaling: 1, subType: 'multiplier' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },

  // Tier 3 Upgrades
  {
    id: 'health_boost_3',
    name: 'Health Boost III',
    description: '+5 HP',
    tier: 'tier3',
    cost: { type: 'C', amount: 3, scaling: 2 },
    effect: { type: 'health', value: 5, scaling: 1.2, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 10,
    currentLevel: 0
  },
  {
    id: 'enemy_slowdown_2',
    name: 'Enemy Slowdown II',
    description: '-0.05 Enemy Attack Speed',
    tier: 'tier3',
    cost: { type: 'C', amount: 5, scaling: 2 },
    effect: { type: 'enemySpeed', value: -0.05, scaling: 1.2, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },
  {
    id: 'enemy_weakening_2',
    name: 'Enemy Weakening II',
    description: '-2 Enemy Damage',
    tier: 'tier3',
    cost: { type: 'C', amount: 5, scaling: 2 },
    effect: { type: 'enemyAttack', value: -2, scaling: 1.2, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },
  {
    id: 'combat_package_2',
    name: 'Combat Package II',
    description: '+2 Damage, +0.02 Attack Speed',
    tier: 'tier3',
    cost: { type: 'C', amount: 8, scaling: 2 },
    effect: { type: 'combat', value: 2, scaling: 1.2, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },
  {
    id: 'tier3_capacity',
    name: 'Tier 3 Capacity',
    description: '+1 Tier 3 Upgrade Cap',
    tier: 'tier3',
    cost: { type: 'C', amount: 10, scaling: 2 },
    effect: { type: 'upgradeCap', value: 1, scaling: 1, subType: 'tier3' },
    purchased: false,
    isActive: true,
    maxLevel: 2,
    currentLevel: 0
  },
  {
    id: 'prestige_boost_3',
    name: 'Prestige Boost III',
    description: '+5% Prestige Bonus',
    tier: 'tier3',
    cost: { type: 'C', amount: 15, scaling: 2 },
    effect: { type: 'prestige', value: 0.05, scaling: 1.2, subType: 'multiplier' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },

  // Tier 4 Upgrades
  {
    id: 'health_boost_4',
    name: 'Health Boost IV',
    description: '+10 HP',
    tier: 'tier4',
    cost: { type: 'D', amount: 2, scaling: 3 },
    effect: { type: 'health', value: 10, scaling: 1.5, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 10,
    currentLevel: 0
  },
  {
    id: 'enemy_mastery',
    name: 'Enemy Mastery',
    description: '-0.1 Enemy Attack Speed, -3 Enemy Damage',
    tier: 'tier4',
    cost: { type: 'D', amount: 3, scaling: 3 },
    effect: { type: 'enemySpeed', value: -0.1, scaling: 1.5, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },
  {
    id: 'combat_mastery',
    name: 'Combat Mastery',
    description: '+3 Damage, +0.03 Attack Speed, +5% Crit Chance',
    tier: 'tier4',
    cost: { type: 'D', amount: 5, scaling: 3 },
    effect: { type: 'combat', value: 3, scaling: 1.5, subType: 'flat' },
    purchased: false,
    isActive: true,
    maxLevel: 5,
    currentLevel: 0
  },
  {
    id: 'prestige_mastery',
    name: 'Prestige Mastery',
    description: '+10% Prestige Bonus',
    tier: 'tier4',
    cost: { type: 'D', amount: 8, scaling: 3 },
    effect: { type: 'prestige', value: 0.1, scaling: 1.5, subType: 'multiplier' },
    purchased: false,
    isActive: true,
    maxLevel: 3,
    currentLevel: 0
  }
];

export const useUpgradeStore = create<UpgradeStore>()(
  persist(
    (set, get) => ({
      upgrades: INITIAL_UPGRADES,

      getUpgradesByTier: (tier: UpgradeTier) => {
        return get().upgrades.filter(u => u.tier === tier);
      },

      getTierPurchaseCount: (tier: UpgradeTier) => {
        return get().upgrades
          .filter(u => u.tier === tier && u.isActive)
          .reduce((sum, u) => sum + u.currentLevel, 0);
      },

      calculateUpgradeCost: (upgrade: Upgrade) => {
        const baseCost = upgrade.cost.amount;
        const scaling = upgrade.cost.scaling;
        return Math.floor(baseCost * Math.pow(scaling, upgrade.currentLevel));
      },

      calculateUpgradeEffect: (upgrade: Upgrade) => {
        const baseEffect = upgrade.effect.value;
        const scaling = upgrade.effect.scaling;
        return baseEffect * (1 + (scaling * upgrade.currentLevel));
      },

      toggleUpgrade: (id: string) => {
        const state = get();
        const upgrade = state.upgrades.find(u => u.id === id);
        if (!upgrade || !upgrade.purchased) return;

        const battleStore = useBattleStore.getState();
        if (!battleStore) return;

        // Check if deactivating would exceed tier cap
        const newIsActive = !upgrade.isActive;
        if (newIsActive) {
          const tierCount = state.getTierPurchaseCount(upgrade.tier);
          const tierCap = battleStore.upgradeCaps[upgrade.tier];
          if (tierCount + upgrade.currentLevel > tierCap) return;
        }

        // Update upgrade state
        set(state => ({
          upgrades: state.upgrades.map(u =>
            u.id === id
              ? {
                  ...u,
                  isActive: newIsActive
                }
              : u
          )
        }));

        // Recalculate all active upgrades
        const activeUpgrades = state.upgrades.filter(u => u.purchased && u.isActive);
        battleStore.recalculateUpgradeEffects(activeUpgrades);
      },

      purchaseUpgrade: (id: string) => {
        const state = get();
        const upgrade = state.upgrades.find(u => u.id === id);
        if (!upgrade) return;

        const battleStore = useBattleStore.getState();
        if (!battleStore) return;

        // Check level cap
        if (upgrade.currentLevel >= upgrade.maxLevel) return;

        // Check tier cap
        const tierCount = state.getTierPurchaseCount(upgrade.tier);
        const tierCap = battleStore.upgradeCaps[upgrade.tier];
        if (tierCount >= tierCap) return;

        // Calculate current cost
        const currentCost = state.calculateUpgradeCost(upgrade);
        
        // Check if we can afford
        if (battleStore.currencies[upgrade.cost.type] < currentCost) return;

        // Calculate effect
        const effectValue = state.calculateUpgradeEffect(upgrade);

        // Deduct currency
        battleStore.deductCurrency(upgrade.cost.type, currentCost);

        // Apply upgrade effect with calculated value
        battleStore.applyUpgradeEffect({
          ...upgrade,
          effect: {
            ...upgrade.effect,
            value: effectValue
          }
        });

        // Update upgrade state
        set(state => ({
          upgrades: state.upgrades.map(u =>
            u.id === id
              ? {
                  ...u,
                  purchased: true,
                  isActive: true,
                  currentLevel: u.currentLevel + 1
                }
              : u
          )
        }));
      },

      canPurchaseUpgrade: (id: string) => {
        const state = get();
        const upgrade = state.upgrades.find(u => u.id === id);
        if (!upgrade) return false;

        // Check level cap
        if (upgrade.currentLevel >= upgrade.maxLevel) return false;

        // Check tier cap
        const tierCount = state.getTierPurchaseCount(upgrade.tier);
        const battleStore = useBattleStore.getState();
        if (!battleStore) return false;
        
        if (tierCount >= battleStore.upgradeCaps[upgrade.tier]) return false;

        // Calculate current cost
        const currentCost = state.calculateUpgradeCost(upgrade);

        // Check if we can afford
        return battleStore.currencies[upgrade.cost.type] >= currentCost;
      },

      resetUpgrades: () => {
        set({ upgrades: INITIAL_UPGRADES });
      }
    }),
    {
      name: 'upgrade-storage'
    }
  )
); 