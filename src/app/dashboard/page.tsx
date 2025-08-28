"use client";

import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Calendar, Car, Clock, DollarSign, MapPin, Users } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useAppDispatch } from "../store/hooks";
import { getMyBookingsRequest, selectBookings, selectBookingsLoading } from "../store/booking/bookingSlice";
import { Spinner } from "../components/Spinner";

type RideVM = {
  id: number;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  estimatedEarnings: number;
  status: string;
};

const formatDate = (iso?: string | null) => {
  if (!iso) return "-";
  const date = new Date(iso);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const formatTime = (iso?: string | null) => {
  if (!iso) return "-";
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

const normalizeStatus = (status: string | null | undefined) => {
  if (!status) return "pending";
  const text = status.toLowerCase();
  if (text === "pending") return "pending";
  if (text === "confirmed") return "confirmed";
  if (text === "completed") return "completed";
  if (text === "cancelled" || text === "canceled") return "cancelled";
  return text;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// ✅ แสดงสถานะเป็นภาษาไทย
const getStatusLabelTH = (status: string) => {
  switch (status) {
    case "completed":
      return "เสร็จสิ้น";
    case "confirmed":
      return "ยืนยันแล้ว";
    case "pending":
      return "รอดำเนินการ";
    case "cancelled":
      return "ยกเลิก";
    default:
      return status;
  }
};

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const bookings = useSelector(selectBookings);
  const loading = useSelector(selectBookingsLoading);

  useEffect(() => {
    dispatch(getMyBookingsRequest({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  const upcomingRides: RideVM[] = useMemo(() => {
    return (bookings ?? []).map((booking) => {
      const dateSrc = booking.pickupAt ?? booking.createdAt ?? null;
      const timeSrc = booking.pickupAt ?? booking.createdAt ?? null;

      const earningsNum = Number(
        (booking.finalPrice ?? booking.estimatedPrice ?? 0) as any
      );

      return {
        id: booking.id,
        pickup: booking.fromAddress ?? "-",
        destination: booking.toAddress ?? "-",
        date: formatDate(dateSrc),
        time: formatTime(timeSrc),
        estimatedEarnings: Number.isFinite(earningsNum) ? earningsNum : 0,
        status: normalizeStatus(booking.status),
      };
    });
  }, [bookings]);

  return (
    <section className="min-h-screen bg-gradient-to-br from-background to-transport-light-blue/20 py-8">
      <div className="min-h-screen bg-transport-light p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-transport-gray mb-2">แดชบอร์ด</h1>
            <p className="text-muted-foreground">ยินดีต้อนรับกลับมา! นี่คือภาพรวมงานขับของคุณ</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* งานที่จะถึง */}
            <div className="lg:col-span-2">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-transport-orange" />
                    งานที่จะถึง
                  </CardTitle>
                  <CardDescription>งานที่กำหนดไว้ในไม่กี่วันถัดไป</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-10">
                      <Spinner size={22} />
                      <span className="ml-2 text-sm text-muted-foreground">กำลังดึงรายการจอง…</span>
                    </div>
                  ) : upcomingRides.length === 0 ? (
                    <div className="text-sm text-muted-foreground">ยังไม่มีงานที่จะถึง</div>
                  ) : (
                    <div className="space-y-6">
                      {upcomingRides.map((ride) => (
                        <div
                          key={ride.id}
                          className="p-4 border rounded-lg hover:shadow-card transition-smooth"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <MapPin className="h-4 w-4 text-green-500" />
                                <span className="font-medium text-sm">{ride.pickup}</span>
                              </div>
                              <div className="flex items-center gap-2 ml-6">
                                <MapPin className="h-4 w-4 text-red-500" />
                                <span className="text-sm text-muted-foreground">
                                  {ride.destination}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(ride.status)}>{getStatusLabelTH(ride.status)}</Badge>
                              <p className="text-lg font-bold text-transport-gray mt-1">
                                ~฿{ride.estimatedEarnings.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {ride.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {ride.time}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              ดูรายละเอียด
                            </Button>
                            <Button size="sm" className="flex-1 bg-gradient-accent">
                              ติดต่อผู้โดยสาร
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* การทำงานด่วน */}
            <div className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>การทำงานด่วน</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-gradient-hero shadow-elegant">
                    <Car className="h-4 w-4 mr-2" />
                    ออนไลน์รับงาน
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    ดูแผนที่
                  </Button>
                  <Button variant="outline" className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    รายงานรายได้
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    ข้อความจากผู้โดยสาร
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
