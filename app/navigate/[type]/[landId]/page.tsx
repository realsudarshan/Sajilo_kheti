"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, MarkerF } from '@react-google-maps/api';
import { Loader2, ArrowLeft, Navigation, MapPin, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

const libraries: any = ["places"];

export default function DedicatedNavigationPage() {
  const params = useParams();
  const router = useRouter();
  const { type, landId } = params; // type is 'malpot' or 'land'

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [destinationName, setDestinationName] = useState("Loading Destination...");
  const [landCoords, setLandCoords] = useState<{lat: number, lng: number} | null>(null);

  // 1. Fetch Land Coords (Simulated - use your query hook here)
  useEffect(() => {
    // In a real app, use useGetLand(landId) here. 
    // For now, using your provided Pokhara coords:
    setLandCoords({ lat: 28.210415, lng: 83.984022 });
  }, [landId]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    if (!landCoords) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const origin = { lat: position.coords.latitude, lng: position.coords.longitude };
      const directionsService = new google.maps.DirectionsService();

      if (type === 'malpot') {
        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: landCoords,
          radius: 15000,
          keyword: 'Malpot Office Land Revenue'
        }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            setDestinationName(results[0].name || "Malpot Office");
            directionsService.route({
              origin,
              destination: results[0].geometry!.location!,
              travelMode: google.maps.TravelMode.DRIVING,
            }, (res, stat) => { if (stat === 'OK') setDirections(res); });
          }
        });
      } else {
        setDestinationName("Your Land Site");
        directionsService.route({
          origin,
          destination: landCoords,
          travelMode: google.maps.TravelMode.DRIVING,
        }, (res, stat) => { if (stat === 'OK') setDirections(res); });
      }
    });
  }, [landCoords, type]);

  if (!isLoaded || !landCoords) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-zinc-950">
      <Loader2 className="h-10 w-10 text-emerald-500 animate-spin mb-4" />
      <p className="text-zinc-400 font-bold animate-pulse uppercase tracking-widest text-xs">Initializing Live GPS...</p>
    </div>
  );

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-950">
      {/* Header */}
      <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white hover:bg-zinc-800">
            <ArrowLeft />
          </Button>
          <div>
            <h1 className="text-white font-black uppercase text-sm tracking-tight leading-none">
              {type === 'malpot' ? 'Legal Navigation' : 'Site Navigation'}
            </h1>
            <p className="text-emerald-500 text-[10px] font-bold uppercase mt-1">{destinationName}</p>
          </div>
        </div>
        <Badge status={type} />
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={landCoords}
          zoom={14}
          onLoad={onMapLoad}
          options={{ disableDefaultUI: true, zoomControl: true, styles: mapTheme }}
        >
          {directions && <DirectionsRenderer directions={directions} options={{ polylineOptions: { strokeColor: type === 'malpot' ? "#10b981" : "#3b82f6", strokeWeight: 6 } }} />}
          <MarkerF position={landCoords} label="TARGET" />
        </GoogleMap>
      </div>

      {/* Footer Drawer */}
      <div className="p-6 bg-zinc-900 border-t border-zinc-800">
        <div className="flex justify-between items-center gap-4">
          <div className="space-y-1">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Route Mode</p>
            <div className="flex items-center gap-2 text-white font-bold">
              <MapPin className={`h-4 w-4 ${type === 'malpot' ? 'text-emerald-500' : 'text-blue-500'}`} />
              Current Location <ArrowRight className="h-3 w-3" /> {destinationName}
            </div>
          </div>
          <Button className={`${type === 'malpot' ? 'bg-emerald-600' : 'bg-blue-600'} text-white rounded-2xl px-10 h-12 font-black`} asChild>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${landCoords.lat},${landCoords.lng}&travelmode=driving`} target="_blank">
              OPEN GOOGLE MAPS
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Badge({ status }: { status: any }) {
  return (
    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${status === 'malpot' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : 'border-blue-500 text-blue-500 bg-blue-500/10'}`}>
      {status === 'malpot' ? <><Landmark className="h-3 w-3 inline mr-1" /> LEGAL</> : <><Navigation className="h-3 w-3 inline mr-1" /> FIELD SITE</>}
    </div>
  );
}

const mapTheme: google.maps.MapTypeStyle[] = [ /* Your dark mode styles here */ ];
function ArrowRight(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg> }