import { configureStore } from "@reduxjs/toolkit";
import { tmdbApi } from "./slices/apiSlice";
import { listingsApi } from "./slices/listingsApiSlice";
import discoverReducer from "./slices/discover";

const store = configureStore({
  reducer: {
    discover: discoverReducer,
    [tmdbApi.reducerPath]: tmdbApi.reducer,
    [listingsApi.reducerPath]: listingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(tmdbApi.middleware, listingsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
