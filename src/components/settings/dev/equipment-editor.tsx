'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ItemType, ItemStats, ItemVariationStats, Variation } from '@/lib/stores/merge-store';

interface EquipmentTypeEditor {
  type: ItemType;
  name: string;
  description: string;
}

interface VariationEditor {
  variation: Variation;
  name: string;
  primaryStat: keyof ItemStats;
  secondaryStat: keyof ItemStats;
}

const DEFAULT_EQUIPMENT_TYPES: Record<ItemType, EquipmentTypeEditor> = {
  weapon: { type: 'weapon', name: 'Weapon', description: 'Melee and ranged weapons' },
  armor: { type: 'armor', name: 'Armor', description: 'Body protection' },
  helmet: { type: 'helmet', name: 'Helmet', description: 'Head protection' },
  boots: { type: 'boots', name: 'Boots', description: 'Foot protection' },
  accessory: { type: 'accessory', name: 'Accessory', description: 'Additional equipment' }
};

const DEFAULT_VARIATIONS: Record<Variation, VariationEditor> = {
  A: { variation: 'A', name: 'Offensive', primaryStat: 'attack', secondaryStat: 'criticalChance' },
  B: { variation: 'B', name: 'Defensive', primaryStat: 'defense', secondaryStat: 'blockChance' },
  C: { variation: 'C', name: 'Speed', primaryStat: 'attackSpeed', secondaryStat: 'moveSpeed' },
  D: { variation: 'D', name: 'Tank', primaryStat: 'health', secondaryStat: 'defense' },
  E: { variation: 'E', name: 'Mobility', primaryStat: 'moveSpeed', secondaryStat: 'attackSpeed' }
};

export function EquipmentEditor() {
  const [equipmentTypes, setEquipmentTypes] = React.useState<Record<ItemType, EquipmentTypeEditor>>(DEFAULT_EQUIPMENT_TYPES);
  const [variations, setVariations] = React.useState<Record<Variation, VariationEditor>>(DEFAULT_VARIATIONS);

  // Load saved settings from localStorage
  React.useEffect(() => {
    const savedEquipment = localStorage.getItem('dev-equipment-types');
    const savedVariations = localStorage.getItem('dev-variations');
    
    if (savedEquipment) {
      setEquipmentTypes(JSON.parse(savedEquipment));
    }
    if (savedVariations) {
      setVariations(JSON.parse(savedVariations));
    }
  }, []);

  const handleEquipmentTypeChange = (type: ItemType, field: keyof EquipmentTypeEditor, value: string) => {
    setEquipmentTypes(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleVariationChange = (variation: Variation, field: keyof VariationEditor, value: string) => {
    setVariations(prev => ({
      ...prev,
      [variation]: { ...prev[variation], [field]: value }
    }));
  };

  const saveEquipmentTypes = () => {
    localStorage.setItem('dev-equipment-types', JSON.stringify(equipmentTypes));
  };

  const saveVariations = () => {
    localStorage.setItem('dev-variations', JSON.stringify(variations));
  };

  const resetEquipmentTypes = () => {
    setEquipmentTypes(DEFAULT_EQUIPMENT_TYPES);
    localStorage.removeItem('dev-equipment-types');
  };

  const resetVariations = () => {
    setVariations(DEFAULT_VARIATIONS);
    localStorage.removeItem('dev-variations');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="types">
        <TabsList>
          <TabsTrigger value="types">Equipment Types</TabsTrigger>
          <TabsTrigger value="variations">Variations</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Equipment Types</h3>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={saveEquipmentTypes}>
                Save Changes
              </Button>
              <Button variant="outline" size="sm" onClick={resetEquipmentTypes}>
                Reset to Default
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {Object.entries(equipmentTypes).map(([type, editor]) => (
              <Card key={type} className="p-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${type}-name`}>Name</Label>
                    <Input
                      id={`${type}-name`}
                      value={editor.name}
                      onChange={(e) => handleEquipmentTypeChange(type as ItemType, 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${type}-description`}>Description</Label>
                    <Input
                      id={`${type}-description`}
                      value={editor.description}
                      onChange={(e) => handleEquipmentTypeChange(type as ItemType, 'description', e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="variations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Variations</h3>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={saveVariations}>
                Save Changes
              </Button>
              <Button variant="outline" size="sm" onClick={resetVariations}>
                Reset to Default
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {Object.entries(variations).map(([variation, editor]) => (
              <Card key={variation} className="p-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${variation}-name`}>Name</Label>
                    <Input
                      id={`${variation}-name`}
                      value={editor.name}
                      onChange={(e) => handleVariationChange(variation as Variation, 'name', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${variation}-primary`}>Primary Stat</Label>
                      <select
                        id={`${variation}-primary`}
                        className="w-full p-2 border rounded"
                        value={editor.primaryStat}
                        onChange={(e) => handleVariationChange(variation as Variation, 'primaryStat', e.target.value as keyof ItemStats)}
                      >
                        {Object.keys(DEFAULT_VARIATIONS.A).map(stat => (
                          <option key={stat} value={stat}>{stat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${variation}-secondary`}>Secondary Stat</Label>
                      <select
                        id={`${variation}-secondary`}
                        className="w-full p-2 border rounded"
                        value={editor.secondaryStat}
                        onChange={(e) => handleVariationChange(variation as Variation, 'secondaryStat', e.target.value as keyof ItemStats)}
                      >
                        {Object.keys(DEFAULT_VARIATIONS.A).map(stat => (
                          <option key={stat} value={stat}>{stat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 