'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UpgradeEffectProps {
  type: 'health' | 'attack' | 'speed' | 'critical' | 'prestige';
  position: { x: number; y: number };
}

const effectVariants = {
  health: {
    color: 'text-green-500',
    icon: '❤️',
    animation: {
      scale: [1, 1.5, 1],
      opacity: [0, 1, 0],
      y: [0, -50],
    }
  },
  attack: {
    color: 'text-red-500',
    icon: '⚔️',
    animation: {
      scale: [1, 1.2, 1],
      opacity: [0, 1, 0],
      rotate: [0, 360],
    }
  },
  speed: {
    color: 'text-yellow-500',
    icon: '⚡',
    animation: {
      scale: [1, 1.2, 1],
      opacity: [0, 1, 0],
      x: [-20, 20],
    }
  },
  critical: {
    color: 'text-purple-500',
    icon: '🎯',
    animation: {
      scale: [1, 1.5, 1],
      opacity: [0, 1, 0],
      y: [0, -30],
    }
  },
  prestige: {
    color: 'text-blue-500',
    icon: '✨',
    animation: {
      scale: [1, 1.3, 1],
      opacity: [0, 1, 0],
      rotate: [-45, 45],
    }
  },
};

export function UpgradeEffect({ type, position }: UpgradeEffectProps) {
  const effect = effectVariants[type];

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          'fixed pointer-events-none text-2xl',
          effect.color
        )}
        style={{
          left: position.x,
          top: position.y,
        }}
        initial={{ opacity: 0, scale: 1 }}
        animate={effect.animation}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {effect.icon}
      </motion.div>
    </AnimatePresence>
  );
}

interface UpgradeEffectsManagerProps {
  effects: Array<{
    id: string;
    type: UpgradeEffectProps['type'];
    position: UpgradeEffectProps['position'];
  }>;
}

export function UpgradeEffectsManager({ effects }: UpgradeEffectsManagerProps) {
  return (
    <>
      {effects.map((effect) => (
        <UpgradeEffect
          key={effect.id}
          type={effect.type}
          position={effect.position}
        />
      ))}
    </>
  );
} 