import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
    sidebar: {
        isOpen: boolean;
        width: number;
    };
    header: {
        height: number;
        isFixed: boolean;
    };
    menus: {
        userMenu: {
            isOpen: boolean;
            anchorEl: HTMLElement | null;
        };
        adminMenu: {
            isOpen: boolean;
            anchorEl: HTMLElement | null;
        };
    };
    modals: {
        [key: string]: boolean;
    };
    loading: {
        [key: string]: boolean;
    };
}

const initialState: UIState = {
    sidebar: {
        isOpen: false,
        width: 240
    },
    header: {
        height: 64,
        isFixed: true
    },
    menus: {
        userMenu: {
            isOpen: false,
            anchorEl: null
        },
        adminMenu: {
            isOpen: false,
            anchorEl: null
        }
    },
    modals: {},
    loading: {}
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebar.isOpen = !state.sidebar.isOpen;
        },
        setSidebarWidth: (state, action: PayloadAction<number>) => {
            state.sidebar.width = action.payload;
        },
        setHeaderHeight: (state, action: PayloadAction<number>) => {
            state.header.height = action.payload;
        },
        setHeaderFixed: (state, action: PayloadAction<boolean>) => {
            state.header.isFixed = action.payload;
        },
        openUserMenu: (state, action: PayloadAction<HTMLElement>) => {
            state.menus.userMenu.isOpen = true;
            state.menus.userMenu.anchorEl = action.payload;
        },
        closeUserMenu: (state) => {
            state.menus.userMenu.isOpen = false;
            state.menus.userMenu.anchorEl = null;
        },
        openAdminMenu: (state, action: PayloadAction<HTMLElement>) => {
            state.menus.adminMenu.isOpen = true;
            state.menus.adminMenu.anchorEl = action.payload;
        },
        closeAdminMenu: (state) => {
            state.menus.adminMenu.isOpen = false;
            state.menus.adminMenu.anchorEl = null;
        },
        setModalOpen: (state, action: PayloadAction<{ modalId: string; isOpen: boolean }>) => {
            state.modals[action.payload.modalId] = action.payload.isOpen;
        },
        setLoading: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
            state.loading[action.payload.key] = action.payload.isLoading;
        }
    }
});

export const {
    toggleSidebar,
    setSidebarWidth,
    setHeaderHeight,
    setHeaderFixed,
    openUserMenu,
    closeUserMenu,
    openAdminMenu,
    closeAdminMenu,
    setModalOpen,
    setLoading
} = uiSlice.actions;

export default uiSlice.reducer; 