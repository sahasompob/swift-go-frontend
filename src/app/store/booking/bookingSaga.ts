// bookingSaga.ts
import { call, put, select, takeLatest } from "redux-saga/effects";
import {
  createBookingRequest,
  createBookingSuccess,
  createBookingFailure,
  getMyBookingsSuccess,
  getMyBookingsFailure,
  getMyBookingsRequest,
} from "./bookingSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { CreateBookingMeta } from "./bookingSlice";
import { Booking, CreateBookingPayload } from "../../types/booking";
import {
  BookingListResponse,
  createBooking,
  getMyBookings,
} from "./bookingApi";

function* handleCreateBooking(
  action: PayloadAction<
    CreateBookingPayload,
    string,
    CreateBookingMeta | undefined
  >
) {
  try {
    const booking: Booking = yield call(createBooking, action.payload);
    yield put(createBookingSuccess(booking));
    action.meta?.onSuccess?.(booking);
  } catch (err: any) {
    const msg = err?.message ?? "ไม่สามารถสร้างการจองได้";
    yield put(createBookingFailure(msg));
    action.meta?.onError?.(msg);
  }
}

function* handleGetMyBookings(
  action: PayloadAction<
    { userId?: number; page?: number; pageSize?: number } | undefined
  >
) {
  try {
    const page = action?.payload?.page ?? 1;
    const pageSize = action?.payload?.pageSize ?? 10;
    const authUserId: number | null = yield select(
      (s: any) => s.auth?.user?.id ?? null
    );
    const uid = action?.payload?.userId ?? authUserId;

    if (uid == null) throw new Error("Not authenticated");

    const res: BookingListResponse = yield call(
      getMyBookings,
      uid,
      page,
      pageSize
    );
    yield put(getMyBookingsSuccess(res));
  } catch (e: any) {
    yield put(getMyBookingsFailure(e.message ?? "Failed to load bookings"));
  }
}

export default function* bookingSaga() {
  yield takeLatest(createBookingRequest.type, handleCreateBooking);
  yield takeLatest(getMyBookingsRequest.type, handleGetMyBookings);
}
