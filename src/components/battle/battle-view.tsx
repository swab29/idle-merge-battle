'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useBattleStore } from '@/lib/stores/battle';
import { Card } from '@/components/ui/card';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';
import { BattleControls } from './components/battle-controls';
import { BattleArea } from './components/battle-area';
import { StatsDisplay } from './components/stats-display';

const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-2">Something went wrong:</h2>
      <pre className="text-sm text-red-500 mb-4">{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </Card>
  );
};

const BattleView: React.FC = () => {
  const {
    player,
    currentEnemy,
    isInCombat,
    progressToNextEnemy,
    isPaused,
    initializePlayer,
    generateEnemy,
    updateProgress,
    processBattleTick,
  } = useBattleStore();

  const animationFrameRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const [isClient, setIsClient] = useState(false);

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize player if not exists
  useEffect(() => {
    if (isClient && !player) {
      console.log('Initializing player...');
      initializePlayer();
      generateEnemy();
    }
  }, [isClient, player, initializePlayer, generateEnemy]);

  // Game loop
  useEffect(() => {
    if (!isClient || !player || isPaused) return;

    const gameLoop = (timestamp: number) => {
      try {
        // Process battle if in combat
        if (isInCombat && currentEnemy) {
          processBattleTick();
        } 
        // Process movement if not in combat
        else if (player) {
          const delta = timestamp - lastTickRef.current;
          updateProgress(player.moveSpeed * player.gameSpeed * (delta / 1000));
        }

        lastTickRef.current = timestamp;
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      } catch (error) {
        console.error('Error in game loop:', error);
        // Attempt to recover by canceling the current frame
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        // Restart the loop
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isClient, player, isInCombat, currentEnemy, isPaused, processBattleTick, updateProgress]);

  if (!isClient) {
    return <div>Loading battle...</div>;
  }

  if (!player) {
    return <div>Initializing player...</div>;
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        initializePlayer();
        generateEnemy();
      }}
    >
      <div className="space-y-4">
        <Card className="p-4">
          <BattleControls />
        </Card>
        <BattleArea />
        <StatsDisplay />
      </div>
    </ErrorBoundary>
  );
};

export default BattleView; 