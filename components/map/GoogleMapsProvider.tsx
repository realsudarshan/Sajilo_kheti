"use client";

import { useJsApiLoader } from "@react-google-maps/api";
import React, { createContext, useContext, useMemo } from "react";

// We define this as a constant to prevent re-renders and use 'as any' 
// to bypass the internal type mismatch between versions.
const LIBRARIES: any = ["places"];

const GoogleMapsContext = createContext({ isLoaded: false });

export const GoogleMapsProvider = ({ children }: { children: React.ReactNode }) => {
  // We use useMemo just to be safe, though LIBRARIES is static
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: LIBRARIES,
  });

  if (loadError) {
    console.error("Google Maps Load Error:", loadError);
  }

  return (
    <GoogleMapsContext.Provider value={{ isLoaded }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => useContext(GoogleMapsContext);