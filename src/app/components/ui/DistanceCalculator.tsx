import { useState } from "react";
import { MapPin, Calculator, Truck, DollarSign } from "lucide-react";
import GoogleMapDragDistance from "./GoogleMapDragDistance";
import VehicleCard from "./VehicleCard";
import MapDragDistance from "./MapDragDistance";

const DistanceCalculator = () => {
  const [distance, setDistance] = useState<number | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const handleVehicleSelect = (id: number) => {
    setSelectedVehicle(id);
    setCalculatedPrice(null);
  };

  const calculatePrice = () => {
    console.log(distance)
    if (distance === null || selectedVehicle === null) return 0;

    const vehicle = vehicles.find((v) => v.id === selectedVehicle);
    if (!vehicle) return;

    const priceTier = vehicle.prices.find(
      (p) => distance >= p.minKm && distance <= p.maxKm
    );
    
    console.log(priceTier)

    if (priceTier) {
      const price = priceTier.basePrice + priceTier.pricePerKm * distance;
      setCalculatedPrice(price);
      console.log(price)
    } else {
      setCalculatedPrice(null);
    }
  };

  const resetCalculation = () => {
    setDistance(null);
    setEstimatedPrice(null);
  };

  const vehicles = [
    {
      id: 1,
      name: "มอเตอร์ไซด์",
      capacity: 8,
      imageUrl: null,
      prices: [
        { id: 1, minKm: 0, maxKm: 10, basePrice: 100, pricePerKm: 10 },
        { id: 2, minKm: 11, maxKm: 500, basePrice: 200, pricePerKm: 8 },
      ],
    },
    {
      id: 2,
      name: "กระบะ",
      capacity: 4,
      imageUrl: null,
      prices: [
        { id: 3, minKm: 0, maxKm: 10, basePrice: 120, pricePerKm: 12 },
        { id: 4, minKm: 11, maxKm: 200, basePrice: 220, pricePerKm: 9 },
      ],
    },

    {
      id: 3,
      name: "สิบล้อ",
      capacity: 10,
      imageUrl: null,
      prices: [
        { id: 3, minKm: 0, maxKm: 10, basePrice: 120, pricePerKm: 12 },
        { id: 4, minKm: 11, maxKm: 200, basePrice: 220, pricePerKm: 9 },
      ],
    },
  ];

  return (
    <section className="min-h-screen relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/70" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="landing-heading">
            การขนส่งรถยนต์ระดับมืออาชีพ
          </h1>
          <p className="landing-text">
            รับการคำนวณระยะทางและราคาแบบทันที สำหรับความต้องการในการขนส่งรถของคุณ บริการปลอดภัย เชื่อถือได้ และมืออาชีพ ครอบคลุมทั่วประเทศ
          </p>
        </div>
        <div className="flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-6 w-[70%] h-[50%] ">
            <div className="flex items-center text-2xl mb-4">
              <Calculator className="h-6 w-6 mr-3 text-yellow-400" />
              คำนวณระยะทางและราคา
            </div>

            <div className="w-full h-96 mb-4">
              <div id="map" className="w-full h-full rounded-lg">
                <GoogleMapDragDistance onDistanceChange={setDistance} />
              </div>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <div className="p-6 max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">เลือกรถ</h1>
                <div className="grid md:grid-cols-3 gap-6">
                  {vehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      selected={vehicle.id === selectedVehicle}
                      onSelect={() => handleVehicleSelect(vehicle.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={calculatePrice}
                  className="bg-yellow-400 text-white p-2 rounded hover:bg-yellow-500 transition"
                >
                  คำนวนราคา
                </button>
              </div>
            </div>

            {distance && estimatedPrice && (
              <div className="grid md:grid-cols-2 gap-4 pt-6 border-t border-white/20">
                <div className="bg-white/10 border border-yellow-400/20 rounded p-4 flex items-center justify-center">
                  <Truck className="h-8 w-8 text-yellow-400 mr-3" />
                  <div className="text-center">
                    <p className="text-sm text-white/80">Distance</p>
                    <p className="text-2xl font-bold text-white">{distance} miles</p>
                  </div>
                </div>
                <div className="bg-white/10 border border-yellow-400/20 rounded p-4 flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-yellow-400 mr-3" />
                  <div className="text-center">
                    <p className="text-sm text-white/80">Estimated Price</p>
                    <p className="text-2xl font-bold text-white">${estimatedPrice}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistanceCalculator;
