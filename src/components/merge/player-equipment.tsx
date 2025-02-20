'use client';

import * as React from 'react';
import { useMergeStore, type EquipmentSlot, type Item } from '@/lib/stores/merge-store';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { MergeItem } from './merge-item';

const itemColors: Record<Item['type'], string> = {
  weapon: 'bg-red-500',
  armor: 'bg-blue-500',
  helmet: 'bg-yellow-500',
  boots: 'bg-green-500',
  accessory: 'bg-purple-500',
};

const typeIcons: Record<EquipmentSlot, string> = {
  weapon: '⚔️',
  armor: '🛡️',
  helmet: '⛑️',
  boots: '👢',
  accessory: '💍'
};

/**
 * Props for the EquipmentSlotComponent
 * Note: Equipment slots must maintain consistent 64x64 size and prevent scaling
 */
interface EquipmentSlotProps {
  type: EquipmentSlot;
  item?: Item | null;
}

function EquipmentSlotComponent({ type, item }: EquipmentSlotProps) {
  const { setNodeRef, isOver, active } = useDroppable({
    id: `equipment-slot-${type}`,
    data: {
      type: 'equipment',
      slot: type
    }
  });

  const activeItem = active?.data?.current as Item | undefined;
  const isValidDrop = isOver && activeItem && activeItem.type === type;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-16 h-16 border-2 rounded flex items-center justify-center relative select-none bg-white",
        isValidDrop ? "border-red-500" : "border-gray-300"
      )}
      style={{ 
        touchAction: 'none',
        transform: 'none',
        width: '64px',
        height: '64px'
      }}
    >
      {item && (
        <div className="flex items-center justify-center w-full h-full">
          <MergeItem item={item} onDeleteClick={() => {}} />
        </div>
      )}
      {!item && (
        <span className="text-2xl opacity-20">{typeIcons[type]}</span>
      )}
    </div>
  );
}

interface PlayerEquipmentProps {
  orientation: 'vertical' | 'horizontal';
}

export function PlayerEquipment({ orientation }: PlayerEquipmentProps) {
  const { items, equippedItems } = useMergeStore();
  const { setNodeRef } = useDroppable({
    id: 'equipment-container',
    data: {
      type: 'equipment-container'
    }
  });

  const getEquippedItem = (slot: EquipmentSlot) => {
    const itemId = equippedItems[slot];
    return itemId ? items.find(item => item.id === itemId) : null;
  };

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "p-4 bg-gray-100 rounded-lg flex flex-col gap-2",
        orientation === 'horizontal' ? 'w-[384px]' : 'w-[80px]'
      )}
      style={{ touchAction: 'none' }}
    >
      <h2 className={cn(
        "text-lg font-semibold text-center",
        orientation === 'vertical' ? 'mb-2' : ''
      )}>Equip</h2>
      <div className={cn(
        "grid gap-2",
        orientation === 'horizontal' ? 'grid-cols-5' : 'grid-cols-1',
        orientation === 'vertical' ? 'items-center justify-items-center' : ''
      )}>
        {Object.keys(equippedItems).map((slot) => (
          <EquipmentSlotComponent
            key={slot}
            type={slot as EquipmentSlot}
            item={getEquippedItem(slot as EquipmentSlot)}
          />
        ))}
      </div>
    </div>
  );
} 