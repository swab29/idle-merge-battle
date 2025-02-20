import { type EnemyType, type EnemyVariation, type Player, type Enemy, type EnemyAbility, type EnemyModifiers } from './types';

export const INITIAL_PLAYER: Player = {
  maxHealth: 100,
  currentHealth: 100,
  attack: 10,
  defense: 5,
  speed: 5,
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
  attackSpeed: 1,
  criticalChance: 5,
  criticalDamage: 1.5,
  moveSpeed: 50,
  gameSpeed: 1,
  prestigeMultiplier: 1,
  doubleCurrencyChance: 0,
  quintupleCurrencyChance: 0,
  animationState: 'idle',
  lastAttackTime: 0,
  blockChance: 0,
  hpRegen: 5,
  lastBossAttempt: null,
  winsInCurrentLevel: 0
};

export const ENEMY_TYPE_MULTIPLIERS: Record<EnemyType, {
  health: number;
  attack: number;
  defense: number;
  experience: number;
  currency: number;
}> = {
  normal: {
    health: 1,
    attack: 1,
    defense: 1,
    experience: 1,
    currency: 1
  },
  elite: {
    health: 2,
    attack: 1.5,
    defense: 1.5,
    experience: 2,
    currency: 2
  },
  boss: {
    health: 3,
    attack: 2,
    defense: 2,
    experience: 5,
    currency: 5
  }
};

export const ENEMY_VARIATIONS: Record<EnemyVariation, {
  modifiers: EnemyModifiers;
  abilities: EnemyAbility[];
}> = {
  swift: {
    modifiers: {
      attackSpeedModifier: 0.75,
      defense: 0.8,
      moveSpeed: 1.5
    },
    abilities: [{
      name: 'Quick Strike',
      cooldown: 10000,
      lastUsed: 0,
      execute: (enemy, player) => {
        enemy.attackSpeedModifier *= 0.5;
        setTimeout(() => {
          enemy.attackSpeedModifier *= 2;
        }, 3000);
      }
    }]
  },
  brutal: {
    modifiers: {
      attackModifier: 1.5,
      attackSpeedModifier: 1.25,
      defense: 1.2
    },
    abilities: [{
      name: 'Crushing Blow',
      cooldown: 15000,
      lastUsed: 0,
      execute: (enemy, player) => {
        enemy.attackModifier *= 2;
        setTimeout(() => {
          enemy.attackModifier /= 2;
        }, 5000);
      }
    }]
  },
  tank: {
    modifiers: {
      health: 1.5,
      defense: 2,
      attack: 0.7
    },
    abilities: [{
      name: 'Iron Shell',
      cooldown: 20000,
      lastUsed: 0,
      execute: (enemy, player) => {
        enemy.defense *= 3;
        setTimeout(() => {
          enemy.defense /= 3;
        }, 4000);
      }
    }]
  },
  berserker: {
    modifiers: {
      health: 0.8,
      attack: 1.2,
      enraged: false
    },
    abilities: [{
      name: 'Berserk',
      cooldown: 12000,
      lastUsed: 0,
      execute: (enemy, player) => {
        if (enemy.currentHealth < enemy.maxHealth * 0.3 && !enemy.enraged) {
          enemy.enraged = true;
          enemy.attack *= 2;
          enemy.attackSpeedModifier *= 1.5;
        }
      }
    }]
  },
  vampire: {
    modifiers: {
      lifeSteal: 0.2,
      health: 0.9,
      attack: 1.1
    },
    abilities: [{
      name: 'Life Drain',
      cooldown: 8000,
      lastUsed: 0,
      execute: (enemy, player) => {
        const healing = enemy.attack * enemy.lifeSteal * 2;
        enemy.currentHealth = Math.min(enemy.maxHealth, enemy.currentHealth + healing);
      }
    }]
  }
}; 