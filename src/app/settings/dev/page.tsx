'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { BattleEditor } from '@/components/settings/dev/battle-editor';
import { EquipmentEditor } from '@/components/settings/dev/equipment-editor';
import { LabelEditor } from '@/components/settings/dev/label-editor';

export default function DevToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Developer Tools</h1>
            <p className="text-muted-foreground">
              Edit game settings and balance in real-time
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            Development Mode
          </div>
        </div>
      </div>

      <Tabs defaultValue="battle" className="space-y-4">
        <TabsList>
          <TabsTrigger value="battle">Battle Editor</TabsTrigger>
          <TabsTrigger value="equipment">Equipment Editor</TabsTrigger>
          <TabsTrigger value="labels">Label Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="battle">
          <Card className="p-6">
            <BattleEditor />
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card className="p-6">
            <EquipmentEditor />
          </Card>
        </TabsContent>

        <TabsContent value="labels">
          <Card className="p-6">
            <LabelEditor />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 