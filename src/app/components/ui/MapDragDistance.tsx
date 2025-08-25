"use client";

import React, { useState, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 13.7563,
  lng: 100.5018,
};

export default function MapDragDistance() {
  const { isLoaded } = useLoadScript({
    // ใช้ Google Maps JS API แค่โหลดแผนที่
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });

  const [position, setPosition] = useState(center);
  const [distance, setDistance] = useState<number | null>(null);

  const haversineDistance = (
    coord1: { lat: number; lng: number },
    coord2: { lat: number; lng: number }
  ) => {
    const R = 6371;
    const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.lat * Math.PI) / 180) *
        Math.cos((coord2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    const newPosition = { lat: newLat, lng: newLng };

    setPosition(newPosition);

    const d = haversineDistance(center, newPosition);
    setDistance(d);
  }, []);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="space-y-4">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        <Marker
          position={position}
          draggable
          onDragEnd={handleDragEnd}
        />
      </GoogleMap>

      {distance !== null && (
        <p className="text-lg font-semibold">
          ระยะทาง: {distance.toFixed(2)} กม.
        </p>
      )}
    </div>
  );
}
