import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import rawCategories from '@/Data/Categories.json';
import type { Category, CategoryState } from '@/Types/Course';

const CATEGORIES_KEY = 'mock_categories';
const loadCategories = (): Category[] => {
    try {
        const stored = localStorage.getItem(CATEGORIES_KEY);
        return stored ? JSON.parse(stored) : (rawCategories as Category[]);
    } catch {
        return rawCategories as Category[];
    }
};

// Save to localStorage
const saveCategories = (categories: Category[]) => {
    try {
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    } catch (e) {
        console.warn('Failed to persist categories', e);
    }
};


const initialState: CategoryState = {
    data: loadCategories(),
};

const categorySlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addCategory: {
            reducer: (state, action: PayloadAction<Category>) => {
                state.data.push(action.payload);
                saveCategories(state.data); // Persist on add
            },
            prepare: (name: string, color: string) => ({
                payload: { id: Date.now().toString(), name, color },
            }),
        },
        deleteCategory: (state, action: PayloadAction<string>) => {
            state.data = state.data.filter(c => c.id !== action.payload);
            saveCategories(state.data); // Persist on delete
        },
    },
});

export const { addCategory, deleteCategory } = categorySlice.actions;
export default categorySlice.reducer;