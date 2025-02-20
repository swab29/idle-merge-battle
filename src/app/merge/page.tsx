'use client';

import * as React from 'react';
import { MergeView } from '@/components/merge/merge-view';

export default function MergePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Merge Items</h1>
        <p className="text-muted-foreground">
          Combine matching items to create more powerful equipment
        </p>
      </div>
      <MergeView />
    </div>
  );
} 