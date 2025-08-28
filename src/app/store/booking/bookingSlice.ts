import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Booking, CreateBookingPayload } from "../../types/booking";
import type { BookingListResponse } from "./bookingApi";
import type { RootState } from "../index";

export interface BookingState {
  creating: boolean;
  loadingCreate: boolean;
  lastCreated: Booking | null;
  error: string | null;

  loadingList: boolean;
  list: Booking[];
  page: number;
  totalPages: number;
  total: number;
}

const initialState: BookingState = {
  creating: false,
  loadingCreate: false,
  lastCreated: null,
  error: null,

  loadingList: false,
  list: [],
  page: 1,
  totalPages: 0,
  total: 0,
};

export type CreateBookingMeta = {
  onSuccess?: (data: Booking) => void;
  onError?: (message: string) => void;
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // ===== Create Booking =====
    createBookingRequest: {
      reducer(
        state,
        _action: PayloadAction<
          CreateBookingPayload,
          string,
          CreateBookingMeta | undefined
        >
      ) {
        state.creating = true;
        state.loadingCreate = true;
        state.error = null;
      },
      prepare(payload: CreateBookingPayload, meta?: CreateBookingMeta) {
        return { payload, meta };
      },
    },

    createBookingSuccess: (state, action: PayloadAction<Booking>) => {
      state.creating = false;
      state.loadingCreate = false;
      state.lastCreated = action.payload;
      state.error = null;
    },

    createBookingFailure: (state, action: PayloadAction<string>) => {
      state.creating = false;
      state.loadingCreate = false;
      state.error = action.payload;
    },

    resetBookingState: () => initialState,

    getMyBookingsRequest: (
      state,
      _action: PayloadAction<{ page?: number; pageSize?: number } | undefined>
    ) => {
      state.loadingList = true;
      state.error = null;
    },

    getMyBookingsSuccess: (
      state,
      action: PayloadAction<BookingListResponse>
    ) => {
      state.loadingList = false;
      state.list = action.payload.data;
      state.page = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.total = action.payload.total;
    },

    getMyBookingsFailure: (state, action: PayloadAction<string>) => {
      state.loadingList = false;
      state.error = action.payload;
    },
  },
});

export const {
  // create
  createBookingRequest,
  createBookingSuccess,
  createBookingFailure,
  resetBookingState,

  // list
  getMyBookingsRequest,
  getMyBookingsSuccess,
  getMyBookingsFailure,
} = bookingSlice.actions;

export default bookingSlice.reducer;

export const selectBookingState = (state: RootState) => state.booking;
export const selectCreating = (state: RootState) => state.booking.creating;
export const selectCreateLoading = (state: RootState) => state.booking.loadingCreate; 
export const selectLastCreated = (state: RootState) => state.booking.lastCreated;
export const selectBookingError = (state: RootState) => state.booking.error;
export const selectBookingsLoading = (state: RootState) =>
  state.booking.loadingList;
export const selectBookingsPage = (state: RootState) => state.booking.page;
export const selectBookingsTotalPages = (state: RootState) =>
  state.booking.totalPages;
export const selectBookingsTotal = (state: RootState) => state.booking.total;
export const selectBookings = (state: RootState) => state.booking.list ?? [];
