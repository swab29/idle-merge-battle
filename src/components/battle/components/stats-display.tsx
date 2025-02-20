'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useBattleStore } from '@/lib/stores/battle';
import { EnemyAbilities } from './enemy-abilities';

export const StatsDisplay: React.FC = () => {
  const { player, currentEnemy } = useBattleStore();

  if (!player) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Player Stats */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Player</h3>
          <div className="space-y-2">
            {/* Health Bar */}
            <div className="flex justify-between">
              <span>Health</span>
              <span>{Math.floor(player.currentHealth)}/{player.maxHealth}</span>
            </div>
            <Progress 
              value={(player.currentHealth / player.maxHealth) * 100}
              className="bg-muted"
              indicatorClassName="bg-green-500"
            />

            {/* Player Stats */}
            <div className="space-y-2 text-sm">
              {/* Type and Variation (placeholder for alignment) */}
              <div className="h-10"></div>

              {/* Abilities */}
              <div className="font-semibold pt-2">Abilities</div>
              <div className="space-y-2">
                {/* TODO: Add player abilities */}
                <div className="text-muted-foreground">No abilities available</div>
              </div>

              {/* Combat Stats */}
              <div className="font-semibold pt-2">Combat Stats</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>Attack</div>
                <div className="text-right">{player.attack.toFixed(1)}</div>
                <div>Defense</div>
                <div className="text-right">{player.defense.toFixed(1)}</div>
                <div>Attack Speed</div>
                <div className="text-right">{(1 / player.attackSpeed).toFixed(2)}s</div>
                <div>Block Chance</div>
                <div className="text-right">{player.blockChance.toFixed(1)}%</div>
                <div>Critical Chance</div>
                <div className="text-right">{player.criticalChance.toFixed(1)}%</div>
                <div>Critical Damage</div>
                <div className="text-right">{(player.criticalDamage * 100).toFixed(0)}%</div>
              </div>

              {/* Speed Stats */}
              <div className="font-semibold pt-2">Speed Stats</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>Move Speed</div>
                <div className="text-right">{player.moveSpeed.toFixed(1)}</div>
                <div>Game Speed</div>
                <div className="text-right">{player.gameSpeed.toFixed(1)}x</div>
              </div>

              {/* Currency Bonuses */}
              <div className="font-semibold pt-2">Currency Bonuses</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                <div>2x Currency</div>
                <div className="text-right">{player.doubleCurrencyChance.toFixed(1)}%</div>
                <div>5x Currency</div>
                <div className="text-right">{player.quintupleCurrencyChance.toFixed(1)}%</div>
                <div>Prestige Mult</div>
                <div className="text-right">{player.prestigeMultiplier.toFixed(1)}x</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Enemy Stats */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">{currentEnemy?.name || 'No Enemy'}</h3>
          {currentEnemy && (
            <div className="space-y-2">
              {/* Health Bar */}
              <div className="flex justify-between">
                <span>Health</span>
                <span>{Math.floor(currentEnemy.currentHealth)}/{Math.floor(currentEnemy.maxHealth)}</span>
              </div>
              <Progress 
                value={(currentEnemy.currentHealth / currentEnemy.maxHealth) * 100}
                className="bg-muted"
                indicatorClassName={cn("bg-red-500", {
                  "bg-yellow-500": currentEnemy.type === 'elite',
                  "bg-purple-500": currentEnemy.type === 'boss'
                })}
              />
              
              {/* Enemy Type and Variation */}
              <div className="flex gap-2">
                {currentEnemy.type && (
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    {
                      "bg-red-500/10 text-red-500": currentEnemy.type === 'normal',
                      "bg-yellow-500/10 text-yellow-500": currentEnemy.type === 'elite',
                      "bg-purple-500/10 text-purple-500": currentEnemy.type === 'boss'
                    }
                  )}>
                    {currentEnemy.type.toUpperCase()}
                  </span>
                )}
                {currentEnemy.variation && (
                  <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-1 rounded-full">
                    {currentEnemy.variation.toUpperCase()}
                  </span>
                )}
                {currentEnemy.enraged && (
                  <span className="text-xs bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full">
                    ENRAGED
                  </span>
                )}
              </div>

              {/* Enemy Abilities */}
              <EnemyAbilities enemy={currentEnemy} />

              {/* Combat Stats */}
              <div className="space-y-2 text-sm">
                {/* Combat Stats */}
                <div className="font-semibold pt-2">Combat Stats</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div>Attack</div>
                  <div className="text-right">{currentEnemy?.attack?.toFixed(1) || '0.0'}</div>
                  <div>Defense</div>
                  <div className="text-right">{currentEnemy?.defense?.toFixed(1) || '0.0'}</div>
                  <div>Attack Speed</div>
                  <div className="text-right">{((currentEnemy?.attackSpeedBase || 0) * (currentEnemy?.attackSpeedModifier || 1)).toFixed(2)}s</div>
                  <div>Block Chance</div>
                  <div className="text-right">{currentEnemy?.blockChance?.toFixed(1) || '0.0'}%</div>
                  {currentEnemy?.lifeSteal > 0 && (
                    <>
                      <div>Life Steal</div>
                      <div className="text-right">{(currentEnemy.lifeSteal * 100).toFixed(1)}%</div>
                    </>
                  )}
                  {currentEnemy?.attackModifier !== 1 && (
                    <>
                      <div>Attack Modifier</div>
                      <div className="text-right">{((currentEnemy?.attackModifier || 1) * 100).toFixed(0)}%</div>
                    </>
                  )}
                </div>

                {/* Rewards */}
                <div className="font-semibold pt-2">Rewards</div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div>Base Currency</div>
                  <div className="text-right">{(currentEnemy?.level || 0) * 10} A</div>
                  {currentEnemy?.type === 'elite' && (
                    <>
                      <div>Elite Bonus</div>
                      <div className="text-right">2x Multiplier</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}; 