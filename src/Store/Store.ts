import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./Slices/CourseSlice";
import workshopReducer from "./Slices/WorkshopSlice";
import layoutReducer from "./Slices/LayoutSlice"
import userReducer from "./Slices/UserSlice";
import authReducer from "./Slices/AuthSlice";
import customEventReducer from "./Slices/customEventSlice";
import categoryReducer from "./Slices/CategorySlice";
import mediaReducer from "./Slices/MediaSlice";

const Store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
    users: userReducer,
    workshops: workshopReducer,
    courses: courseReducer,
    customEvents: customEventReducer,
    categories: categoryReducer,
    media: mediaReducer,
  },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
