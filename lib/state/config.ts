import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { RootState } from '@/types/store';
import { StateCreator } from 'zustand';

type Mutate = (state: RootState) => void;
type StoreCreator = StateCreator<RootState, [["zustand/devtools", never], ["zustand/immer", never]]>;

const createStore = (initializer: StoreCreator) =>
  create<RootState>()(
    devtools(
      immer(initializer)
    )
  );

export const useStore = createStore((set) => ({
  auth: {
    user: null,
    tenantId: null,
    error: null,
    isLoading: false,
    isAuthenticated: false
  },
  settings: {
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
    },
  },
  ui: {
    theme: 'light',
    menus: {
      userMenu: {
        open: false,
        anchorId: null
      },
      adminMenu: {
        open: false,
        anchorId: null
      },
    },
    modals: {
      settings: false,
      profile: false,
      billing: false,
    },
  },
})); 