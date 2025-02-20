'use client';

import * as React from 'react';
import { SettingsPanel } from '@/components/settings/settings-panel';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Wrench } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [showDevTools, setShowDevTools] = React.useState(false);

  // Check if dev tools were previously enabled
  React.useEffect(() => {
    const devMode = localStorage.getItem('dev-mode');
    setShowDevTools(devMode === 'enabled');
  }, []);

  const enableDevTools = () => {
    localStorage.setItem('dev-mode', 'enabled');
    setShowDevTools(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Configure your game preferences and access developer tools
        </p>
      </div>

      <div className="grid gap-6">
        <SettingsPanel />

        {/* Developer Tools Access */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Developer Tools</h3>
                <p className="text-sm text-muted-foreground">
                  Access advanced configuration and debugging tools
                </p>
              </div>
              {showDevTools ? (
                <Button
                  variant="outline"
                  onClick={() => router.push('/settings/dev')}
                  className="gap-2"
                >
                  <Wrench className="h-4 w-4" />
                  Open Dev Tools
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={enableDevTools}
                  className="gap-2"
                >
                  <Wrench className="h-4 w-4" />
                  Enable Dev Tools
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 