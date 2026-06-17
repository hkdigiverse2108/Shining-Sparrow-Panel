import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Course } from '@/Types/Course';
import rawCourses from '@/Data/Courses.json';

const COURSES_KEY = 'mock_courses';

const loadCourses = (): Course[] => {
  try {
    const stored = localStorage.getItem(COURSES_KEY);
    return stored ? JSON.parse(stored) : (rawCourses as Course[]);
  } catch {
    return rawCourses as Course[];
  }
};

const saveCourses = (courses: Course[]) => {
  try {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  } catch (e) {
    console.warn('Failed to persist courses', e);
  }
};

interface CourseState {
  data: Course[];
}

const initialState: CourseState = {
  data: loadCourses(),
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    addCourse: (state, action: PayloadAction<Course>) => {
      state.data.unshift(action.payload);
      saveCourses(state.data);
    },
    editCourse: (state, action: PayloadAction<Course>) => {
      const idx = state.data.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) {
        state.data[idx] = action.payload;
        saveCourses(state.data);
      }
    },
    deleteCourse: (state, action: PayloadAction<number>) => {
      state.data = state.data.filter(c => c.id !== action.payload);
      saveCourses(state.data);
    },
  },
});

export const { addCourse, editCourse, deleteCourse } = courseSlice.actions;
export default courseSlice.reducer;
