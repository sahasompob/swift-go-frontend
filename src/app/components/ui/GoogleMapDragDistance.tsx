"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
  Autocomplete,
} from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 13.7563, lng: 100.5018 };

type RouteChangePayload = {
  originAddress: string | null;
  destinationAddress: string | null;
  fromLat: number | null;
  fromLng: number | null;
  toLat: number | null;
  toLng: number | null;
  distanceKm: number | null;
  polylinePath: Array<{ lat: number; lng: number }> | null;
};

type Props = {
  onDistanceChange?: (km: number | null) => void;
  onAddressChange?: (addr: { origin?: string | null; destination?: string | null }) => void;
  onRouteChange?: (data: RouteChangePayload) => void; // ✅ ใหม่
};

export default function GoogleMapDragDistance({
  onDistanceChange,
  onAddressChange,
  onRouteChange,
}: Props) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    language: "th",
    libraries: ["places"],
  });

  const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>(null);
  const [destination, setDestination] = useState<google.maps.LatLngLiteral | null>(null);
  const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  const [originAddress, setOriginAddress] = useState<string>("");
  const [destinationAddress, setDestinationAddress] = useState<string>("");

  const originAutoRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationAutoRef = useRef<google.maps.places.Autocomplete | null>(null);

  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (isLoaded && !geocoderRef.current) {
      geocoderRef.current = new google.maps.Geocoder();
    }
  }, [isLoaded]);

  const reverseGeocode = useCallback(async (loc: google.maps.LatLngLiteral) => {
    if (!geocoderRef.current) return null;
    const { results } = await geocoderRef.current.geocode({ location: loc });
    return results?.[0]?.formatted_address ?? null;
  }, []);

  const calcDistance = useCallback(
    async (o: google.maps.LatLngLiteral, d: google.maps.LatLngLiteral) => {
      try {
        const res = await fetch(
          `/api/distance?origin=${o.lat},${o.lng}&destination=${d.lat},${d.lng}`
        );
        const data = await res.json();
        const dist = data?.rows?.[0]?.elements?.[0]?.distance?.value;
        if (typeof dist === "number") {
          const km = dist / 1000;
          setDistanceKm(km);
          onDistanceChange?.(km);
          return km;
        } else {
          setDistanceKm(null);
          onDistanceChange?.(null);
          return null;
        }
      } catch (e) {
        console.error("Error fetching distance:", e);
        setDistanceKm(null);
        onDistanceChange?.(null);
        return null;
      }
    },
    [onDistanceChange]
  );

  const emitRouteChange = useCallback(
    (extra?: Partial<RouteChangePayload>) => {
      onRouteChange?.({
        originAddress: originAddress || null,
        destinationAddress: destinationAddress || null,
        fromLat: origin?.lat ?? null,
        fromLng: origin?.lng ?? null,
        toLat: destination?.lat ?? null,
        toLng: destination?.lng ?? null,
        distanceKm,
        polylinePath: origin && destination ? path : null,
        ...extra,
      });
    },
    [onRouteChange, originAddress, destinationAddress, origin, destination, distanceKm, path]
  );

  // วางหมุดจากการคลิก
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    if (!origin) {
      setOrigin(latLng);
      const addr = (await reverseGeocode(latLng)) ?? `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`;
      setOriginAddress(addr);
      onAddressChange?.({ origin: addr, destination: destinationAddress || null });
      emitRouteChange({ originAddress: addr, fromLat: latLng.lat, fromLng: latLng.lng });
    } else if (!destination) {
      setDestination(latLng);
      const addr = (await reverseGeocode(latLng)) ?? `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`;
      setDestinationAddress(addr);
      onAddressChange?.({ origin: originAddress || null, destination: addr });
      const km = await calcDistance(origin, latLng);
      emitRouteChange({
        destinationAddress: addr,
        toLat: latLng.lat,
        toLng: latLng.lng,
        distanceKm: km,
      });
    }
  };

  // ลากหมุด → คำนวณ
  const handleMarkerDragEnd =
    (which: "origin" | "destination") => async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };

      if (which === "origin") {
        setOrigin(latLng);
        const addr = (await reverseGeocode(latLng)) ?? `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`;
        setOriginAddress(addr);
        onAddressChange?.({ origin: addr, destination: destinationAddress || null });
        const km = destination ? await calcDistance(latLng, destination) : distanceKm;
        emitRouteChange({ originAddress: addr, fromLat: latLng.lat, fromLng: latLng.lng, distanceKm: km ?? null });
      } else {
        setDestination(latLng);
        const addr = (await reverseGeocode(latLng)) ?? `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`;
        setDestinationAddress(addr);
        onAddressChange?.({ origin: originAddress || null, destination: addr });
        const km = origin ? await calcDistance(origin, latLng) : distanceKm;
        emitRouteChange({ destinationAddress: addr, toLat: latLng.lat, toLng: latLng.lng, distanceKm: km ?? null });
      }
    };

  // อัปเดตเส้น A→B
  useEffect(() => {
    if (origin && destination) setPath([origin, destination]);
    else setPath([]);
  }, [origin, destination]);

  useEffect(() => {
    if (polylineRef.current) polylineRef.current.setPath(path);
    // แจ้ง parent เมื่อ path เปลี่ยน
    emitRouteChange();
  }, [path]); // eslint-disable-line react-hooks/exhaustive-deps

  // ====== Autocomplete ======
  const onOriginLoad = (ac: google.maps.places.Autocomplete) => (originAutoRef.current = ac);
  const onDestinationLoad = (ac: google.maps.places.Autocomplete) => (destinationAutoRef.current = ac);

  const onOriginPlaceChanged = async () => {
    const ac = originAutoRef.current;
    if (!ac) return;
    const place = ac.getPlace();
    const loc = place.geometry?.location;
    if (!loc) return;

    const pos = { lat: loc.lat(), lng: loc.lng() };
    setOrigin(pos);
    const formatted = place.formatted_address || place.name || originAddress;
    setOriginAddress(formatted || "");
    onAddressChange?.({ origin: formatted ?? null, destination: destinationAddress || null });

    const km = destination ? await calcDistance(pos, destination) : distanceKm;
    emitRouteChange({
      originAddress: formatted ?? null,
      fromLat: pos.lat, fromLng: pos.lng,
      distanceKm: km ?? null,
    });
  };

  const onDestinationPlaceChanged = async () => {
    const ac = destinationAutoRef.current;
    if (!ac) return;
    const place = ac.getPlace();
    const loc = place.geometry?.location;
    if (!loc) return;

    const pos = { lat: loc.lat(), lng: loc.lng() };
    setDestination(pos);
    const formatted = place.formatted_address || place.name || destinationAddress;
    setDestinationAddress(formatted || "");
    onAddressChange?.({ origin: originAddress || null, destination: formatted ?? null });

    const km = origin ? await calcDistance(origin, pos) : distanceKm;
    emitRouteChange({
      destinationAddress: formatted ?? null,
      toLat: pos.lat, toLng: pos.lng,
      distanceKm: km ?? null,
    });
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="w-full">
      <div className="flex flex-col items-center w-full">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={origin || destination || defaultCenter}
          zoom={12}
          onClick={handleMapClick}
        >
          {origin && (
            <Marker position={origin} draggable onDragEnd={handleMarkerDragEnd("origin")} label="A" />
          )}
          {destination && (
            <Marker position={destination} draggable onDragEnd={handleMarkerDragEnd("destination")} label="B" />
          )}
          {origin && destination && (
            <Polyline
              path={path}
              options={{ strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 3 }}
              onLoad={(poly) => (polylineRef.current = poly)}
            />
          )}
        </GoogleMap>

        {/* ถ้าจะใช้ช่องค้นหา ให้ปลดคอมเมนต์ด้านล่าง */}
        {/*
        <div className="grid md:grid-cols-2 gap-3 w-full mt-3">
          <Autocomplete onLoad={onOriginLoad} onPlaceChanged={onOriginPlaceChanged}>
            <input className="rounded-md border px-3 py-2 w-full" placeholder="ค้นหา A" value={originAddress} onChange={(e) => setOriginAddress(e.target.value)} />
          </Autocomplete>
          <Autocomplete onLoad={onDestinationLoad} onPlaceChanged={onDestinationPlaceChanged}>
            <input className="rounded-md border px-3 py-2 w-full" placeholder="ค้นหา B" value={destinationAddress} onChange={(e) => setDestinationAddress(e.target.value)} />
          </Autocomplete>
        </div>
        */}
      </div>
    </div>
  );
}
