export type BookingRole = 'CUSTOMER' | 'DRIVER' | 'ADMIN';

export interface CreateBookingPayload {
  role: BookingRole;
  userId: number;
  fromAddress: string;
  fromLat: number;
  fromLng: number;
  toAddress: string;
  toLat: number;
  toLng: number;
  routePolyline: string | null;
  distanceKm: number;
  estimatedPrice: number;
  pickupAt: string;   // ISO string
  dropoffAt: string;  // ISO string
  initialVehicleId: number | null;
}

export interface Booking {
  finalPrice: number;
  id: number;
  refCode: string;
  status: 'PENDING' | 'CONFIRMED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  // echo ฟิลด์จาก payload
  role: BookingRole;
  userId: number;
  fromAddress: string;
  fromLat: number;
  fromLng: number;
  toAddress: string;
  toLat: number;
  toLng: number;
  routePolyline: string | null;
  distanceKm: number;
  estimatedPrice: number;
  pickupAt: string;
  dropoffAt: string;
  vehicleId: number | null;
}

export interface ApiError {
  message: string;
  code?: string | number;
}
