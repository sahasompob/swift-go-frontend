import Image from "next/image";

type Price = {
  id: number;
  minKm: number;
  maxKm: number;
  basePrice: number;
  pricePerKm: number;
};

type Vehicle = {
  id: number;
  name: string;
  capacity: number;
  imageUrl: string | null;
  prices: Price[];
};

type Props = {
  vehicle: Vehicle;
  selected: boolean;
  onSelect: (id: number) => void;
};

export default function VehicleCard({ vehicle, selected, onSelect }: Props) {
  return (
    <div
      onClick={() => onSelect(vehicle.id)}
       className={`cursor-pointer transition-all duration-300 rounded-xl shadow-md p-4 border border-white/20 bg-white/10
    ${selected ? "outline outline-2 outline-blue-400" : "outline-none"}
    hover:outline hover:outline-2 hover:outline-blue-400`}
    >
      <div className="flex items-center mb-4">
        <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 mr-4">
          {vehicle.imageUrl ? (
            <Image
              src={vehicle.imageUrl}
              alt={vehicle.name}
              width={80}
              height={80}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{vehicle.name}</h2>
          <p className="text-gray-400">ที่นั่ง: {vehicle.capacity} ที่นั่ง</p>
        </div>
      </div>
    </div>
  );
}
