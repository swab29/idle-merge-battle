'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useResourceStore, type Resource } from '@/lib/stores/resource-store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

export function MergeView() {
  const { resources, mergeSameType, mergeDifferentType } = useResourceStore();
  const [selectedResource, setSelectedResource] = useState<string | null>(null);

  const handleResourceClick = (resourceId: string) => {
    if (!selectedResource) {
      setSelectedResource(resourceId);
    } else {
      // If clicking the same resource type
      if (resourceId.split('_')[0] === selectedResource.split('_')[0]) {
        const level = resources[resourceId]?.level || 1;
        mergeSameType(resourceId.split('_')[0], level);
      } else {
        // If clicking a different resource type
        const level = resources[resourceId]?.level || 1;
        mergeDifferentType(selectedResource, resourceId, level);
      }
      setSelectedResource(null);
    }
  };

  // Group resources by level
  const resourcesByLevel = Object.entries(resources).reduce((acc, [id, resource]) => {
    const level = resource.level || 1;
    if (!acc[level]) acc[level] = [];
    acc[level].push({ id, ...resource });
    return acc;
  }, {} as Record<number, Array<{ id: string } & Resource>>);

  return (
    <div className="space-y-6">
      {Object.entries(resourcesByLevel).map(([level, levelResources]) => (
        <div key={level} className="space-y-2">
          <h3 className="text-lg font-semibold">Level {level}</h3>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {levelResources.map((resource) => {
              const baseType = resource.id.split('_')[0];
              const baseResource = RESOURCE_TYPES.find(r => r.id === baseType);
              
              return (
                <Card
                  key={resource.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedResource === resource.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleResourceClick(resource.id)}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex justify-between w-full">
                      <Badge variant="outline">Lvl {resource.level}</Badge>
                      {resource.subMergeProgress > 0 && (
                        <Badge variant="secondary">{resource.subMergeProgress}/10</Badge>
                      )}
                    </div>
                    <div className="text-lg font-semibold">{baseResource?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Quantity: {resource.quantity}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 