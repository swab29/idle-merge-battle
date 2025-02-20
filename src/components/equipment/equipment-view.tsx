'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { useMergeStore, type Item, type ItemStats, type Variation } from '@/lib/stores/merge-store';
import { Progress } from '@/components/ui/progress';

const STAT_LABELS: Record<keyof ItemStats, string> = {
  attack: 'Attack',
  defense: 'Defense',
  health: 'Health',
  criticalChance: 'Critical Chance',
  criticalDamage: 'Critical Damage',
  attackSpeed: 'Attack Speed',
  blockChance: 'Block Chance',
  moveSpeed: 'Move Speed'
};

const VARIATION_NAMES: Record<Variation, string> = {
  A: 'Offensive',
  B: 'Defensive',
  C: 'Speed',
  D: 'Tank',
  E: 'Mobility'
};

function StatDisplay({ label, value, isPercentage = false }: { label: string; value: number; isPercentage?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}:</span>
      <span>{isPercentage ? `${(value * 100).toFixed(1)}%` : value.toFixed(1)}</span>
    </div>
  );
}

function SetBonusDisplay({ variation, count }: { variation: Variation; count: number }) {
  return (
    <div className="mt-2 space-y-1">
      <div className="text-sm font-medium">Set Bonus ({count}/5)</div>
      <Progress value={(count / 5) * 100} className="h-1" />
      {count >= 2 && (
        <div className="text-xs text-green-500">
          2-Piece Bonus Active
        </div>
      )}
      {count >= 4 && (
        <div className="text-xs text-green-500">
          4-Piece Bonus Active
        </div>
      )}
    </div>
  );
}

export function EquipmentView() {
  const { items, equippedItems } = useMergeStore();
  
  // Initialize variationCounts with all possible variations set to 0
  const variationCounts = items?.reduce((acc, item) => {
    if (item.isEquipped) {
      acc[item.variation] = (acc[item.variation] || 0) + 1;
    }
    return acc;
  }, {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0
  } as Record<Variation, number>) || {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0
  };

  // Group items by variation with proper initialization
  const itemsByVariation = items?.reduce((acc, item) => {
    if (!acc[item.variation]) {
      acc[item.variation] = [];
    }
    acc[item.variation].push(item);
    return acc;
  }, {} as Record<Variation, Item[]>) || {};

  return (
    <div className="space-y-6">
      {/* Set Bonuses Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(VARIATION_NAMES).map(([variation, name]) => (
          <Card key={variation} className="p-4">
            <h3 className="font-semibold">{name} Set</h3>
            <SetBonusDisplay 
              variation={variation as Variation} 
              count={variationCounts[variation as Variation] || 0} 
            />
          </Card>
        ))}
      </div>

      {/* Equipment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(items || []).map((item) => (
          <Card key={item.id} className="p-4">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold capitalize">
                    {VARIATION_NAMES[item.variation]} {item.type}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Level {item.level}{item.subLevel > 0 ? ` (+${item.subLevel}/10)` : ''}
                  </p>
                </div>
                {item.isEquipped && (
                  <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">
                    Equipped
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="space-y-2">
                {Object.entries(item.stats || {}).map(([stat, value]) => {
                  if (value === 0) return null;
                  const isPercentage = ['criticalChance', 'criticalDamage', 'attackSpeed', 'blockChance', 'moveSpeed'].includes(stat);
                  return (
                    <StatDisplay
                      key={stat}
                      label={STAT_LABELS[stat as keyof ItemStats]}
                      value={value}
                      isPercentage={isPercentage}
                    />
                  );
                })}
              </div>

              {/* Variation Info */}
              <div className="text-xs text-muted-foreground">
                <div>Variation: {VARIATION_NAMES[item.variation]}</div>
                <div>Set Bonus Progress: {variationCounts[item.variation] || 0}/5</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {(!items || items.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          No equipment found. Visit the Merge tab to create some equipment!
        </div>
      )}
    </div>
  );
} 