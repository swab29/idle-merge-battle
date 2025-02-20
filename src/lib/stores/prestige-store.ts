import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useBattleStore } from './battle-store';
import { useUpgradeStore } from './upgrade-store';

interface PrestigeStore {
  prestigePoints: number;
  totalPrestigePoints: number;
  prestigeMultiplier: number;
  canPrestige: boolean;
  prestigeRequirement: number;
  prestigeLevel: number;
  calculatePrestigeGain: () => number;
  prestige: () => void;
  checkPrestigeAvailability: () => void;
}

export const usePrestigeStore = create<PrestigeStore>()(
  persist(
    (set, get) => ({
      prestigePoints: 0,
      totalPrestigePoints: 0,
      prestigeMultiplier: 1,
      canPrestige: false,
      prestigeRequirement: 100,
      prestigeLevel: 0,

      calculatePrestigeGain: () => {
        const battleStore = useBattleStore.getState();
        if (!battleStore?.player) return 0;

        // Base prestige points from current level and wave
        const basePoints = Math.floor(
          Math.sqrt(battleStore.currentLevel * battleStore.currentWave) * 10
        );

        // Apply prestige multiplier from upgrades
        return Math.floor(basePoints * battleStore.player.prestigeMultiplier);
      },

      prestige: () => {
        const battleStore = useBattleStore.getState();
        const upgradeStore = useUpgradeStore.getState();
        
        if (!battleStore?.player) return;

        // Calculate prestige points to gain
        const pointsToGain = get().calculatePrestigeGain();
        if (pointsToGain <= 0) return;

        // Reset battle progress
        battleStore.handlePlayerDeath();

        // Reset upgrades but keep prestige-related ones
        upgradeStore.resetUpgrades();

        // Update prestige state
        set(state => ({
          prestigePoints: state.prestigePoints + pointsToGain,
          totalPrestigePoints: state.totalPrestigePoints + pointsToGain,
          prestigeLevel: state.prestigeLevel + 1,
          prestigeRequirement: Math.floor(state.prestigeRequirement * 1.5),
          canPrestige: false
        }));
      },

      checkPrestigeAvailability: () => {
        const pointsToGain = get().calculatePrestigeGain();
        set({ canPrestige: pointsToGain >= get().prestigeRequirement });
      }
    }),
    {
      name: 'prestige-storage'
    }
  )
); 