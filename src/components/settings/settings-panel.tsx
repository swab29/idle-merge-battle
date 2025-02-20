'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useBattleStore } from '@/lib/stores/battle';
import { useUpgradeStore } from '@/lib/stores/upgrade-store';
import { usePrestigeStore } from '@/lib/stores/prestige-store';

interface Settings {
  showEffects: boolean;
  musicVolume: number;
  soundVolume: number;
  autoSave: boolean;
  darkMode: boolean;
}

export function SettingsPanel() {
  const [settings, setSettings] = React.useState<Settings>({
    showEffects: true,
    musicVolume: 50,
    soundVolume: 50,
    autoSave: true,
    darkMode: false
  });

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      useBattleStore.getState().handlePlayerDeath();
      useUpgradeStore.getState().resetUpgrades();
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleSettingChange = (key: keyof Settings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem('game-settings', JSON.stringify({ ...settings, [key]: value }));
  };

  // Load settings from localStorage
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('game-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">
          Customize your game experience
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="show-effects">Show Effects</Label>
          <Switch
            id="show-effects"
            checked={settings.showEffects}
            onCheckedChange={(checked: boolean) => handleSettingChange('showEffects', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label>Music Volume</Label>
          <Slider
            value={[settings.musicVolume]}
            onValueChange={(values: number[]) => handleSettingChange('musicVolume', values[0])}
            max={100}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Sound Effects Volume</Label>
          <Slider
            value={[settings.soundVolume]}
            onValueChange={(values: number[]) => handleSettingChange('soundVolume', values[0])}
            max={100}
            step={1}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="auto-save">Auto Save</Label>
          <Switch
            id="auto-save"
            checked={settings.autoSave}
            onCheckedChange={(checked: boolean) => handleSettingChange('autoSave', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="dark-mode">Dark Mode</Label>
          <Switch
            id="dark-mode"
            checked={settings.darkMode}
            onCheckedChange={(checked: boolean) => handleSettingChange('darkMode', checked)}
          />
        </div>

        <div className="pt-4">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleReset}
          >
            Reset All Progress
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Game Version: 1.0.0</p>
          <p>Save Data Size: {Math.round(new Blob([JSON.stringify(localStorage)]).size / 1024)} KB</p>
        </div>
      </div>
    </Card>
  );
} 