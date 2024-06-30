import {configureStore} from '@reduxjs/toolkit';
import dialogSlice from '@/reducers/layout/dialogSlice.js';
import toastSlice from '@/reducers/layout/toastSlice.js';
import authSlice from '@/reducers/authSlice';
import layoutSlice from '@/reducers/layout/layoutSlice.js';
import socketSlice from '@/reducers/socketSlice.js';

export const store = configureStore({
  reducer: {
    dialog: dialogSlice,
    toast: toastSlice,
    layout: layoutSlice,
    auth: authSlice,
    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export default store;
