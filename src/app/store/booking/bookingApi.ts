import { Booking, CreateBookingPayload } from "../../types/booking";
import { api, apiFetch } from "../apiClient";
import { selectAuth } from "../auth/authSlice";

export interface BookingListResponse {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  data: Booking[];
};

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  return api.post<Booking>('/bookings', payload, { auth: true });
}

export async function getMyBookings(userId: number, page = 1, pageSize = 10) {
  return api.get(`/bookings/my-booking?userId=${userId}&page=${page}&pageSize=${pageSize}`, { auth: false });
}
