import { configureStore } from '@reduxjs/toolkit';
import addressSlice from '../features/address/addressSlice';
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    address: addressSlice,
  },
});
