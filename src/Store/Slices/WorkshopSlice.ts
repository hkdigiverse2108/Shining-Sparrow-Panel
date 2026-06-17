import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Workshop } from '@/Types/Workshop';
import rowWorkshops from '@/Data/Workshops.json';

const initialWorkshops = rowWorkshops as Workshop[];
const WORKSHOPS_KEY = 'mock_workshops';

const loadWorkshops = (): Workshop[] => {
  try {
    const stored = localStorage.getItem(WORKSHOPS_KEY);
    return stored ? JSON.parse(stored) : initialWorkshops;
  } catch {
    return initialWorkshops;
  }
};

const saveWorkshops = (workshops: Workshop[]) => {
  try {
    localStorage.setItem(WORKSHOPS_KEY, JSON.stringify(workshops));
  } catch (e) {
    console.warn('Failed to persist workshops', e);
  }
};

interface WorkshopState {
  data: Workshop[];
}

const initialState: WorkshopState = {
  data: loadWorkshops(),
};

const workshopSlice = createSlice({
  name: 'workshops',
  initialState,
  reducers: {
    addWorkshop: (state, action: PayloadAction<Workshop>) => {
        const newWorkshop = { ...action.payload };
        if (!newWorkshop.id) {
          newWorkshop.id = Date.now();
        }
        state.data.unshift(newWorkshop);
        saveWorkshops(state.data);
      },
    editWorkshop: (state, action: PayloadAction<Workshop>) => {
      const idx = state.data.findIndex(w => w.id === action.payload.id);
      if (idx !== -1) {
        state.data[idx] = action.payload;
        saveWorkshops(state.data);
      }
    },
    deleteWorkshop: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter(w => w.id !== action.payload);
      saveWorkshops(state.data);
    },
  },
});

export const { addWorkshop, editWorkshop, deleteWorkshop } = workshopSlice.actions;
export default workshopSlice.reducer;
