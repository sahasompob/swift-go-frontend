"use client";

import { Car } from "lucide-react";
import { Button } from "./components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ส่วน Hero */}
      <section className="bg-gradient-hero text-primary-foreground py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            การเดินทางของคุณ,
            <br />
            <span className="text-transport-light">คือความสำคัญของเรา</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
            จองการเดินทางที่เชื่อถือได้และสะดวกสบายกับคนขับมืออาชีพ
            สัมผัสบริการขนส่งระดับพรีเมียมในราคาที่เข้าถึงได้
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="bg-gradient-accent shadow-glow text-lg px-8">
                <Car className="mr-2 h-5 w-5" />
                จองตอนนี้
              </Button>
            </Link>

            <Link href="/register-vehicle">
              <Button
                size="lg"
                variant="outline"
                className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8"
              >
                ลงทะเบียนรถ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
