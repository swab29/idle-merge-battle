'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBattleStore } from '@/lib/stores/battle-store';
import { configManager } from '@/lib/config-manager';
import { Download, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface StatBlockProps {
  title: string;
  stats: Record<string, number>;
  onStatChange: (key: string, value: number) => void;
  onSave?: () => void;
  onReset?: () => void;
}

function StatBlock({ title, stats, onStatChange, onSave, onReset }: StatBlockProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="space-x-2">
          {onSave && (
            <Button variant="outline" size="sm" onClick={onSave}>
              Save Configuration
            </Button>
          )}
          {onReset && (
            <Button variant="outline" size="sm" onClick={onReset}>
              Reset to Default
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{key}</Label>
            <Input
              id={key}
              type="number"
              value={value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onStatChange(key, parseFloat(e.target.value))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function BattleEditor() {
  const { player, currentEnemy, initializePlayer, generateEnemy } = useBattleStore();
  const [playerStats, setPlayerStats] = React.useState<Record<string, number>>({});
  const [enemyStats, setEnemyStats] = React.useState<Record<string, number>>({});
  const [selectedConfig, setSelectedConfig] = React.useState<'enemy' | 'player' | 'equipment'>('enemy');
  const [jsonContent, setJsonContent] = React.useState('');
  const [jsonError, setJsonError] = React.useState('');

  // Load configurations on mount
  React.useEffect(() => {
    const playerConfig = configManager.getConfig('player');
    const enemyConfig = configManager.getConfig('enemy');
    
    if (playerConfig) {
      setPlayerStats(playerConfig.baseStats);
    }
    
    if (enemyConfig) {
      setEnemyStats(enemyConfig.baseStats.normal);
    }

    // Initialize JSON editor with enemy config
    updateJsonEditor('enemy');
  }, []);

  const updateJsonEditor = (type: 'enemy' | 'player' | 'equipment') => {
    const config = configManager.getConfig(type);
    setJsonContent(JSON.stringify(config, null, 2));
    setSelectedConfig(type);
    setJsonError('');
  };

  const handleJsonChange = (newContent: string) => {
    setJsonContent(newContent);
    try {
      const parsed = JSON.parse(newContent);
      setJsonError('');
      
      // If it's a valid JSON, update the config
      configManager.saveConfig(selectedConfig, parsed);
      
      // Update the UI if needed
      if (selectedConfig === 'enemy') {
        setEnemyStats(parsed.baseStats.normal);
      } else if (selectedConfig === 'player') {
        setPlayerStats(parsed.baseStats);
      }
    } catch (e) {
      setJsonError('Invalid JSON format');
    }
  };

  const handlePlayerStatChange = (key: string, value: number) => {
    setPlayerStats(prev => ({ ...prev, [key]: value }));
    // Update player in real-time
    if (player) {
      const updatedPlayer = { ...player, [key]: value };
      useBattleStore.setState({ player: updatedPlayer });
    }
  };

  const handleEnemyStatChange = (key: string, value: number) => {
    setEnemyStats(prev => ({ ...prev, [key]: value }));
    // Update enemy in real-time
    if (currentEnemy) {
      const updatedEnemy = { ...currentEnemy, [key]: value };
      useBattleStore.setState({ currentEnemy: updatedEnemy });
    }
  };

  const savePlayerConfig = () => {
    const currentConfig = configManager.getConfig('player');
    configManager.saveConfig('player', {
      ...currentConfig,
      baseStats: playerStats
    });
  };

  const saveEnemyConfig = () => {
    const currentConfig = configManager.getConfig('enemy');
    configManager.saveConfig('enemy', {
      ...currentConfig,
      baseStats: {
        ...currentConfig.baseStats,
        normal: enemyStats
      }
    });
  };

  const resetPlayerConfig = () => {
    configManager.resetConfig('player');
    const config = configManager.getConfig('player');
    setPlayerStats(config.baseStats);
  };

  const resetEnemyConfig = () => {
    configManager.resetConfig('enemy');
    const config = configManager.getConfig('enemy');
    setEnemyStats(config.baseStats.normal);
  };

  const handleExport = () => {
    const configString = configManager.exportConfigs();
    const blob = new Blob([configString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-configs.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          configManager.importConfigs(content);
          // Reload configurations
          const playerConfig = configManager.getConfig('player');
          const enemyConfig = configManager.getConfig('enemy');
          setPlayerStats(playerConfig.baseStats);
          setEnemyStats(enemyConfig.baseStats.normal);
        } catch (error) {
          console.error('Error importing configuration:', error);
          alert('Invalid configuration file');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export Configs
        </Button>
        <Button variant="outline" size="sm" className="gap-2" asChild>
          <label>
            <Upload className="h-4 w-4" />
            Import Configs
            <input
              type="file"
              className="hidden"
              accept=".json"
              onChange={handleImport}
            />
          </label>
        </Button>
      </div>

      <Tabs defaultValue="json">
        <TabsList>
          <TabsTrigger value="json">JSON Editor</TabsTrigger>
          <TabsTrigger value="player">Player Stats</TabsTrigger>
          <TabsTrigger value="enemy">Enemy Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="json" className="space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-x-2">
                <Button 
                  variant={selectedConfig === 'enemy' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateJsonEditor('enemy')}
                >
                  Enemy Config
                </Button>
                <Button 
                  variant={selectedConfig === 'player' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateJsonEditor('player')}
                >
                  Player Config
                </Button>
                <Button 
                  variant={selectedConfig === 'equipment' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateJsonEditor('equipment')}
                >
                  Equipment Config
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  configManager.resetConfig(selectedConfig);
                  updateJsonEditor(selectedConfig);
                }}
              >
                Reset to Default
              </Button>
            </div>

            <div className="space-y-2">
              <Textarea
                value={jsonContent}
                onChange={(e) => handleJsonChange(e.target.value)}
                className="font-mono h-[500px]"
                spellCheck={false}
              />
              {jsonError && (
                <p className="text-sm text-red-500">{jsonError}</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="player" className="space-y-4">
          <StatBlock
            title="Player Stats"
            stats={playerStats}
            onStatChange={handlePlayerStatChange}
            onSave={savePlayerConfig}
            onReset={resetPlayerConfig}
          />
        </TabsContent>

        <TabsContent value="enemy" className="space-y-4">
          <StatBlock
            title="Enemy Stats"
            stats={enemyStats}
            onStatChange={handleEnemyStatChange}
            onSave={saveEnemyConfig}
            onReset={resetEnemyConfig}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 