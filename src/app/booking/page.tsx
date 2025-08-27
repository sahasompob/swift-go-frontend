"use client";

import { useMemo, useState, FormEvent } from "react";
import { Label } from "@radix-ui/react-label";
import { Car, MapPin, DollarSign, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select";
import type { BookingRole } from "../types/booking";
import { Button } from "../components/ui/Button";
import GoogleMapDragDistance from "../components/ui/GoogleMapDragDistance";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectUser } from "../store/auth/authSlice";
import { createBookingRequest, selectCreating } from "../store/booking/bookingSlice";
import { toISO } from "../components/ui/lib/utils";



type Vehicle = {
  id: number;
  name: string;
  pricePerKm: number;
  capacity: number;
  icon: string;
};

type BookingData = {
  pickup: string;
  destination: string;
  vehicleTypeId: number | null;
  role: BookingRole;
  userId: number;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
  routePolyline: string | null;
  distanceKm: number;
  estimatedPrice: number;
  pickupAt: string;
  dropoffAt: string;
  initialVehicleId: number | null;
};

type MapChangePayload = {
  origin?: string;
  destination?: string;
  fromLat?: number;
  fromLng?: number;
  toLat?: number;
  toLng?: number;
  routePolyline?: string | null;
  distanceKm?: number;
};

const VEHICLES: Vehicle[] = [
  { id: 1, name: "Honda", pricePerKm: 15, capacity: 4, icon: "🚗" },
  { id: 2, name: "Toyota", pricePerKm: 25, capacity: 4, icon: "🚙" },
];

const SERVICE_FEE = 5;

const computeEstimatedTotal = (pricePerKm: number, distanceKm: number) =>
  Math.max(0, pricePerKm * distanceKm) + SERVICE_FEE;

