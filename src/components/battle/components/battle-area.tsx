'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useBattleStore } from '@/lib/stores/battle';

export const BattleArea: React.FC = () => {
  const { player, currentEnemy, isInCombat } = useBattleStore();

  if (!player) {
    return <div>Loading battle...</div>;
  }

  return (
    <div className="relative h-[75px] bg-gradient-to-b from-background to-muted rounded-lg border overflow-hidden">
      {/* Player Character */}
      <div
        className={cn(
          "absolute bottom-1/3 left-1/4 transition-all duration-500",
          {
            'translate-x-20': player.animationState === 'attacking',
          }
        )}
      >
        <div className="relative w-6 h-6">
          {/* Placeholder character - replace with actual sprite */}
          <div className={cn(
            "w-full h-full bg-primary rounded-full transition-transform",
            {
              'animate-bounce': player.animationState === 'idle',
              'animate-pulse': player.animationState === 'walking',
              'animate-attack': player.animationState === 'attacking',
              'animate-hit': player.animationState === 'hit',
            }
          )} />
        </div>
      </div>

      {/* Enemy Character */}
      {isInCombat && currentEnemy && (
        <div
          className={cn(
            "absolute bottom-1/3 right-1/4 transition-all duration-500",
            {
              '-translate-x-20': currentEnemy.animationState === 'attacking',
            }
          )}
        >
          <div className="relative w-6 h-6">
            {/* Placeholder enemy - replace with actual sprite */}
            <div className={cn(
              "w-full h-full bg-destructive rounded-full transition-transform",
              {
                'animate-bounce': currentEnemy.animationState === 'idle',
                'animate-attack': currentEnemy.animationState === 'attacking',
                'animate-hit': currentEnemy.animationState === 'hit',
              }
            )} />
          </div>
        </div>
      )}
    </div>
  );
}; 