'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GameLabel {
  id: string;
  category: string;
  defaultText: string;
  currentText: string;
  description: string;
}

const DEFAULT_LABELS: GameLabel[] = [
  // Currency Labels
  { id: 'currency-a', category: 'Currency', defaultText: 'Basic Currency', currentText: 'Basic Currency', description: 'Currency for basic upgrades' },
  { id: 'currency-b', category: 'Currency', defaultText: 'Advanced Currency', currentText: 'Advanced Currency', description: 'Currency for advanced upgrades' },
  { id: 'currency-c', category: 'Currency', defaultText: 'Elite Currency', currentText: 'Elite Currency', description: 'Currency for elite upgrades' },
  { id: 'currency-d', category: 'Currency', defaultText: 'Master Currency', currentText: 'Master Currency', description: 'Currency for master upgrades' },

  // Battle Labels
  { id: 'battle-start', category: 'Battle', defaultText: 'Start Battle', currentText: 'Start Battle', description: 'Button to start a battle' },
  { id: 'battle-pause', category: 'Battle', defaultText: 'Pause Battle', currentText: 'Pause Battle', description: 'Button to pause a battle' },
  { id: 'battle-resume', category: 'Battle', defaultText: 'Resume Battle', currentText: 'Resume Battle', description: 'Button to resume a battle' },
  { id: 'battle-stop', category: 'Battle', defaultText: 'Stop Battle', currentText: 'Stop Battle', description: 'Button to stop a battle' },

  // Equipment Labels
  { id: 'equip-button', category: 'Equipment', defaultText: 'Equip', currentText: 'Equip', description: 'Button to equip an item' },
  { id: 'unequip-button', category: 'Equipment', defaultText: 'Unequip', currentText: 'Unequip', description: 'Button to unequip an item' },
  { id: 'merge-button', category: 'Equipment', defaultText: 'Merge', currentText: 'Merge', description: 'Button to merge items' },
  { id: 'delete-button', category: 'Equipment', defaultText: 'Delete', currentText: 'Delete', description: 'Button to delete an item' },

  // Stats Labels
  { id: 'stat-attack', category: 'Stats', defaultText: 'Attack', currentText: 'Attack', description: 'Attack stat label' },
  { id: 'stat-defense', category: 'Stats', defaultText: 'Defense', currentText: 'Defense', description: 'Defense stat label' },
  { id: 'stat-health', category: 'Stats', defaultText: 'Health', currentText: 'Health', description: 'Health stat label' },
  { id: 'stat-speed', category: 'Stats', defaultText: 'Speed', currentText: 'Speed', description: 'Speed stat label' }
];

export function LabelEditor() {
  const [labels, setLabels] = React.useState<GameLabel[]>(DEFAULT_LABELS);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('Currency');

  // Load saved labels from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem('dev-game-labels');
    if (saved) {
      setLabels(JSON.parse(saved));
    }
  }, []);

  const categories = Array.from(new Set(labels.map(label => label.category)));

  const handleLabelChange = (id: string, value: string) => {
    setLabels(prev => prev.map(label => 
      label.id === id ? { ...label, currentText: value } : label
    ));
  };

  const saveLabels = () => {
    localStorage.setItem('dev-game-labels', JSON.stringify(labels));
  };

  const resetLabels = () => {
    setLabels(DEFAULT_LABELS);
    localStorage.removeItem('dev-game-labels');
  };

  const resetCategoryLabels = (category: string) => {
    setLabels(prev => prev.map(label => 
      label.category === category 
        ? { ...label, currentText: label.defaultText }
        : label
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Game Labels</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={saveLabels}>
            Save All Changes
          </Button>
          <Button variant="outline" size="sm" onClick={resetLabels}>
            Reset All to Default
          </Button>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList>
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{category} Labels</h4>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => resetCategoryLabels(category)}
              >
                Reset Category
              </Button>
            </div>

            <div className="grid gap-4">
              {labels
                .filter(label => label.category === category)
                .map(label => (
                  <Card key={label.id} className="p-4">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={label.id}>
                          {label.description}
                        </Label>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Input
                              id={label.id}
                              value={label.currentText}
                              onChange={(e) => handleLabelChange(label.id, e.target.value)}
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLabelChange(label.id, label.defaultText)}
                          >
                            Reset
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Default: {label.defaultText}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
} 