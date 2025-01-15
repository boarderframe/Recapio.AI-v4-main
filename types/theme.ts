import { Theme as MuiTheme } from '@mui/material/styles';

export interface Theme extends MuiTheme {
  custom?: {
    sidebar: {
      width: number;
      background: string;
    };
    header: {
      height: number;
      background: string;
    };
  };
}

export type ThemeMode = 'light' | 'dark'; 