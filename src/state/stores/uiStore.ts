import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  selectedTranscriptId: string | null;
  viewMode: 'stream' | 'cards' | 'summary';
  setSidebarOpen: (open: boolean) => void;
  setActiveModal: (modalId: string | null) => void;
  setSelectedTranscriptId: (id: string | null) => void;
  setViewMode: (mode: 'stream' | 'cards' | 'summary') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      activeModal: null,
      selectedTranscriptId: null,
      viewMode: 'stream',
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveModal: (modalId) => set({ activeModal: modalId }),
      setSelectedTranscriptId: (id) => set({ selectedTranscriptId: id }),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'recapio-ui-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        viewMode: state.viewMode,
      }),
    }
  )
); 