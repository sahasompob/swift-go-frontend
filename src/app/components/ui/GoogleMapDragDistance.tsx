"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, useLoadScript, Marker, Polyline } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 13.7563, lng: 100.5018 };

type Props = {
    onDistanceChange?: (km: number | null) => void; // callback ส่งค่ากลับ parent
};

export default function GoogleMapSelectPointsSingleLine({ onDistanceChange }: Props) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY as string,
    });

    const [origin, setOrigin] = useState<google.maps.LatLngLiteral | null>(null);
    const [destination, setDestination] = useState<google.maps.LatLngLiteral | null>(null);
    const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]);
    const [distanceKm, setDistanceKm] = useState<number | null>(null);

    const polylineRef = useRef<google.maps.Polyline | null>(null);

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };

        if (!origin) setOrigin(latLng);
        else if (!destination) setDestination(latLng);
    };

    const handleMarkerDrag = (marker: "origin" | "destination") => (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const latLng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        if (marker === "origin") setOrigin(latLng);
        else setDestination(latLng);
    };

    // อัพเดต path ทุกครั้งที่ origin หรือ destination เปลี่ยน
    useEffect(() => {
        if (origin && destination) {
            setPath([{ ...origin }, { ...destination }]);
        } else {
            setPath([]);
        }
    }, [origin, destination]);

    // ฟังก์ชันเรียก API Distance Matrix
    const calculateDistance = useCallback(async () => {
        if (!origin || !destination) return;

        const originStr = `${origin.lat},${origin.lng}`;
        const destinationStr = `${destination.lat},${destination.lng}`;

        try {
            const res = await fetch(`/api/distance?origin=${originStr}&destination=${destinationStr}`);
            const data = await res.json();
            if (data.rows?.[0]?.elements?.[0]?.distance) {
                const km = data.rows[0].elements[0].distance.value / 1000;
                setDistanceKm(km);

                // ส่งค่าไป parent
                if (onDistanceChange) onDistanceChange(km);
            }
        } catch (error) {
            console.error("Error fetching distance:", error);
            if (onDistanceChange) onDistanceChange(null);
        }
    }, [origin, destination, onDistanceChange]);

    useEffect(() => {
        calculateDistance();
    }, [origin, destination, calculateDistance]);

    useEffect(() => {
        if (polylineRef.current) {
            polylineRef.current.setPath(path);
        }
    }, [path]);

    if (!isLoaded) return <p>Loading map...</p>;

    return (
        <div className="flex flex-col items-center w-full">
            <p className="mb-2 text-gray-700">
                {!origin ? "Select point A" : !destination ? "Select point B" : "Drag markers to adjust"}
            </p>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={origin || defaultCenter}
                zoom={12}
                onClick={handleMapClick}
            >
                {origin && (
                    <Marker
                        position={origin}
                        draggable
                        onDragEnd={handleMarkerDrag("origin")}
                        label="A"
                    />
                )}
                {destination && (
                    <Marker
                        position={destination}
                        draggable
                        onDragEnd={handleMarkerDrag("destination")}
                        label="B"
                    />
                )}

                {origin && destination && (
                    <Polyline
                        path={path}
                        options={{ strokeColor: "#FF0000", strokeOpacity: 0.8, strokeWeight: 3 }}
                        onLoad={poly => (polylineRef.current = poly)}
                    />
                )}
            </GoogleMap>

            {distanceKm !== null && (
                <p className="mt-2 text-lg font-medium">Distance: {distanceKm.toFixed(2)} km</p>
            )}
        </div>
    );
}
