'use client';

import * as React from 'react';
import { Progress } from '@/components/ui/progress';
import { type Enemy } from '@/lib/stores/battle';

interface Ability {
  name: string;
  lastUsed: number;
  cooldown: number;
}

interface EnemyAbilitiesProps {
  enemy: Enemy & {
    abilities?: Ability[];
  };
}

export const EnemyAbilities: React.FC<EnemyAbilitiesProps> = ({ enemy }) => {
  if (!enemy?.abilities || !Array.isArray(enemy.abilities)) {
    return <div className="text-muted-foreground">No abilities available</div>;
  }

  return (
    <div className="space-y-2">
      {enemy.abilities.map((ability: Ability, index: number) => {
        const cooldownProgress = Math.min(100, ((Date.now() - ability.lastUsed) / ability.cooldown) * 100);
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{ability.name}</span>
              <span>{Math.floor(cooldownProgress)}%</span>
            </div>
            <Progress 
              value={cooldownProgress}
              className="bg-muted h-1"
              indicatorClassName="bg-blue-500"
            />
          </div>
        );
      })}
    </div>
  );
}; 