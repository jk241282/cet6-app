import { create } from 'zustand';

interface VocabState {
  refreshKey: number; // 递增触发词表刷新
  triggerRefresh: () => void;
}

export const useVocabStore = create<VocabState>((set) => ({
  refreshKey: 0,
  triggerRefresh: () => set((s) => ({ refreshKey: s.refreshKey + 1 })),
}));
