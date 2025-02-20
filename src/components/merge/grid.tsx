'use client';

import { useMergeStore, Item } from '@/lib/stores/merge-store';
import { useDroppable } from '@dnd-kit/core';
import { MergeItem } from './merge-item';
import { cn } from '@/lib/utils';

const GRID_SIZE = 5;

interface GridProps {
  onDeleteClick: (itemId: string) => void;
}

export function Grid({ onDeleteClick }: GridProps) {
  const { items } = useMergeStore();

  // Filter out equipped items and get items in grid positions
  const gridItems = items.filter(item => !item.isEquipped);

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 rounded-lg w-[384px] min-w-[384px] p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Backpack</h2>
          <span className="text-sm text-muted-foreground">
            {gridItems.length} / {GRID_SIZE * GRID_SIZE} slots used
          </span>
        </div>
        <div 
          className="grid grid-cols-5 gap-2" 
          style={{ position: 'relative', isolation: 'isolate' }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
            const item = gridItems.find(i => i.position === index);
            
            return (
              <GridCell 
                key={index} 
                index={index} 
                item={item}
                onDeleteClick={onDeleteClick}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface GridCellProps {
  index: number;
  item?: Item;
  onDeleteClick: (itemId: string) => void;
}

function GridCell({ index, item, onDeleteClick }: GridCellProps) {
  const { setNodeRef, isOver, active } = useDroppable({
    id: `cell-${index}`,
    data: {
      type: 'cell',
      index,
      item
    },
  });

  const activeItem = active?.data?.current as Item | undefined;
  const isValidDrop = isOver && activeItem && (!item || (
    item.type === activeItem.type && 
    item.level === activeItem.level
  ));

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-16 h-16 bg-white rounded border-2 flex items-center justify-center relative select-none",
        isValidDrop ? "border-red-500" : "border-gray-200"
      )}
      style={{ 
        touchAction: 'none'
      }}
    >
      {item && (
        <div className="absolute inset-0">
          <MergeItem item={item} onDeleteClick={onDeleteClick} />
        </div>
      )}
    </div>
  );
} 