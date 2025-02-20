'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { useUpgradeStore, type Upgrade, type UpgradeTier } from '@/lib/stores/upgrade-store';
import { useBattleStore } from '@/lib/stores/battle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { UpgradeEffectsManager } from './upgrade-effects';

const TIER_NAMES: Record<UpgradeTier, string> = {
  tier1: 'Tier 1',
  tier2: 'Tier 2',
  tier3: 'Tier 3',
  tier4: 'Tier 4'
};

interface UpgradeEffect {
  id: string;
  type: 'health' | 'attack' | 'speed' | 'critical' | 'prestige';
  position: { x: number; y: number };
}

interface UpgradeCardProps {
  upgrade: Upgrade;
  onPurchase: (position: { x: number; y: number }) => void;
  canAfford: boolean;
  currentCost: number;
  nextCost: number;
  currentEffect: number;
  nextEffect: number;
  tierCount: number;
  tierCap: number;
}

function UpgradeCard({ 
  upgrade, 
  onPurchase, 
  canAfford, 
  currentCost,
  nextCost,
  currentEffect,
  nextEffect,
  tierCount,
  tierCap
}: UpgradeCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const isMaxed = upgrade.currentLevel >= upgrade.maxLevel;
  const isTierCapped = tierCount >= tierCap;
  const { toggleUpgrade } = useUpgradeStore();

  const handlePurchase = (e: React.MouseEvent) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      onPurchase(position);
    }
  };

  const handleToggle = () => {
    toggleUpgrade(upgrade.id);
  };

  return (
    <Card ref={cardRef} className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{upgrade.name}</h3>
          <p className="text-sm text-muted-foreground">{upgrade.description}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Level {upgrade.currentLevel}/{upgrade.maxLevel}
        </div>
      </div>

      {/* Effect Preview */}
      <div className="space-y-1">
        <div className="text-sm flex justify-between">
          <span>Current Effect:</span>
          <span>{currentEffect.toFixed(2)}</span>
        </div>
        {!isMaxed && (
          <div className="text-sm flex justify-between text-muted-foreground">
            <span>Next Level:</span>
            <span>+{(nextEffect - currentEffect).toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Tier Cap Progress */}
      <div className="space-y-1">
        <div className="text-sm flex justify-between">
          <span>Tier Usage:</span>
          <span>{tierCount}/{tierCap}</span>
        </div>
        <Progress value={(tierCount / tierCap) * 100} />
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm space-y-1">
          <div>Cost: {currentCost} Currency {upgrade.cost.type}</div>
          {!isMaxed && (
            <div className="text-muted-foreground">
              Next: {nextCost}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {upgrade.purchased && (
            <Button
              onClick={handleToggle}
              variant={upgrade.isActive ? "secondary" : "outline"}
              size="sm"
            >
              {upgrade.isActive ? 'Active' : 'Inactive'}
            </Button>
          )}
          <Button
            onClick={handlePurchase}
            disabled={isMaxed || isTierCapped || !canAfford}
            variant={isMaxed ? "secondary" : canAfford ? "default" : "outline"}
          >
            {isMaxed ? 'Maxed' : 
             isTierCapped ? 'Tier Capped' :
             canAfford ? 'Purchase' : 'Cannot Afford'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function UpgradeView() {
  const [effects, setEffects] = React.useState<UpgradeEffect[]>([]);
  const { 
    upgrades, 
    purchaseUpgrade, 
    calculateUpgradeCost,
    calculateUpgradeEffect,
    getTierPurchaseCount
  } = useUpgradeStore();
  const { currencies, upgradeCaps } = useBattleStore();

  const handlePurchase = (upgrade: Upgrade, position: { x: number; y: number }) => {
    // Add effect
    const effectType: UpgradeEffect['type'] | null = 
      upgrade.effect.type === 'health' ? 'health' :
      upgrade.effect.type === 'attack' || upgrade.effect.type === 'combat' ? 'attack' :
      upgrade.effect.type === 'speed' || upgrade.effect.type === 'gameSpeed' ? 'speed' :
      upgrade.effect.type === 'critical' ? 'critical' :
      upgrade.effect.type === 'prestige' ? 'prestige' : null;

    if (effectType) {
      const newEffect: UpgradeEffect = {
        id: `${upgrade.id}-${Date.now()}`,
        type: effectType,
        position
      };
      setEffects(prev => [...prev, newEffect]);

      // Remove effect after animation
      setTimeout(() => {
        setEffects(prev => prev.filter(e => e.id !== newEffect.id));
      }, 1000);
    }

    // Purchase upgrade
    purchaseUpgrade(upgrade.id);
  };

  const canAffordUpgrade = (upgrade: Upgrade) => {
    const cost = calculateUpgradeCost(upgrade);
    return currencies[upgrade.cost.type] >= cost;
  };

  return (
    <>
      <Tabs defaultValue="tier1" className="space-y-4">
        <TabsList>
          {Object.entries(TIER_NAMES).map(([tier, name]) => (
            <TabsTrigger key={tier} value={tier}>
              {name} ({getTierPurchaseCount(tier as UpgradeTier)}/{upgradeCaps[tier as UpgradeTier]})
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(TIER_NAMES).map((tier) => (
          <TabsContent key={tier} value={tier} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upgrades
                .filter(upgrade => upgrade.tier === tier)
                .map(upgrade => {
                  const currentCost = calculateUpgradeCost(upgrade);
                  const nextCost = calculateUpgradeCost({
                    ...upgrade,
                    currentLevel: upgrade.currentLevel + 1
                  });
                  const currentEffect = calculateUpgradeEffect(upgrade);
                  const nextEffect = calculateUpgradeEffect({
                    ...upgrade,
                    currentLevel: upgrade.currentLevel + 1
                  });
                  const tierCount = getTierPurchaseCount(upgrade.tier);
                  const tierCap = upgradeCaps[upgrade.tier];

                  return (
                    <UpgradeCard
                      key={upgrade.id}
                      upgrade={upgrade}
                      onPurchase={(position) => handlePurchase(upgrade, position)}
                      canAfford={canAffordUpgrade(upgrade)}
                      currentCost={currentCost}
                      nextCost={nextCost}
                      currentEffect={currentEffect}
                      nextEffect={nextEffect}
                      tierCount={tierCount}
                      tierCap={tierCap}
                    />
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <UpgradeEffectsManager effects={effects} />
    </>
  );
} 