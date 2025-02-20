import { type Upgrade } from '../upgrade-store';

export type CurrencyType = 'A' | 'B' | 'C' | 'D';
export type AnimationState = 'idle' | 'walking' | 'attacking' | 'hit' | 'dead';
export type EnemyType = 'normal' | 'elite' | 'boss';
export type EnemyVariation = 'swift' | 'brutal' | 'tank' | 'berserker' | 'vampire';

export interface Character {
  maxHealth: number;
  currentHealth: number;
  attack: number;
  defense: number;
  speed: number;
  blockChance: number;
  animationState: AnimationState;
  lastAttackTime: number;
}

export interface EnemyAbility {
  name: string;
  cooldown: number;
  lastUsed: number;
  execute: (enemy: Enemy, player: Player) => void;
}

export interface EnemyModifiers {
  health?: number;
  attack?: number;
  defense?: number;
  moveSpeed?: number;
  attackSpeedModifier?: number;
  attackModifier?: number;
  enraged?: boolean;
  lifeSteal?: number;
}

export interface Enemy extends Character {
  name: string;
  level: number;
  attackSpeedBase: number;
  attackSpeedModifier: number;
  attackModifier: number;
  type: EnemyType;
  variation: EnemyVariation;
  abilities: EnemyAbility[];
  enraged: boolean;
  lifeSteal: number;
  moveSpeed: number;
}

export interface Player extends Character {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  attackSpeed: number;
  criticalChance: number;
  criticalDamage: number;
  moveSpeed: number;
  gameSpeed: number;
  prestigeMultiplier: number;
  doubleCurrencyChance: number;
  quintupleCurrencyChance: number;
  hpRegen: number;
  lastBossAttempt: number | null;
  winsInCurrentLevel: number;
}

export interface CombatResult {
  damage: number;
  isCritical: boolean;
  isBlocked: boolean;
  currencyGained?: {
    type: CurrencyType;
    amount: number;
  }[];
  experienceGained?: number;
}

export interface BattleState {
  player: Player | null;
  currentEnemy: Enemy | null;
  isInCombat: boolean;
  currentWave: number;
  currentLevel: number;
  maxUnlockedLevel: number;
  progressToNextEnemy: number;
  isPaused: boolean;
  lastEnemyFaced: { type: EnemyType; variation: EnemyVariation } | null;
  winsInCurrentLevel: number;
  currencies: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  upgradeCaps: {
    tier1: number;
    tier2: number;
    tier3: number;
    tier4: number;
  };
  defeatedBosses: number[];
  currentLevelBossAttempted: boolean;
  bossFightCooldown: number | null;
  combatStats: {
    totalDamageDealt: number;
    battleStartTime: number | null;
    lastBattleDuration: number;
    averageDPS: number;
    battlesTracked: number;
    totalBattleTime: number;
  };
}

export interface BattleStore extends BattleState {
  attack: (source: 'player' | 'enemy') => void;
  heal: (target: 'player' | 'enemy') => void;
  initializePlayer: () => void;
  generateEnemy: () => void;
  updateProgress: (delta: number) => void;
  resetProgress: () => void;
  addCurrency: (type: CurrencyType, amount: number) => void;
  deductCurrency: (type: CurrencyType, amount: number) => void;
  updateAnimationState: (entity: 'player' | 'enemy', newState: AnimationState) => void;
  processBattleTick: () => void;
  handleEnemyDeath: () => void;
  handlePlayerDeath: () => void;
  applyUpgradeEffect: (upgrade: Upgrade) => void;
  recalculateUpgradeEffects: (upgrades: Upgrade[]) => void;
  togglePause: () => void;
  stopFight: () => void;
  increaseLevel: () => void;
  decreaseLevel: () => void;
  generateBoss: () => void;
  startBossFight: () => void;
} 