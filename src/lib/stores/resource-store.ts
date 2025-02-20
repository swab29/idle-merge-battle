import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Resource {
  amount: number;
  multiplier: number;
  autoAmount: number;
  level: number;
  subMergeProgress: number;
  quantity: number;
}

interface ResourceStore {
  resources: Record<string, Resource>;
  increment: (resourceId: string) => void;
  addMultiplier: (resourceId: string, amount: number) => void;
  addAutoGatherer: (resourceId: string, amountPerSecond: number) => void;
  mergeSameType: (resourceId: string, level: number) => void;
  mergeDifferentType: (resourceId1: string, resourceId2: string, level: number) => void;
  addResource: (resourceId: string, level: number) => void;
}

const DEFAULT_RESOURCE: Resource = {
  amount: 0,
  multiplier: 1,
  autoAmount: 0,
  level: 1,
  subMergeProgress: 0,
  quantity: 0,
};

export const useResourceStore = create<ResourceStore>()(
  persist(
    (set) => ({
      resources: {},
      increment: (resourceId) =>
        set((state) => ({
          resources: {
            ...state.resources,
            [resourceId]: {
              ...state.resources[resourceId] || DEFAULT_RESOURCE,
              amount: (state.resources[resourceId]?.amount || 0) + 
                     (state.resources[resourceId]?.multiplier || 1),
              quantity: (state.resources[resourceId]?.quantity || 0) + 1,
            },
          },
        })),
      addMultiplier: (resourceId, amount) =>
        set((state) => ({
          resources: {
            ...state.resources,
            [resourceId]: {
              ...state.resources[resourceId] || DEFAULT_RESOURCE,
              multiplier: (state.resources[resourceId]?.multiplier || 1) + amount,
            },
          },
        })),
      addAutoGatherer: (resourceId, amountPerSecond) =>
        set((state) => ({
          resources: {
            ...state.resources,
            [resourceId]: {
              ...state.resources[resourceId] || DEFAULT_RESOURCE,
              autoAmount: (state.resources[resourceId]?.autoAmount || 0) + amountPerSecond,
            },
          },
        })),
      addResource: (resourceId, level) =>
        set((state) => ({
          resources: {
            ...state.resources,
            [resourceId]: {
              ...state.resources[resourceId] || DEFAULT_RESOURCE,
              quantity: (state.resources[resourceId]?.quantity || 0) + 1,
              level,
            },
          },
        })),
      mergeSameType: (resourceId, level) =>
        set((state) => {
          const resource = state.resources[resourceId] || DEFAULT_RESOURCE;
          if (resource.quantity < 2) return state;

          return {
            resources: {
              ...state.resources,
              [resourceId]: {
                ...resource,
                quantity: resource.quantity - 2,
                level: level + 1,
                subMergeProgress: 0, // Reset sub-merge progress when direct merging
              },
              [`${resourceId}_${level + 1}`]: {
                ...DEFAULT_RESOURCE,
                level: level + 1,
                quantity: (state.resources[`${resourceId}_${level + 1}`]?.quantity || 0) + 1,
              },
            },
          };
        }),
      mergeDifferentType: (resourceId1, resourceId2, level) =>
        set((state) => {
          const resource1 = state.resources[resourceId1];
          const resource2 = state.resources[resourceId2];
          
          if (!resource1 || !resource2 || resource1.level !== resource2.level) return state;

          const newSubMergeProgress = (resource1.subMergeProgress || 0) + 1;
          const shouldLevelUp = newSubMergeProgress >= 10;

          return {
            resources: {
              ...state.resources,
              [resourceId1]: {
                ...resource1,
                quantity: resource1.quantity - 1,
                subMergeProgress: shouldLevelUp ? 0 : newSubMergeProgress,
                level: shouldLevelUp ? level + 1 : level,
              },
              [resourceId2]: {
                ...resource2,
                quantity: resource2.quantity - 1,
              },
              ...(shouldLevelUp ? {
                [`${resourceId1}_${level + 1}`]: {
                  ...DEFAULT_RESOURCE,
                  level: level + 1,
                  quantity: (state.resources[`${resourceId1}_${level + 1}`]?.quantity || 0) + 1,
                },
              } : {}),
            },
          };
        }),
    }),
    {
      name: 'resource-storage',
    }
  )
); 