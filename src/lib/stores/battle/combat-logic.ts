import { type Character, type CombatResult, type Enemy, type Player } from './types';

export function calculateDamage(attacker: Character, defender: Character): CombatResult {
  // Roll for block
  const isBlocked = Math.random() < defender.blockChance / 100;
  if (isBlocked) {
    return { damage: 0, isCritical: false, isBlocked: true };
  }

  // Roll for critical hit (only players can crit)
  const isPlayer = 'criticalChance' in attacker;
  const isCritical = isPlayer && Math.random() < (attacker as Player).criticalChance / 100;
  
  // Base damage calculation
  let damage = attacker.attack * (1 - (defender.defense / (defender.defense + 100)));
  
  // Apply critical multiplier if applicable
  if (isCritical) {
    damage *= (attacker as Player).criticalDamage;
  }

  // Add some randomness (±10%)
  const variance = 0.9 + Math.random() * 0.2;
  damage *= variance;

  return {
    damage: Math.max(1, Math.floor(damage)), // Minimum 1 damage
    isCritical,
    isBlocked: false
  };
}

export function calculateCombatRewards(enemy: Enemy, player: Player): { currencies: NonNullable<CombatResult['currencyGained']> } {
  // Base currency is level * 10
  const baseCurrency = enemy.level * 10;

  // Apply elite multiplier (2x for elite enemies)
  const typeMultiplier = enemy.type === 'elite' ? 2 : 1;

  // Apply prestige multiplier
  const prestigeMultiplier = player.prestigeMultiplier;

  // Roll for currency multipliers
  let currencyMultiplier = 1;
  if (Math.random() < player.doubleCurrencyChance / 100) {
    currencyMultiplier = 2;
  }
  if (Math.random() < player.quintupleCurrencyChance / 100) {
    currencyMultiplier = 5;
  }

  // Calculate final currency amounts
  const currencies: NonNullable<CombatResult['currencyGained']> = [
    { type: 'A', amount: Math.floor(baseCurrency * typeMultiplier * currencyMultiplier * prestigeMultiplier) }
  ];

  // Add higher tier currencies based on enemy level
  if (enemy.level >= 10) {
    currencies.push({ 
      type: 'B', 
      amount: Math.floor((baseCurrency / 5) * typeMultiplier * currencyMultiplier * prestigeMultiplier) 
    });
  }
  if (enemy.level >= 25) {
    currencies.push({ 
      type: 'C', 
      amount: Math.floor((baseCurrency / 10) * typeMultiplier * currencyMultiplier * prestigeMultiplier) 
    });
  }
  if (enemy.level >= 50) {
    currencies.push({ 
      type: 'D', 
      amount: Math.floor((baseCurrency / 20) * typeMultiplier * currencyMultiplier * prestigeMultiplier) 
    });
  }

  return { currencies };
} 