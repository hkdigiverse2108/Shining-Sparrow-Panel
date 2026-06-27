import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/Constants";
import { Storage } from "@/Utils";
import type { LayoutStateProps } from "@/Types";

const storedTheme = Storage.getItem(STORAGE_KEYS.THEME) || "light";
const storedUnreadRooms = (() => {
  try {
    return JSON.parse(Storage.getItem('shining_sparrow_unread_rooms') || '[]');
  } catch {
    return [];
  }
})();

if (storedTheme === "dark") document.documentElement.classList.add("dark");
else document.documentElement.classList.remove("dark");

const initialState: LayoutStateProps = {
    isExpanded: true,
    isMobileOpen: false,
    isMobile: false,
    isHovered: false,
    isApplicationMenuOpen: false,
    openSubmenu: null,
    isToggleTheme: storedTheme,
    adminSetting: null,
    unreadRooms: storedUnreadRooms,
    activeRoomId: null,
};

const layoutSlice = createSlice({
    name: "layout",
    initialState,
    reducers: {
        setAdminSetting: (state, action) => {
            state.adminSetting = action.payload;
        },
        setIsMobile: (state, action) => {
            state.isMobile = action.payload;
            if (!action.payload) {
                state.isMobileOpen = false;
            }
        },
        setToggleSidebar: (state) => {
            state.isExpanded = !state.isExpanded;
        },
        setSidebarOpen: (state, action) => {
            state.isExpanded = action.payload;
        },
        setToggleMobileSidebar: (state) => {
            state.isMobileOpen = !state.isMobileOpen;
        },

        setIsHovered: (state, action) => {
            state.isHovered = action.payload;
        },

        setApplicationMenuOpen: (state) => {
            state.isApplicationMenuOpen = !state.isApplicationMenuOpen;
        },

        setToggleSubmenu: (state, action) => {
            state.openSubmenu = state.openSubmenu === action.payload ? null : action.payload;
        },
        setToggleTheme: (state, action) => {
            state.isToggleTheme = action.payload;
            Storage.setItem(STORAGE_KEYS.THEME, action.payload);
            if (action.payload === "dark") document.documentElement.classList.add("dark");
            else document.documentElement.classList.remove("dark");
        },
        setUnreadRooms: (state, action) => {
            state.unreadRooms = action.payload;
            Storage.setItem('shining_sparrow_unread_rooms', JSON.stringify(action.payload));
        },
        addUnreadRoom: (state, action) => {
            if (!state.unreadRooms.includes(action.payload)) {
                state.unreadRooms.push(action.payload);
                Storage.setItem('shining_sparrow_unread_rooms', JSON.stringify(state.unreadRooms));
            }
        },
        removeUnreadRoom: (state, action) => {
            state.unreadRooms = state.unreadRooms.filter(id => id !== action.payload);
            Storage.setItem('shining_sparrow_unread_rooms', JSON.stringify(state.unreadRooms));
        },
        setActiveRoomId: (state, action) => {
            state.activeRoomId = action.payload;
        }
    },
});

export const { setAdminSetting, setIsMobile, setToggleSidebar, setToggleMobileSidebar, setIsHovered, setApplicationMenuOpen, setToggleSubmenu, setToggleTheme, setSidebarOpen, setUnreadRooms, addUnreadRoom, removeUnreadRoom, setActiveRoomId } = layoutSlice.actions;

export default layoutSlice.reducer;
