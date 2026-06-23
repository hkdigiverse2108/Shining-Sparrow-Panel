import { configureStore } from "@reduxjs/toolkit";
import layoutReducer from "./Slices/LayoutSlice"
import authReducer from "./Slices/AuthSlice";

const Store = configureStore({
  reducer: {
    auth: authReducer,
    layout: layoutReducer,
  },
});

export default Store;

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
