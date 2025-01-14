import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/types/store';

interface MenuState {
  open: boolean;
  anchorId: string | null;
}

interface ModalsState {
  settings: boolean;
  profile: boolean;
  billing: boolean;
}

interface UIState {
  theme: 'light' | 'dark';
  menus: {
    userMenu: MenuState;
    adminMenu: MenuState;
  };
  modals: ModalsState;
}

const initialState: UIState = {
  theme: 'light',
  menus: {
    userMenu: {
      open: false,
      anchorId: null,
    },
    adminMenu: {
      open: false,
      anchorId: null,
    },
  },
  modals: {
    settings: false,
    profile: false,
    billing: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    openUserMenu: (state, action: PayloadAction<string>) => {
      state.menus.userMenu.open = true;
      state.menus.userMenu.anchorId = action.payload;
    },
    closeUserMenu: (state) => {
      state.menus.userMenu.open = false;
      state.menus.userMenu.anchorId = null;
    },
    openAdminMenu: (state, action: PayloadAction<string>) => {
      state.menus.adminMenu.open = true;
      state.menus.adminMenu.anchorId = action.payload;
    },
    closeAdminMenu: (state) => {
      state.menus.adminMenu.open = false;
      state.menus.adminMenu.anchorId = null;
    },
    openSettingsModal: (state) => {
      state.modals.settings = true;
    },
    closeSettingsModal: (state) => {
      state.modals.settings = false;
    },
    openProfileModal: (state) => {
      state.modals.profile = true;
    },
    closeProfileModal: (state) => {
      state.modals.profile = false;
    },
    openBillingModal: (state) => {
      state.modals.billing = true;
    },
    closeBillingModal: (state) => {
      state.modals.billing = false;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  openUserMenu,
  closeUserMenu,
  openAdminMenu,
  closeAdminMenu,
  openSettingsModal,
  closeSettingsModal,
  openProfileModal,
  closeProfileModal,
  openBillingModal,
  closeBillingModal,
} = uiSlice.actions;

export const selectTheme = (state: RootState) => state.ui.theme;
export const selectUserMenu = (state: RootState) => state.ui.menus.userMenu;
export const selectAdminMenu = (state: RootState) => state.ui.menus.adminMenu;
export const selectModals = (state: RootState) => state.ui.modals;

export default uiSlice.reducer; 