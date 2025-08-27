// bookingSaga.ts
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  createBookingRequest,
  createBookingSuccess,
  createBookingFailure,
} from './bookingSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CreateBookingMeta } from './bookingSlice';
import { Booking, CreateBookingPayload } from '../../types/booking';
import { createBooking } from './bookingApi';

function* handleCreateBooking(
  action: PayloadAction<CreateBookingPayload, string, CreateBookingMeta | undefined>
) {
  try {
    const booking: Booking = yield call(createBooking, action.payload);
    yield put(createBookingSuccess(booking));
    action.meta?.onSuccess?.(booking);
  } catch (err: any) {
    const msg = err?.message ?? 'ไม่สามารถสร้างการจองได้';
    yield put(createBookingFailure(msg));
    action.meta?.onError?.(msg);
  }
}

export default function* bookingSaga() {
  yield takeLatest(createBookingRequest.type, handleCreateBooking);
}
