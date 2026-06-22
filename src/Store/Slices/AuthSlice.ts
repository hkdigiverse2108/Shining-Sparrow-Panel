// import type { User } from "@/Types";
// import type { AuthStateProps } from "@/Types/Common";
// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// // Helper to load persisted auth data from localStorage
// const loadAuthFromStorage = (): AuthStateProps => {
//   try {
//     const stored = localStorage.getItem('auth');
//     if (stored) {
//       const parsed = JSON.parse(stored) as AuthStateProps;
//       if (parsed && parsed.user) {
//         return { isAuthenticated: true, user: parsed.user };
//       }
//     }
//   } catch (e) {
//     console.error('Failed to parse auth from storage', e);
//   }
//   return { isAuthenticated: false, user: null };
// };

// const initialState: AuthStateProps = loadAuthFromStorage();

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setCredentials: (state, action: PayloadAction<User>) => {
//       state.isAuthenticated = true;
//       state.user = action.payload;
//       // Persist to localStorage
//       try {
//         localStorage.setItem('auth', JSON.stringify(state));
//       } catch (e) {
//         console.error('Failed to persist auth', e);
//       }
//     },
//     logout: (state) => {
//       state.isAuthenticated = false;
//       state.user = null;
//       // Clear persisted auth
//       try {
//         localStorage.removeItem('auth');
//       } catch (e) {
//         console.error('Failed to clear auth storage', e);
//       }
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
import { STORAGE_KEYS } from "@/Constants";
import { Storage, Stringify } from "@/Utils";
import type { LoginResponse } from "@/Types/Auth";

const StoredUser = JSON.parse(Storage.getItem(STORAGE_KEYS.USER) || "null");
const StoredToken = Storage.getItem(STORAGE_KEYS.TOKEN) || null;

const initialState = {
  token: StoredToken,
  user: StoredUser,
  isAuthenticated: !!StoredToken,
  signinResponse: null as { email: string; otp?: string; type?: "signin" | "forgot-password"; responseData?: LoginResponse["data"] } | null,
};

const authSlice = createSlice({
  name: "auth", 
  initialState,
  reducers: {
    setSignin: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload;
      Storage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
      Storage.setItem(STORAGE_KEYS.USER, Stringify(action.payload));
    },
    setUser: (state, action) => {
      state.user = action.payload;
      Storage.setItem(STORAGE_KEYS.USER, Stringify(action.payload));
    },
    setSigninResponse: (state, action) => {
      state.signinResponse = action.payload;
    },
    setSignOut(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      Storage.clear();
      window.location.reload();
    },
  },
});

export const { setSignOut, setUser, setSignin, setSigninResponse } = authSlice.actions;
export default authSlice.reducer;
