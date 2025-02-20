'use client';

import { Button } from '@/components/ui/button';
import { useResourceStore } from '@/lib/stores/resource-store';

const RESOURCE_TYPES = [
  { id: 'wood', name: 'Wood', baseAmount: 1 },
  { id: 'stone', name: 'Stone', baseAmount: 1 },
  { id: 'iron', name: 'Iron', baseAmount: 1 },
  { id: 'gold', name: 'Gold', baseAmount: 1 },
  { id: 'crystal', name: 'Crystal', baseAmount: 1 },
  { id: 'stardust', name: 'Stardust', baseAmount: 1 },
  { id: 'mana', name: 'Mana', baseAmount: 1 },
  { id: 'essence', name: 'Essence', baseAmount: 1 },
];

export function ResourcesView() {
  const { resources, increment } = useResourceStore();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {RESOURCE_TYPES.map((type) => {
        const resource = resources[type.id] || { amount: 0, multiplier: 1, autoAmount: 0 };
        
        return (
          <div
            key={type.id}
            className="flex flex-col space-y-3 rounded-lg border p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{type.name}</h3>
              <span className="text-sm text-muted-foreground">
                {resource.amount.toFixed(1)}
              </span>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => increment(type.id)}
                className="w-full"
              >
                Gather {type.name}
              </Button>
              
              {resource.autoAmount > 0 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{resource.autoAmount}/sec
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
} 