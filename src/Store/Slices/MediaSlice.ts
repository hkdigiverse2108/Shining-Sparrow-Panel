import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import rawMedia from '@/Data/Media.json';

export interface MediaItem {
    id: number;
    name: string;
    url: string;           // Actual file URL (mp4, mp3, pdf, or image)
    thumbnail?: string;    // Image to display in the grid
    type: 'image' | 'video' | 'audio' | 'doc';
    category: string;
    size: string;
    uploadedAt: string;
}

const MEDIA_KEY = 'mock_media';
const loadMedia = (): MediaItem[] => {
    try { const stored = localStorage.getItem(MEDIA_KEY); return stored ? JSON.parse(stored) : (rawMedia as MediaItem[]); }
    catch { return rawMedia as MediaItem[]; }
};
const saveMedia = (data: MediaItem[]) => localStorage.setItem(MEDIA_KEY, JSON.stringify(data));

const initialState = { data: loadMedia() };

const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        addMedia: (state, action: PayloadAction<MediaItem>) => {
            state.data.unshift(action.payload);
            saveMedia(state.data);
        },
        deleteMedia: (state, action: PayloadAction<number>) => {
            state.data = state.data.filter(m => m.id !== action.payload);
            saveMedia(state.data);
        }
    }
});

export const { addMedia, deleteMedia } = mediaSlice.actions;
export default mediaSlice.reducer;