import type { User } from "@/Types";
import type { AuthStateProps } from "@/Types/Common";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Helper to load persisted auth data from localStorage
const loadAuthFromStorage = (): AuthStateProps => {
  try {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored) as AuthStateProps;
      if (parsed && parsed.user) {
        return { isAuthenticated: true, user: parsed.user };
      }
    }
  } catch (e) {
    console.error('Failed to parse auth from storage', e);
  }
  return { isAuthenticated: false, user: null };
};

const initialState: AuthStateProps = loadAuthFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      // Persist to localStorage
      try {
        localStorage.setItem('auth', JSON.stringify(state));
      } catch (e) {
        console.error('Failed to persist auth', e);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      // Clear persisted auth
      try {
        localStorage.removeItem('auth');
      } catch (e) {
        console.error('Failed to clear auth storage', e);
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
