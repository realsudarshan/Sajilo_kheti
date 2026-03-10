"use client";

import React, { useState, useCallback } from 'react';
import { GoogleMap, DirectionsRenderer, MarkerF } from '@react-google-maps/api';
import { Loader2, X, Navigation, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGoogleMaps } from './GoogleMapsProvider';

interface NavigatorProps {
  landCoords: { lat: number; lng: number };
  onClose: () => void;
}

const containerStyle = { width: '100%', height: '450px' };

export default function LandNavigator({ landCoords, onClose }: NavigatorProps) {
  const { isLoaded } = useGoogleMaps();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(currentPos);

        const directionsService = new google.maps.DirectionsService();
        directionsService.route({
          origin: currentPos,
          destination: landCoords,
          travelMode: google.maps.TravelMode.DRIVING,
        }, (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) setDirections(result);
        });
      });
    }
  }, [landCoords]);

  if (!isLoaded) return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><Loader2 className="animate-spin text-white" /></div>;

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="p-5 flex justify-between items-center border-b">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tighter">Live Land Navigation</h2>
            <p className="text-xs text-blue-600 font-bold flex items-center gap-1"><Navigation className="h-3 w-3" /> To: Land Location</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onClose}><X /></Button>
        </div>

        <GoogleMap mapContainerStyle={containerStyle} center={userLocation || landCoords} zoom={14} onLoad={onMapLoad} options={{ disableDefaultUI: true, zoomControl: true }}>
          {directions && <DirectionsRenderer directions={directions} options={{ polylineOptions: { strokeColor: "#3b82f6", strokeWeight: 6 } }} />}
          <MarkerF position={landCoords} label="Target Site" />
        </GoogleMap>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-700">
            <MapPin className="h-4 w-4 text-blue-500" /> Current Location <ArrowRight className="h-3 w-3" /> Land Site
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8" asChild>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${landCoords.lat},${landCoords.lng}&travelmode=driving`} target="_blank">Start Live GPS</a>
          </Button>
        </div>
      </div>
    </div>
  );
}