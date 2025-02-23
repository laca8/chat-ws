import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slicers/userSlice";
import groupSlice from "./slicers/groupSlice";
import messageSlice from "./slicers/messageSlice";

const store = configureStore({
  reducer: {
    userSlice: userSlice,
    groupSlice: groupSlice,
    messageSlice: messageSlice,
  },
});
// Define the `AppDispatch` type from the store's dispatch function
export type AppDispatch = typeof store.dispatch;
// Define the `RootState` type from the store's state
export type RootState = ReturnType<typeof store.getState>;
export default store;
