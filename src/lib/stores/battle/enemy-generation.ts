import { type Enemy, type EnemyType, type EnemyVariation } from './types';
import { ENEMY_TYPE_MULTIPLIERS, ENEMY_VARIATIONS } from './constants';

export function generateEnemy(currentLevel: number, currentWave: number, forcedType?: EnemyType): Enemy {
  // Determine enemy type
  let enemyType: EnemyType = 'normal';
  if (!forcedType) {
    if (currentWave % 10 === 0) {
      enemyType = 'boss';
    } else if (currentWave % 5 === 0) {
      enemyType = 'elite';
    }
  } else {
    enemyType = forcedType;
  }

  // Select random variation
  const variations = Object.keys(ENEMY_VARIATIONS) as EnemyVariation[];
  const variation = variations[Math.floor(Math.random() * variations.length)];

  console.log(`🎯 Generating new ${variation} ${enemyType} enemy at level ${currentLevel}`);

  // Calculate base stats
  const baseHealth = 50 + currentLevel * 10;
  const baseAttack = 5 + currentLevel * 2;
  const baseDefense = 2 + currentLevel;

  // Apply type multipliers
  const typeMultipliers = ENEMY_TYPE_MULTIPLIERS[enemyType];
  const variationModifiers = ENEMY_VARIATIONS[variation].modifiers;

  const enemy: Enemy = {
    name: `${variation} ${enemyType === 'normal' ? '' : enemyType} Enemy`,
    maxHealth: baseHealth * typeMultipliers.health * (variationModifiers.health || 1),
    currentHealth: baseHealth * typeMultipliers.health * (variationModifiers.health || 1),
    attack: baseAttack * typeMultipliers.attack * (variationModifiers.attack || 1),
    defense: baseDefense * typeMultipliers.defense * (variationModifiers.defense || 1),
    speed: 3 + currentLevel * (variationModifiers.moveSpeed || 1),
    animationState: 'idle',
    lastAttackTime: 0,
    attackSpeedBase: 2.0,
    attackSpeedModifier: variationModifiers.attackSpeedModifier || 1,
    attackModifier: variationModifiers.attackModifier || 1,
    blockChance: Math.min(5 + currentLevel, 25), // Cap at 25%
    level: currentLevel,
    type: enemyType,
    variation: variation,
    abilities: ENEMY_VARIATIONS[variation].abilities.map(ability => ({
      name: ability.name,
      cooldown: ability.cooldown,
      lastUsed: 0,
      execute: ability.execute
    })),
    enraged: variationModifiers.enraged || false,
    lifeSteal: variationModifiers.lifeSteal || 0,
    moveSpeed: 3 + currentLevel * (variationModifiers.moveSpeed || 1)
  };

  return enemy;
}

export function generateBoss(currentLevel: number, lastBossVariation?: EnemyVariation): Enemy {
  // Don't generate the same boss variation twice in a row
  const availableVariations = Object.keys(ENEMY_VARIATIONS)
    .filter(v => v !== lastBossVariation) as EnemyVariation[];
  const variation = availableVariations[Math.floor(Math.random() * availableVariations.length)];

  // Create boss with current level scaling
  const baseHealth = 100 * Math.pow(1.1, currentLevel);
  const baseAttack = 10 * Math.pow(1.1, currentLevel);
  const baseDefense = 5 * Math.pow(1.08, currentLevel);

  const typeMultipliers = ENEMY_TYPE_MULTIPLIERS.boss;
  const variationModifiers = ENEMY_VARIATIONS[variation].modifiers;

  const boss: Enemy = {
    name: `${variation} Boss`,
    maxHealth: baseHealth * typeMultipliers.health * (variationModifiers.health || 1),
    currentHealth: baseHealth * typeMultipliers.health * (variationModifiers.health || 1),
    attack: baseAttack * typeMultipliers.attack * (variationModifiers.attack || 1),
    defense: baseDefense * typeMultipliers.defense * (variationModifiers.defense || 1),
    speed: 3 + currentLevel * (variationModifiers.moveSpeed || 1),
    animationState: 'idle',
    lastAttackTime: 0,
    attackSpeedBase: 2.0,
    attackSpeedModifier: variationModifiers.attackSpeedModifier || 1,
    attackModifier: variationModifiers.attackModifier || 1,
    blockChance: Math.min(5 + currentLevel, 25),
    level: currentLevel,
    type: 'boss',
    variation: variation,
    abilities: ENEMY_VARIATIONS[variation].abilities.map(ability => ({
      name: ability.name,
      cooldown: ability.cooldown,
      lastUsed: 0,
      execute: ability.execute
    })),
    enraged: variationModifiers.enraged || false,
    lifeSteal: variationModifiers.lifeSteal || 0,
    moveSpeed: 3 + currentLevel * (variationModifiers.moveSpeed || 1)
  };

  return boss;
} 