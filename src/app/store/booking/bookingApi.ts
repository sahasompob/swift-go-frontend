import { Booking, CreateBookingPayload } from "../../types/booking";
import { api } from "../apiClient";

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  return api.post<Booking>('/bookings', payload, { auth: true });
}
