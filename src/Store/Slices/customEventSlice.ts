import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import rowEvents from '@/Data/CustomEvents.json';

const EVENTS_KEY = 'mock_custom_events';

const loadEvents = () => {
    try {
        const stored = localStorage.getItem(EVENTS_KEY);
        return stored ? JSON.parse(stored) : rowEvents;
    } catch {
        return rowEvents;
    }
};

const saveEvents = (events: any[]) => {
    try {
        localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    } catch (e) {
        console.warn('Failed to persist custom events', e);
    }
};

interface EventState {
    data: any[];
}

const initialState: EventState = {
    data: loadEvents(),
};

const customEventSlice = createSlice({
    name: 'customEvents',
    initialState,
    reducers: {
        addCustomEvent: (state, action: PayloadAction<any>) => {
            const newEvent = { ...action.payload, id: Date.now() };
            state.data.unshift(newEvent);
            saveEvents(state.data);
        },
        editCustomEvent: (state, action: PayloadAction<any>) => {
            const idx = state.data.findIndex(e => e.id === action.payload.id);
            if (idx !== -1) {
                state.data[idx] = action.payload;
                saveEvents(state.data);
            }
        },
        deleteCustomEvent: (state, action: PayloadAction<number>) => {
            state.data = state.data.filter(e => e.id !== action.payload);
            saveEvents(state.data);
        },
    },
});

export const { addCustomEvent, editCustomEvent, deleteCustomEvent } = customEventSlice.actions;
export default customEventSlice.reducer;