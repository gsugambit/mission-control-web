import { configureStore } from '@reduxjs/toolkit';
import { missionControlApi } from '../services/missionControlApi';

export const store = configureStore({
  reducer: {
    [missionControlApi.reducerPath]: missionControlApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(missionControlApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
