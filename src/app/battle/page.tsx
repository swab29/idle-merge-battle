'use client';

import BattleView from '@/components/battle/battle-view';
import { MergeView } from '@/components/merge/merge-view';
import { SettingsPanel } from '@/components/settings/settings-panel';
import { UpgradeView } from '@/components/battle/upgrade-view';
import { Card } from '@/components/ui/card';
import { useBattleStore } from '@/lib/stores/battle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Pause, Play, Square } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function BattlePage() {
  const { currentWave, currentLevel, currencies } = useBattleStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Battle Arena</h1>
          <p className="text-muted-foreground">
            Fight enemies to gain experience and resources
          </p>
        </div>
        
        {/* Compact Currency Display */}
        <div className="flex gap-2">
          {Object.entries(currencies).map(([type, amount]) => (
            <Card key={type} className="px-3 py-2">
              <div className="text-sm font-medium">Currency {type}</div>
              <div className="text-lg font-bold">{amount}</div>
            </Card>
          ))}
        </div>
      </div>

      <Tabs defaultValue="battle" className="space-y-4">
        <TabsList>
          <TabsTrigger value="battle">Battle</TabsTrigger>
          <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
        </TabsList>
        <TabsContent value="battle">
          <BattleView />
        </TabsContent>
        <TabsContent value="upgrades">
          <UpgradeView />
        </TabsContent>
      </Tabs>
    </div>
  );
} 