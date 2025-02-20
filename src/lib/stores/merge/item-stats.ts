import { type ItemType, type ItemStats, type Variation, type ItemSetBonus } from './types';
import { BASE_STATS, VARIATION_STATS, SET_BONUSES } from './constants';

export function calculateBaseStats(type: ItemType, level: number, variation: Variation): ItemStats {
  // Start with default stats
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

  // Apply base stats for the item type
  const baseStats = BASE_STATS[type];
  Object.entries(baseStats).forEach(([stat, value]) => {
    stats[stat as keyof ItemStats] = value * Math.pow(1.1, level - 1);
  });

  // Apply variation bonuses
  const variationBonus = VARIATION_STATS[variation];
  stats[variationBonus.primary] *= 1.5;  // 50% bonus to primary stat
  stats[variationBonus.secondary] *= 1.2; // 20% bonus to secondary stat

  return stats;
}

export function calculateSetBonuses(equippedItems: { type: ItemType; variation: Variation }[]): Partial<ItemStats> {
  const bonusStats: ItemStats = {
    attack: 0,
    defense: 0,
    health: 0,
    criticalChance: 0,
    criticalDamage: 0,
    attackSpeed: 0,
    blockChance: 0,
    moveSpeed: 0
  };

  // Count items of each variation
  const variationCounts = equippedItems.reduce((counts, item) => {
    counts[item.variation] = (counts[item.variation] || 0) + 1;
    return counts;
  }, {} as Record<Variation, number>);

  // Apply set bonuses based on counts
  Object.entries(variationCounts).forEach(([variation, count]) => {
    const setBonus = SET_BONUSES[variation as Variation];
    setBonus.forEach((bonus: ItemSetBonus) => {
      if (count >= bonus.requiredPieces) {
        bonus.bonuses.forEach(({ type, value }) => {
          bonusStats[type] += value;
        });
      }
    });
  });

  return bonusStats;
} 