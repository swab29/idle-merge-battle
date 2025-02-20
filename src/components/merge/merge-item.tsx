'use client';

import { Item, useMergeStore } from '@/lib/stores/merge-store';
import { X } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';
import { TilePrototype } from './tile-prototype';

/**
 * Props for the MergeItem component
 * Note: While called "items" in code, these are referred to as "tiles" in the UI
 * 
 * Styling Requirements:
 * - Tiles must maintain consistent 64x64 size during all operations
 * - No scaling/transform effects during drag
 * - Solid appearance (no transparency) at all times
 * - Red border only appears on valid drop targets
 */
interface MergeItemProps {
  item: Item;
  onDeleteClick: (itemId: string) => void;
}

const itemColors: Record<Item['type'], string> = {
  weapon: 'bg-red-500',
  armor: 'bg-blue-500',
  helmet: 'bg-yellow-500',
  boots: 'bg-green-500',
  accessory: 'bg-purple-500',
};

export function MergeItem({ item, onDeleteClick }: MergeItemProps) {
  const { isDeleteMode } = useMergeStore();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: item.id,
    data: item,
  });

  // Only apply position transform, no scaling
  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    width: '64px',
    height: '64px',
    position: 'relative' as const,
    zIndex: isDragging ? 999999 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(!isDeleteMode ? { ...listeners, ...attributes } : {})}
      className={cn(
        'rounded select-none',
        {
          'cursor-default': isDeleteMode,
          'cursor-grab': !isDeleteMode,
          'active:cursor-grabbing': !isDeleteMode,
        }
      )}
    >
      <TilePrototype
        type={item.type}
        variation={item.variation}
        level={item.level}
        subLevel={item.subLevel}
      />
      
      {isDeleteMode && (
        <button
          onClick={() => onDeleteClick(item.id)}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      )}
    </div>
  );
} 