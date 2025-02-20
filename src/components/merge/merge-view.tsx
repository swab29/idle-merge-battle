'use client';

import { Button } from '@/components/ui/button';
import { useMergeStore, Item, EquipmentSlot } from '@/lib/stores/merge-store';
import { Grid } from './grid';
import { useState, useEffect } from 'react';
import { PlayerEquipment } from './player-equipment';
import { Trash2, Grid2X2, ArrowDownUp } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from '@dnd-kit/core';

export function MergeView() {
  const [isWideScreen, setIsWideScreen] = useState(true);

  // Handle screen width changes
  useEffect(() => {
    const checkWidth = () => {
      setIsWideScreen(window.innerWidth >= 1024);
    };

    // Initial check
    checkWidth();

    // Add event listener
    window.addEventListener('resize', checkWidth);

    // Cleanup
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const { 
    spawnItem, 
    resetGrid,
    isDeleteMode,
    toggleDeleteMode,
    showDeletePrompt,
    deleteItem,
    items,
    moveItem,
    mergeItems,
    equipItem,
    equippedItems,
  } = useMergeStore();
  
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 3,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active) return;

    const activeItem = items.find(i => i.id === active.id);
    if (!activeItem) return;

    if (!over || !over.data.current) {
      moveItem(activeItem.id, activeItem.position);
      return;
    }

    if (over.data.current?.type === 'equipment') {
      const targetSlot = over.data.current?.slot as EquipmentSlot;
      if (targetSlot !== activeItem.type) {
        moveItem(activeItem.id, activeItem.position);
        return;
      }
      equipItem(activeItem.id, targetSlot);
      return;
    }

    if (over.data.current?.type === 'cell') {
      const targetPosition = over.data.current?.index as number;
      const targetItem = items.find(i => i.position === targetPosition && !i.isEquipped);

      if (activeItem.position === targetPosition) {
        return;
      }

      if (targetItem) {
        if (targetItem.type === activeItem.type && targetItem.id !== activeItem.id) {
          mergeItems(activeItem.id, targetItem.id);
        } else {
          const activePosition = activeItem.isEquipped ? -1 : activeItem.position;
          moveItem(targetItem.id, activePosition);
          moveItem(activeItem.id, targetPosition);
        }
      } else {
        moveItem(activeItem.id, targetPosition);
      }
      return;
    }

    moveItem(activeItem.id, activeItem.position);
  };

  const handleDeleteClick = (itemId: string) => {
    if (showDeletePrompt) {
      setItemToDelete(itemId);
    } else {
      deleteItem(itemId);
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete);
      setItemToDelete(null);
    }
  };

  const handleResetClick = () => {
    if (showDeletePrompt) {
      setShowResetConfirm(true);
    } else {
      resetGrid();
    }
  };

  const handleArrangeClick = () => {
    // Only sort unequipped items
    const unequippedItems = items.filter(item => !item.isEquipped);
    const sortedItems = [...unequippedItems].sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      return a.type.localeCompare(b.type);
    });
    
    // Find the lowest available positions
    let currentPosition = 0;
    sortedItems.forEach((item) => {
      if (item.position !== currentPosition) {
        moveItem(item.id, currentPosition);
      }
      currentPosition++;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always
        }
      }}
    >
      <div className="flex gap-8">
        {/* Right side - Merge Grid and Controls */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                onClick={() => spawnItem()}
                variant="default"
                className="gap-2"
              >
                <Grid2X2 className="h-4 w-4" />
                Spawn Item
              </Button>
              <Button
                variant={isDeleteMode ? "destructive" : "outline"}
                onClick={() => toggleDeleteMode()}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleteMode ? "Cancel Delete" : "Delete Mode"}
              </Button>
              <Button
                variant="outline"
                onClick={handleArrangeClick}
                className="gap-2"
              >
                <ArrowDownUp className="h-4 w-4" />
                Arrange Items
              </Button>
              <Button
                variant="outline"
                onClick={handleResetClick}
                className="gap-2"
              >
                <Grid2X2 className="h-4 w-4" />
                Reset Grid
              </Button>
            </div>
          </div>

          {/* Grid Container - side by side on wider screens, stack on narrow */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Equipment - vertical on wide screens, horizontal below */}
            <div className="order-1 sm:order-1">
              <PlayerEquipment orientation={isWideScreen ? 'vertical' : 'horizontal'} />
            </div>

            {/* Backpack Grid */}
            <div className="order-2 sm:order-2">
              <Grid onDeleteClick={handleDeleteClick} />
            </div>
          </div>
        </div>
      </div>

      {itemToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-bold mb-4">Delete Item</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-lg font-bold mb-4">Reset Grid</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to reset the grid? This will remove all items.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetGrid();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </DndContext>
  );
} 