export default function BookingPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const creating = useAppSelector(selectCreating);

  const [bookingData, setBookingData] = useState<BookingData>({
    pickup: "",
    destination: "",
    vehicleTypeId: null,
    role: user.role ?? "CUSTOMER",
    userId: user?.id ?? 0,
    fromLat: 0,
    fromLng: 0,
    toLat: 0,
    toLng: 0,
    routePolyline: null,
    distanceKm: 0,
    estimatedPrice: 0,
    pickupAt: "",
    dropoffAt: "",
    initialVehicleId: null,
  });

  const selectedVehicle = useMemo(
    () => VEHICLES.find((v) => v.id === bookingData.vehicleTypeId) ?? null,
    [bookingData.vehicleTypeId]
  );

  const estimatedTotal = useMemo(() => {
    if (!selectedVehicle || !bookingData.distanceKm) return null;
    return computeEstimatedTotal(selectedVehicle.pricePerKm, bookingData.distanceKm);
  }, [selectedVehicle, bookingData.distanceKm]);

  const finalEstimated =
    bookingData.distanceKm > 0
      ? Math.max(0, selectedVehicle?.pricePerKm ?? 0 * bookingData.distanceKm) + 5
      : 0;

  const canSubmit = useMemo(
    () => !!bookingData.pickup && !!bookingData.destination && !!selectedVehicle,
    [bookingData.pickup, bookingData.destination, selectedVehicle]
  );

  const handleMapChange = (v: MapChangePayload) => {
    setBookingData((s) => ({
      ...s,
      pickup: v.origin ?? s.pickup,
      destination: v.destination ?? s.destination,
      fromLat: v.fromLat ?? s.fromLat,
      fromLng: v.fromLng ?? s.fromLng,
      toLat: v.toLat ?? s.toLat,
      toLng: v.toLng ?? s.toLng,
      routePolyline: v.routePolyline ?? s.routePolyline,
      distanceKm: typeof v.distanceKm === "number" ? v.distanceKm : s.distanceKm,
    }));
  };

  const handleVehicleChange = (value: string) => {
    const id = Number(value);
    setBookingData((s) => ({ ...s, vehicleTypeId: Number.isNaN(id) ? null : id }));
  };

  const handleTimeChange =
    (key: "pickupAt" | "dropoffAt") =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setBookingData((s) => ({ ...s, [key]: e.target.value }));

  const handleTextChange =
    (key: "pickup" | "destination") =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setBookingData((s) => ({ ...s, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const finalEstimated = selectedVehicle
      ? computeEstimatedTotal(selectedVehicle.pricePerKm, bookingData.distanceKm)
      : 0;

    const uid = user?.id;
    if (!uid) {
      alert("กรุณาเข้าสู่ระบบก่อนทำการจอง");
      return;
    }

    if (!selectedVehicle) return;

    const payload = {
      role: bookingData.role,
      userId: uid,
      fromAddress: bookingData.pickup,
      fromLat: bookingData.fromLat,
      fromLng: bookingData.fromLng,
      toAddress: bookingData.destination,
      toLat: bookingData.toLat,
      toLng: bookingData.toLng,
      routePolyline: bookingData.routePolyline,
      distanceKm: bookingData.distanceKm,
      estimatedPrice: finalEstimated,
      pickupAt: toISO(bookingData.pickupAt),
      dropoffAt: toISO(bookingData.dropoffAt),
      initialVehicleId: bookingData.initialVehicleId
    };

    dispatch(
      createBookingRequest(payload, {
        
      })
    );
  };


  return (
    <div className="min-h-screen bg-transport-light py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transport-gray mb-4">
            จองการเดินทางของคุณ
          </h1>
          <p className="text-xl text-muted-foreground">
            เลือกจุดรับ จุดส่ง และประเภทรถที่คุณต้องการ
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ฟอร์มการจอง */}
          <div className="lg:col-span-2">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  รายละเอียดการจอง
                </CardTitle>
                <CardDescription>กรอกข้อมูลการเดินทางเพื่อเริ่มต้น</CardDescription>
              </CardHeader>

              {/* แผนที่ */}
              <div>
                <GoogleMapDragDistance
                  onDistanceChange={(km) =>
                    setBookingData((s) => ({ ...s, distanceKm: km ?? 0 }))
                  }
                  onAddressChange={({ origin, destination }) =>
                    setBookingData((s) => ({
                      ...s,
                      pickup: origin ?? s.pickup,
                      destination: destination ?? s.destination,
                    }))
                  }
                  onRouteChange={(r) =>
                    setBookingData((s) => ({
                      ...s,
                      pickup: r.originAddress ?? s.pickup,
                      destination: r.destinationAddress ?? s.destination,
                      fromLat: r.fromLat ?? s.fromLat,
                      fromLng: r.fromLng ?? s.fromLng,
                      toLat: r.toLat ?? s.toLat,
                      toLng: r.toLng ?? s.toLng,
                      routePolyline: null,
                      distanceKm: r.distanceKm ?? s.distanceKm,
                    }))
                  }
                />
              </div>

              <CardContent className="mt-4">
                {bookingData.distanceKm > 0 && (
                  <p className="mb-4 text-sm text-muted-foreground">
                    ระยะทาง: <b>{bookingData.distanceKm.toFixed(2)} กิโลเมตร</b>
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* จุดรับ/ส่ง */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickup">จุดรับ</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                        <Input
                          id="pickup"
                          placeholder="กรอกสถานที่รับ"
                          className="pl-10"
                          value={bookingData.pickup}
                          onChange={handleTextChange("pickup")}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="destination">จุดส่ง</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-red-500" />
                        <Input
                          id="destination"
                          placeholder="กรอกสถานที่ส่ง"
                          className="pl-10"
                          value={bookingData.destination}
                          onChange={handleTextChange("destination")}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* เวลาไปรับ/ส่ง (ถ้ามีใน schema) */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickupAt">เวลาไปรับ</Label>
                      <Input
                        id="pickupAt"
                        type="datetime-local"
                        value={bookingData.pickupAt}
                        onChange={handleTimeChange("pickupAt")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dropoffAt">เวลาส่งถึง</Label>
                      <Input
                        id="dropoffAt"
                        type="datetime-local"
                        value={bookingData.dropoffAt}
                        onChange={handleTimeChange("dropoffAt")}
                      />
                    </div>
                  </div>

                  {/* เลือกรถ */}
                  <div className="space-y-2">
                    <Label htmlFor="vehicleType">เลือกรถ</Label>
                    <Select
                      value={bookingData.vehicleTypeId != null ? String(bookingData.vehicleTypeId) : ""}
                      onValueChange={handleVehicleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="กรุณาเลือกรถ" />
                      </SelectTrigger>
                      <SelectContent>
                        {VEHICLES.map((v) => (
                          <SelectItem key={v.id} value={String(v.id)}>
                            {v.icon} {v.name} — {v.pricePerKm} บาท/กม.
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* ปุ่ม */}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-hero shadow-elegant rounded-[16px]"
                    disabled={!canSubmit}
                  >
                    ยืนยันการจอง
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* สรุปการจอง */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-transport-orange" />
                  สรุปการจอง
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedVehicle ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-transport-light rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{selectedVehicle.icon}</span>
                        <div>
                          <h3 className="font-semibold">{selectedVehicle.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            <Users className="h-3 w-3 inline mr-1" />
                            รองรับ {selectedVehicle.capacity} คน
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{selectedVehicle.pricePerKm} บาท/กม.</p>
                        <p className="text-xs text-muted-foreground">ราคาต่อกิโลเมตร</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between">
                        <span>ระยะทาง</span>
                        <span>
                          {bookingData.distanceKm ? `${bookingData.distanceKm.toFixed(2)} กม.` : "-"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>อัตราค่าโดยสาร</span>
                        <span>{selectedVehicle.pricePerKm} บาท/กม.</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ค่าธรรมเนียม</span>
                        <span>{SERVICE_FEE} บาท</span>
                      </div>
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>รวมทั้งหมด</span>
                        <span>{estimatedTotal != null ? `${estimatedTotal.toFixed(2)} บาท` : "-"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    กรุณาเลือกรถเพื่อดูรายละเอียดราคา
                  </p>
                )}
              </CardContent>
            </Card>

            {/* รถที่มีให้เลือกแบบกดเลือกได้เร็ว */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  รถที่มีให้บริการ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {VEHICLES.map((v) => {
                    const active = bookingData.vehicleTypeId === v.id;
                    return (
                      <div
                        key={v.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-smooth ${active ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                          }`}
                        onClick={() => setBookingData((s) => ({ ...s, vehicleTypeId: v.id }))}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{v.icon}</span>
                            <div>
                              <p className="font-medium text-sm">{v.name}</p>
                              <p className="text-xs text-muted-foreground">
                                <Users className="h-3 w-3 inline mr-1" />
                                {v.capacity} ที่นั่ง
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-sm">{v.pricePerKm} บาท/กม.</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ข้อความแจ้งเตือน */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>หมายเหตุ:</strong> การจองต้องใช้การเชื่อมต่อกับ Supabase เพื่อบันทึกข้อมูลและการชำระเงิน
          </p>
        </div>
      </div>
    </div>
  );
}
