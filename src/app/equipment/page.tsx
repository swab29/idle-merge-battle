'use client';

import * as React from 'react';
import { EquipmentView } from '@/components/equipment/equipment-view';

export default function EquipmentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Equipment</h1>
        <p className="text-muted-foreground">
          Manage and upgrade your equipment
        </p>
      </div>
      <EquipmentView />
    </div>
  );
} 