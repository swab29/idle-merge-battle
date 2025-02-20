import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Upgrade } from '../upgrade-store';
import { type BattleStore, type BattleState, type CurrencyType, type AnimationState, type EnemyType } from './types';
import { INITIAL_PLAYER } from './constants';
import { calculateDamage, calculateCombatRewards } from './combat-logic';
import { generateEnemy, generateBoss } from './enemy-generation';

export const useBattleStore = create<BattleStore>()(
  persist(
    (set, get) => ({
      player: null,
      currentEnemy: null,
      isInCombat: false,
      currentWave: 1,
      currentLevel: 1,
      progressToNextEnemy: 0,
      currencies: {
        A: 0,
        B: 0,
        C: 0,
        D: 0
      },
      upgradeCaps: {
        tier1: 17,
        tier2: 19,
        tier3: 16,
        tier4: 11
      },
      isPaused: false,
      maxUnlockedLevel: 1,
      lastEnemyFaced: null,
      winsInCurrentLevel: 0,
      defeatedBosses: [],
      currentLevelBossAttempted: false,
      bossFightCooldown: null,

      // Combat statistics
      combatStats: {
        totalDamageDealt: 0,
        battleStartTime: null as number | null,
        lastBattleDuration: 0,
        averageDPS: 0,
        battlesTracked: 0,
        totalBattleTime: 0,
      },

      initializePlayer: () => {
        set({ player: { ...INITIAL_PLAYER } });
      },

      generateEnemy: () => {
        const state = get();
        // Force normal enemy if boss has been attempted at wave 10
        const forcedType = (state.currentWave === 10 && state.currentLevelBossAttempted) ? 'normal' : undefined;
        const enemy = generateEnemy(state.currentLevel, state.currentWave, forcedType);
        console.log(`🎮 New enemy spawned: Level ${state.currentLevel} Wave ${state.currentWave}`, {
          type: enemy.type,
          variation: enemy.variation,
          bossAttempted: state.currentLevelBossAttempted
        });
        
        // Reset combat stats for new battle
        set(state => ({ 
          currentEnemy: enemy, 
          isInCombat: true,
          combatStats: {
            ...state.combatStats,
            battleStartTime: Date.now(),
            totalDamageDealt: 0
          }
        }));
      },

      updateProgress: (delta: number) => {
        set(state => {
          const newProgress = state.progressToNextEnemy + delta;
          if (newProgress >= 100) {
            get().generateEnemy();
            return { progressToNextEnemy: 0 };
          }
          return { progressToNextEnemy: newProgress };
        });
      },

      processBattleTick: () => {
        const state = get();
        if (state.isPaused || !state.player || !state.currentEnemy) return;

        const now = Date.now();
        const player = state.player;
        const enemy = state.currentEnemy;

        // Handle HP regeneration when not in combat
        if (!state.isInCombat && !state.isPaused) {
          const newHealth = Math.min(
            state.player.maxHealth,
            state.player.currentHealth + (state.player.hpRegen / 1000)
          );
          
          if (newHealth !== state.player.currentHealth) {
            set(state => ({
              player: {
                ...state.player!,
                currentHealth: newHealth
              }
            }));
          }
        }

        // Process enemy abilities
        enemy.abilities.forEach(ability => {
          if (now - ability.lastUsed >= ability.cooldown) {
            console.log(`⚡ Enemy using ability: ${ability.name}`);
            ability.execute(enemy, player);
            ability.lastUsed = now;
          }
        });

        // Process player attack
        if (now - player.lastAttackTime >= (1000 / player.attackSpeed)) {
          const playerAttackResult = calculateDamage(player, enemy);
          
          if (playerAttackResult.isBlocked) {
            set(state => ({
              currentEnemy: {
                ...state.currentEnemy!,
                animationState: 'hit'
              }
            }));
          } else {
            const damage = playerAttackResult.damage;
            
            set(state => ({
              currentEnemy: {
                ...state.currentEnemy!,
                currentHealth: Math.max(0, state.currentEnemy!.currentHealth - damage),
                animationState: 'hit'
              },
              player: {
                ...state.player!,
                animationState: 'attacking',
                lastAttackTime: now
              },
              combatStats: {
                ...state.combatStats,
                totalDamageDealt: state.combatStats.totalDamageDealt + damage
              }
            }));
          }

          // Check for enemy death
          if (enemy.currentHealth - playerAttackResult.damage <= 0) {
            console.log('💀 Enemy defeated!');
            get().handleEnemyDeath();
            return;
          }
        }

        // Process enemy attack
        if (now - enemy.lastAttackTime >= (1000 * enemy.attackSpeedBase * enemy.attackSpeedModifier)) {
          const enemyAttackResult = calculateDamage(enemy, player);
          
          if (enemyAttackResult.isBlocked) {
            set(state => ({
              player: {
                ...state.player!,
                animationState: 'hit'
              }
            }));
          } else {
            const damage = enemyAttackResult.damage;
            
            // Apply life steal if enemy has it
            const lifeStealAmount = enemy.lifeSteal ? enemyAttackResult.damage * enemy.lifeSteal : 0;
            
            set(state => ({
              player: {
                ...state.player!,
                currentHealth: Math.max(0, state.player!.currentHealth - damage),
                animationState: 'hit'
              },
              currentEnemy: {
                ...state.currentEnemy!,
                currentHealth: Math.min(
                  state.currentEnemy!.maxHealth,
                  state.currentEnemy!.currentHealth + lifeStealAmount
                ),
                animationState: 'attacking',
                lastAttackTime: now
              }
            }));
          }

          // Check for player death
          if (player.currentHealth - enemyAttackResult.damage <= 0) {
            console.log('💀 Player defeated!');
            get().handlePlayerDeath();
            return;
          }
        }

        // Reset animation states
        setTimeout(() => {
          set(state => ({
            player: {
              ...state.player!,
              animationState: 'idle'
            },
            currentEnemy: {
              ...state.currentEnemy!,
              animationState: 'idle'
            }
          }));
        }, 500);
      },

      handleEnemyDeath: () => {
        const state = get();
        if (!state.player || !state.currentEnemy) return;

        // Calculate battle statistics
        const battleDuration = (Date.now() - (state.combatStats.battleStartTime || Date.now())) / 1000;
        const dps = state.combatStats.totalDamageDealt / battleDuration;
        
        console.log('⚔️ Battle Statistics:', {
          duration: `${battleDuration.toFixed(1)}s`,
          totalDamage: Math.floor(state.combatStats.totalDamageDealt),
          dps: Math.floor(dps),
          enemyType: state.currentEnemy.type,
          enemyHealth: Math.floor(state.currentEnemy.maxHealth)
        });

        // Update average statistics
        const newBattlesTracked = state.combatStats.battlesTracked + 1;
        const newTotalTime = state.combatStats.totalBattleTime + battleDuration;
        const newAverageDPS = ((state.combatStats.averageDPS * state.combatStats.battlesTracked) + dps) / newBattlesTracked;

        // Calculate rewards
        const rewards = calculateCombatRewards(state.currentEnemy, state.player);
        
        console.log('🎁 Battle Rewards:', {
          currencies: rewards.currencies,
          enemyType: state.currentEnemy.type,
          wave: state.currentWave,
          winsInLevel: state.winsInCurrentLevel + 1
        });

        // Apply rewards immediately
        const newCurrencies = { ...state.currencies };
        rewards.currencies.forEach(currency => {
          newCurrencies[currency.type] = (newCurrencies[currency.type] || 0) + currency.amount;
        });

        // Increment wins in current level
        const newWinsInLevel = state.winsInCurrentLevel + 1;

        // Handle boss defeat
        if (state.currentEnemy.type === 'boss') {
          // Add current level to defeated bosses if not already there
          const newDefeatedBosses = state.defeatedBosses.includes(state.currentLevel) 
            ? state.defeatedBosses 
            : [...state.defeatedBosses, state.currentLevel];

          console.log('👑 Boss defeated!', {
            level: state.currentLevel,
            defeatedBosses: newDefeatedBosses,
            maxUnlockedLevel: Math.max(state.maxUnlockedLevel, state.currentLevel + 1)
          });

          set({
            player: {
              ...state.player,
              animationState: 'idle'
            },
            isInCombat: false,
            currentWave: 1,
            progressToNextEnemy: 0,
            winsInCurrentLevel: 0,
            maxUnlockedLevel: Math.max(state.maxUnlockedLevel, state.currentLevel + 1),
            lastEnemyFaced: null,
            currencies: newCurrencies,
            defeatedBosses: newDefeatedBosses,
            currentLevelBossAttempted: true
          });
          return;
        }

        // Check if we should progress to boss - only on first time reaching 10 wins
        const shouldFightBoss = newWinsInLevel >= 10 && !state.currentLevelBossAttempted;

        // Calculate next wave, capped at 10
        const nextWave = shouldFightBoss ? 10 : Math.min(10, state.currentWave + 1);

        console.log('🌊 Wave completed!', {
          currentWave: state.currentWave,
          nextWave,
          winsInLevel: newWinsInLevel,
          shouldFightBoss,
          bossAttempted: state.currentLevelBossAttempted
        });

        // Update state
        set({
          player: {
            ...state.player,
            animationState: 'idle'
          },
          isInCombat: false,
          currentWave: nextWave,
          progressToNextEnemy: 0,
          winsInCurrentLevel: newWinsInLevel,
          currencies: newCurrencies,
          lastEnemyFaced: null // Clear last enemy faced after regular enemy defeat
        });

        // If we've won 10 battles and haven't attempted boss, generate a boss
        if (shouldFightBoss) {
          console.log('🏰 Triggering boss fight!', {
            winsInLevel: newWinsInLevel,
            bossAttempted: state.currentLevelBossAttempted
          });
          get().generateBoss();
        }
      },

      handlePlayerDeath: () => {
        const state = get();
        const currentEnemy = state.currentEnemy;
        
        // Reset player and initialize with full health
        const newPlayer = { ...INITIAL_PLAYER };
        newPlayer.currentHealth = newPlayer.maxHealth;

        // If died to boss, mark as attempted
        const diedToBoss = currentEnemy?.type === 'boss';

        console.log('💔 Player death!', {
          enemyType: currentEnemy?.type,
          wave: state.currentWave,
          winsInLevel: state.winsInCurrentLevel,
          bossAttempted: state.currentLevelBossAttempted,
          diedToBoss
        });
        
        set(state => ({
          player: newPlayer,
          currentEnemy: null,
          isInCombat: false,
          currentWave: state.currentWave,
          progressToNextEnemy: 0,
          winsInCurrentLevel: state.winsInCurrentLevel,
          currentLevelBossAttempted: diedToBoss ? true : state.currentLevelBossAttempted,
          lastEnemyFaced: null // Clear last enemy faced on death
        }));

        // If died to boss, generate a regular enemy after a short delay
        if (diedToBoss) {
          setTimeout(() => {
            const state = get();
            console.log('🔄 Generating regular enemy after boss death', {
              wave: state.currentWave,
              winsInLevel: state.winsInCurrentLevel,
              bossAttempted: state.currentLevelBossAttempted
            });
            const enemy = generateEnemy(state.currentLevel, state.currentWave, 'normal');
            set({ currentEnemy: enemy, isInCombat: true });
          }, 0);
        }
      },

      addCurrency: (type: CurrencyType, amount: number) => {
        set(state => ({
          currencies: {
            ...state.currencies,
            [type]: state.currencies[type] + amount
          }
        }));
      },

      deductCurrency: (type: CurrencyType, amount: number) => {
        set(state => ({
          currencies: {
            ...state.currencies,
            [type]: Math.max(0, state.currencies[type] - amount)
          }
        }));
      },

      updateAnimationState: (entity: 'player' | 'enemy', newState: AnimationState) => {
        set(prevState => {
          if (entity === 'player' && prevState.player) {
            return {
              player: {
                ...prevState.player,
                animationState: newState
              }
            };
          } else if (entity === 'enemy' && prevState.currentEnemy) {
            return {
              currentEnemy: {
                ...prevState.currentEnemy,
                animationState: newState
              }
            };
          }
          return prevState;
        });
      },

      resetProgress: () => {
        set({
          player: null,
          currentEnemy: null,
          isInCombat: false,
          currentWave: 1,
          currentLevel: 1,
          progressToNextEnemy: 0,
          currencies: {
            A: 0,
            B: 0,
            C: 0,
            D: 0
          }
        });
      },

      attack: (source: 'player' | 'enemy') => {
        // Deprecated in favor of processBattleTick
      },

      heal: (target: 'player' | 'enemy') => {
        // Deprecated in favor of processBattleTick
      },

      applyUpgradeEffect: (upgrade: Upgrade) => {
        set(state => {
          if (!state.player) return state;

          const player = { ...state.player };
          
          switch (upgrade.effect.type) {
            case 'attack':
              player.attack += upgrade.effect.value;
              break;
            case 'health':
              const healthIncrease = upgrade.effect.value;
              player.maxHealth += healthIncrease;
              player.currentHealth += healthIncrease;
              break;
            case 'speed':
              player.attackSpeed += upgrade.effect.value;
              break;
            case 'gameSpeed':
              player.gameSpeed += upgrade.effect.value;
              break;
            case 'critical':
              if (upgrade.effect.subType === 'chance') {
                player.criticalChance += upgrade.effect.value;
              } else {
                player.criticalDamage += upgrade.effect.value;
              }
              break;
            case 'block':
              player.blockChance += upgrade.effect.value;
              break;
            case 'currency':
              if (upgrade.effect.subType === 'chance') {
                if (upgrade.effect.value === 2) {
                  player.doubleCurrencyChance += upgrade.effect.value;
                } else {
                  player.quintupleCurrencyChance += upgrade.effect.value;
                }
              }
              break;
            case 'prestige':
              player.prestigeMultiplier += upgrade.effect.value;
              break;
          }

          return { player };
        });
      },

      recalculateUpgradeEffects: (upgrades: Upgrade[]) => {
        set(state => {
          if (!state.player) return state;

          // Reset player to initial state
          const player = { ...INITIAL_PLAYER };

          // Reapply all active upgrades
          upgrades.forEach(upgrade => {
            switch (upgrade.effect.type) {
              case 'attack':
                player.attack += upgrade.effect.value;
                break;
              case 'health':
                const healthIncrease = upgrade.effect.value;
                player.maxHealth += healthIncrease;
                player.currentHealth = Math.min(
                  player.currentHealth + healthIncrease,
                  player.maxHealth
                );
                break;
              case 'speed':
                player.attackSpeed += upgrade.effect.value;
                break;
              case 'gameSpeed':
                player.gameSpeed += upgrade.effect.value;
                break;
              case 'critical':
                if (upgrade.effect.subType === 'chance') {
                  player.criticalChance += upgrade.effect.value;
                } else {
                  player.criticalDamage += upgrade.effect.value;
                }
                break;
              case 'block':
                player.blockChance += upgrade.effect.value;
                break;
              case 'currency':
                if (upgrade.effect.subType === 'chance') {
                  if (upgrade.effect.value === 2) {
                    player.doubleCurrencyChance += upgrade.effect.value;
                  } else {
                    player.quintupleCurrencyChance += upgrade.effect.value;
                  }
                }
                break;
              case 'prestige':
                player.prestigeMultiplier += upgrade.effect.value;
                break;
            }
          });

          return { player };
        });
      },

      togglePause: () => set(state => ({ isPaused: !state.isPaused })),

      stopFight: () => {
        const state = get();
        const wasBossFight = state.currentEnemy?.type === 'boss';
        
        set(state => ({
          isInCombat: false,
          currentEnemy: null,
          progressToNextEnemy: 0,
          currentWave: state.currentWave,
          winsInCurrentLevel: state.winsInCurrentLevel,
          // Keep lastEnemyFaced and currentLevelBossAttempted state to prevent boss refight
          lastEnemyFaced: state.lastEnemyFaced,
          currentLevelBossAttempted: wasBossFight ? true : state.currentLevelBossAttempted
        }));
      },

      increaseLevel: () => set(state => {
        if (state.currentLevel >= state.maxUnlockedLevel) return state;
        return {
          currentLevel: state.currentLevel + 1,
          currentWave: 1,
          isInCombat: false,
          currentEnemy: null,
          progressToNextEnemy: 0,
          currentLevelBossAttempted: false // Reset boss attempted flag for new level
        };
      }),

      decreaseLevel: () => set(state => {
        if (state.currentLevel <= 1) return state;
        return {
          currentLevel: state.currentLevel - 1,
          currentWave: 10,
          isInCombat: false,
          currentEnemy: null,
          progressToNextEnemy: 0,
          winsInCurrentLevel: 10
        };
      }),

      generateBoss: () => {
        const state = get();
        if (!state.player) return;

        const boss = generateBoss(state.currentLevel, state.lastEnemyFaced?.variation);
        set({ 
          currentEnemy: boss, 
          isInCombat: true,
          lastEnemyFaced: { type: 'boss', variation: boss.variation }
        });
      },

      startBossFight: () => {
        const state = get();
        // Only allow manual boss fights if we have 10 wins and not on cooldown
        const now = Date.now();
        if (!state.player || 
            state.winsInCurrentLevel < 10 || 
            (state.bossFightCooldown && now - state.bossFightCooldown < 20000)) return;

        // First stop any current fight
        get().stopFight();

        // Heal player to full health before boss fight
        set(state => ({
          player: {
            ...state.player!,
            currentHealth: state.player!.maxHealth
          }
        }));

        // Generate and fight boss
        console.log('🏰 Manually starting boss fight!', {
          winsInLevel: state.winsInCurrentLevel,
          bossAttempted: state.currentLevelBossAttempted,
          isInCombat: state.isInCombat
        });

        get().generateBoss();
        set({ 
          currentLevelBossAttempted: true,
          bossFightCooldown: now // Start cooldown
        });
      }
    }),
    {
      name: 'battle-storage'
    }
  )
);

export * from './types';
export * from './constants';
export * from './combat-logic';
export * from './enemy-generation'; 