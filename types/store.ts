import type { AuthState } from './auth';

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

interface SettingsState {
  theme?: 'light' | 'dark';
  language?: string;
  notifications?: {
    email: boolean;
    push: boolean;
  };
}

export interface RootState {
  auth: AuthState;
  ui: UIState;
  settings: SettingsState;
}

export type AppDispatch = (action: any) => any; 