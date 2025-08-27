import { combineReducers } from "@reduxjs/toolkit";
import authReducer from './auth/persistedAuthReducer';
import bookingReducer from "./booking/bookingSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
