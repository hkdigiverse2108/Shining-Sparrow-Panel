import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserTable } from '@/Types';
import rawUsersData from '@/Data/users.json';

const initialUsers = rawUsersData as UserTable[];

const USERS_KEY = 'admin_users';

const loadUsersFromStorage = (): UserTable[] => {
    try {
        const stored = localStorage.getItem(USERS_KEY);
        // 3. Return parsed storage OR the typed initialUsers
        return stored ? JSON.parse(stored) : initialUsers;
    } catch {
        return initialUsers;
    }
};


const saveUsersToStorage = (users: UserTable[]) => {
    try {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
        console.warn('Failed to save users to localStorage');
    }
};

interface UserState {
    data: UserTable[];
}

const initialState: UserState = {
    data: loadUsersFromStorage(),
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        addUser: (state, action: PayloadAction<UserTable>) => {
            state.data.unshift(action.payload);
            saveUsersToStorage(state.data); // Persist immediately
        },
        editUser: (state, action: PayloadAction<UserTable>) => {
            const index = state.data.findIndex(u => u.id === action.payload.id);
            if (index !== -1) {
                state.data[index] = action.payload;
                saveUsersToStorage(state.data); // Persist immediately
            }
        },
        deleteUser: (state, action: PayloadAction<number>) => {
            state.data = state.data.filter(u => u.id !== action.payload);
            saveUsersToStorage(state.data); // Persist immediately
        },
        toggleUserStatus: (state, action: PayloadAction<number>) => {
            const user = state.data.find(u => u.id === action.payload);
            if (user) {
                user.status = user.status === 'blocked' ? 'active' : 'blocked';
                saveUsersToStorage(state.data); // Persist immediately
            }
        },
    },
});

export const { addUser, editUser, deleteUser, toggleUserStatus } = userSlice.actions;
export default userSlice.reducer;