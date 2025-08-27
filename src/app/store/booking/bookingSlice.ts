import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Booking, CreateBookingPayload } from '../../types/booking';

export interface BookingState {
  creating: boolean;
  lastCreated: Booking | null;
  error: string | null;
}

const initialState: BookingState = {
  creating: false,
  lastCreated: null,
  error: null,
};

export type CreateBookingMeta = {
  onSuccess?: (data: Booking) => void;
  onError?: (message: string) => void;
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    createBookingRequest: {
      reducer(
        state,
        _action: PayloadAction<CreateBookingPayload, string, CreateBookingMeta | undefined>
      ) {
        state.creating = true;
        state.error = null;
      },
      prepare(payload: CreateBookingPayload, meta?: CreateBookingMeta) {
        return { payload, meta };
      },
    },

    createBookingSuccess: (state, action: PayloadAction<Booking>) => {
      state.creating = false;
      state.lastCreated = action.payload;
      state.error = null;
    },

    createBookingFailure: (state, action: PayloadAction<string>) => {
      state.creating = false;
      state.error = action.payload;
    },

    resetBookingState: () => initialState,
  },
});

export const {
  createBookingRequest,
  createBookingSuccess,
  createBookingFailure,
  resetBookingState,
} = bookingSlice.actions;

export default bookingSlice.reducer;

export const selectBookingState = (state: any) => state.booking as BookingState;
export const selectCreating = (state: any) => (state.booking as BookingState).creating;
export const selectLastCreated = (state: any) => (state.booking as BookingState).lastCreated;
export const selectBookingError = (state: any) => (state.booking as BookingState).error;
