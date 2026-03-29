"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  MarkerF,
  Polyline,
} from "@react-google-maps/api";
import { Loader2, ArrowLeft, Navigation, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetLandById } from "@/queryandmutation";

const libraries: any = ["places"];

export default function DedicatedNavigationPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as string; // "malpot" or other
  const landId = params.landId as string;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  const { data: land, isLoading } = useGetLandById(landId);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<any>(null);
  const [userCoords, setUserCoords] = useState<any>(null);
  const [landCoords, setLandCoords] = useState<any>(null);
  const [malpotCoords, setMalpotCoords] = useState<any>(null);
  const [loadingRoute, setLoadingRoute] = useState(true);
  const [useStraightLine, setUseStraightLine] = useState(false);

  // 1. Initialize Land Coords
  useEffect(() => {
    if (land?.latitude && land?.longitude) {
      setLandCoords({
        lat: Number(land.latitude),
        lng: Number(land.longitude),
      });
    }
  }, [land]);

  // 2. Find Nearest Malpot Office (Only if type is malpot)
  useEffect(() => {
    if (!isLoaded || !map || !landCoords || type !== "malpot") return;

    const service = new google.maps.places.PlacesService(map);
    const request = {
      location: landCoords,
      radius: 50000, // Search within 50km
      keyword: "Malpot Karyalaya Land Revenue Office",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        setMalpotCoords({
          lat: results[0].geometry?.location?.lat(),
          lng: results[0].geometry?.location?.lng(),
          name: results[0].name
        });
      }
    });
  }, [isLoaded, map, landCoords, type]);

  // 3. Routing Logic (Targets Malpot if type is malpot, else targets Land)
  useEffect(() => {
    if (!isLoaded || !map || !landCoords) return;

    // Determine the destination
    const destination = (type === "malpot" && malpotCoords) ? malpotCoords : landCoords;

    // If we are waiting for Malpot coords to load, don't route yet
    if (type === "malpot" && !malpotCoords) return;

    setLoadingRoute(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const origin = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(origin);

        const directionsService = new window.google.maps.DirectionsService();

        const attemptRouting = (modeIndex: number) => {
          const modes = [
            window.google.maps.TravelMode.DRIVING,
            window.google.maps.TravelMode.WALKING,
          ];

          if (modeIndex >= modes.length) {
            setUseStraightLine(true);
            setLoadingRoute(false);
            return;
          }

          directionsService.route(
            {
              origin,
              destination,
              travelMode: modes[modeIndex],
            },
            (res, stat) => {
              if (stat === "OK") {
                setDirections(res);
                setUseStraightLine(false);
                setLoadingRoute(false);
              } else {
                attemptRouting(modeIndex + 1);
              }
            }
          );
        };

        attemptRouting(0);
      },
      () => setLoadingRoute(false)
    );
  }, [isLoaded, map, landCoords, malpotCoords, type]);

  const onLoad = useCallback((mapInstance: any) => setMap(mapInstance), []);

  if (!isLoaded || isLoading || !landCoords) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-white" />
      </div>
    );
  }

  const activeDestination = (type === "malpot" && malpotCoords) ? malpotCoords : landCoords;

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="p-4 flex items-center gap-3 bg-zinc-900 border-b border-zinc-800">
        <Button onClick={() => router.back()} size="icon" variant="ghost" className="text-white">
          <ArrowLeft />
        </Button>
        <h1 className="text-white text-sm font-bold uppercase truncate">
          {type === "malpot" ? "To Nearest Malpot Office" : "To Land Location"}
        </h1>
      </div>

      <div className="flex-1 relative">
        <GoogleMap
          center={activeDestination}
          zoom={12}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={onLoad}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          {directions && <DirectionsRenderer directions={directions} />}

          {useStraightLine && userCoords && (
            <Polyline
              path={[userCoords, activeDestination]}
              options={{ strokeColor: "#ef4444", strokeOpacity: 0.8, strokeWeight: 4 }}
            />
          )}

          {/* Markers */}
          <MarkerF position={landCoords} label="LAND" />
          {malpotCoords && (
            <MarkerF
              position={malpotCoords}
              icon="http://googleusercontent.com/maps.google.com/mapfiles/ms/icons/blue-dot.png"
              label="MALPOT"
            />
          )}
        </GoogleMap>

        {type === "malpot" && malpotCoords && (
          <div className="absolute top-4 left-4 right-4 bg-blue-600 text-white p-3 rounded-lg text-xs shadow-xl flex items-center gap-2">
            <Landmark size={16} />
            <span>Found: {malpotCoords.name}</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-900 border-t border-zinc-800">
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${activeDestination.lat},${activeDestination.lng}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-bold">
            Start Navigation
          </Button>
        </a>
      </div>
    </div>
  );
}