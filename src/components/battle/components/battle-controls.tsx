'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useBattleStore } from '@/lib/stores/battle';
import { ChevronLeft, ChevronRight, Play, Pause, Square, Sword, Coins } from 'lucide-react';

export const BattleControls: React.FC = () => {
  const {
    currentWave,
    currentLevel,
    maxUnlockedLevel,
    progressToNextEnemy,
    isPaused,
    isInCombat,
    lastEnemyFaced,
    togglePause,
    stopFight,
    startBossFight,
    updateProgress,
    decreaseLevel,
    increaseLevel,
    winsInCurrentLevel,
    bossFightCooldown,
    addCurrency,
  } = useBattleStore();

  // Track cooldown progress
  const [cooldownProgress, setCooldownProgress] = React.useState(0);

  // Development cheat function
  const handleCheat = React.useCallback(() => {
    ['A', 'B', 'C', 'D'].forEach(type => {
      addCurrency(type as 'A' | 'B' | 'C' | 'D', 1000);
    });
  }, [addCurrency]);

  React.useEffect(() => {
    if (!bossFightCooldown) {
      setCooldownProgress(0);
      return;
    }

    const updateCooldown = () => {
      const now = Date.now();
      const elapsed = now - bossFightCooldown;
      const progress = Math.min(100, (elapsed / 20000) * 100);
      setCooldownProgress(progress);

      if (progress < 100) {
        requestAnimationFrame(updateCooldown);
      }
    };

    requestAnimationFrame(updateCooldown);
  }, [bossFightCooldown]);

  // Only allow advancing to next level if:
  // 1. Current level is less than max unlocked level
  // 2. Not currently fighting a boss (lastEnemyFaced?.type !== 'boss')
  const canAdvanceLevel = currentLevel < maxUnlockedLevel && lastEnemyFaced?.type !== 'boss';

  // Only allow boss fight if:
  // 1. At wave 10
  // 2. Have 10 wins
  // 3. Not on cooldown
  const canFightBoss = currentWave === 10 && 
    winsInCurrentLevel >= 10 && 
    (!bossFightCooldown || Date.now() - bossFightCooldown >= 20000);

  return (
    <div className="space-y-4">
      {/* Battle Header with Controls */}
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <div className="text-muted-foreground">Wave:</div>
          <div>{currentWave}/10</div>
          <div className="text-muted-foreground">Level:</div>
          <div>{currentLevel}</div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => decreaseLevel()}
            disabled={currentLevel <= 1}
            className="disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Next Level Button - Always shown but conditionally enabled */}
          <Button
            variant="outline"
            size="sm"
            onClick={increaseLevel}
            disabled={!canAdvanceLevel}
            className="disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Boss Fight Button - Always shown but conditionally enabled */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={startBossFight}
              disabled={!canFightBoss}
              className="disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <Sword className="h-4 w-4" />
            </Button>
            {bossFightCooldown && cooldownProgress < 100 && (
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-100"
                  style={{ width: `${cooldownProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Debug Cheat Button - Only visible in development */}
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheat}
              className="hover:bg-green-100"
              title="Add 1000 of each currency (Debug)"
            >
              <Coins className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={togglePause}
            className="hover:bg-yellow-100"
          >
            {isPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={stopFight}
            className="hover:bg-red-100"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Progress Bar - Only shown when not in combat */}
      {!isInCombat && progressToNextEnemy > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Time to next enemy</span>
            <span>{(3 * (1 - progressToNextEnemy / 100)).toFixed(1)}s</span>
          </div>
          <Progress value={progressToNextEnemy} />
        </div>
      )}
    </div>
  );
}; 