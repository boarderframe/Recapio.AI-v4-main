import { create } from 'zustand';

interface NavigationState {
  currentPath: string;
  setCurrentPath: (path: string) => void;
}

export const useNavigation = create<NavigationState>((set) => ({
  currentPath: '/',
  setCurrentPath: (path) => set({ currentPath: path }),
})); 