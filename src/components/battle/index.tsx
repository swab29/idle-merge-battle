'use client';

import * as React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BattleArea } from './components/battle-area';
import { BattleControls } from './components/battle-controls';
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

export const BattleView: React.FC = () => {
  const [isClient, setIsClient] = React.useState(false);

  // Initialize client-side rendering
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div>Loading battle...</div>;
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        setIsClient(false);
      }}
    >
      <div className="space-y-4">
        <BattleControls />
        <BattleArea />
        <StatsDisplay />
      </div>
    </ErrorBoundary>
  );
};

export default BattleView; 