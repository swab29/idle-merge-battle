'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePrestigeStore } from '@/lib/stores/prestige-store';
import { motion } from 'framer-motion';

export function PrestigeView() {
  const {
    prestigePoints,
    totalPrestigePoints,
    prestigeLevel,
    prestigeRequirement,
    canPrestige,
    calculatePrestigeGain,
    prestige,
    checkPrestigeAvailability
  } = usePrestigeStore();

  // Check prestige availability every second
  React.useEffect(() => {
    const interval = setInterval(checkPrestigeAvailability, 1000);
    return () => clearInterval(interval);
  }, [checkPrestigeAvailability]);

  const pointsToGain = calculatePrestigeGain();
  const progress = (pointsToGain / prestigeRequirement) * 100;

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Prestige</h2>
        <p className="text-muted-foreground">
          Reset your progress to gain permanent bonuses
        </p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current Prestige Points</span>
            <span>{prestigePoints}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Prestige Points</span>
            <span>{totalPrestigePoints}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Prestige Level</span>
            <span>{prestigeLevel}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Next Prestige</span>
            <span>{pointsToGain} / {prestigeRequirement}</span>
          </div>
          <Progress value={progress} />
        </div>

        <motion.div
          animate={canPrestige ? {
            scale: [1, 1.05, 1],
            transition: { repeat: Infinity, duration: 2 }
          } : {}}
        >
          <Button
            className="w-full"
            size="lg"
            onClick={prestige}
            disabled={!canPrestige}
            variant={canPrestige ? "default" : "secondary"}
          >
            {canPrestige
              ? `Prestige Now (+${pointsToGain} Points)`
              : `Need ${prestigeRequirement - pointsToGain} More Points`}
          </Button>
        </motion.div>

        <div className="text-sm text-muted-foreground">
          <p>Prestige will:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Reset your current progress</li>
            <li>Reset your upgrades</li>
            <li>Grant permanent prestige points</li>
            <li>Unlock new upgrades and features</li>
          </ul>
        </div>
      </div>
    </Card>
  );
} 