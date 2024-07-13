// GoogleMapsProvider.js
"use client"
import React, { createContext, useContext } from "react";
import { LoadScript } from "@react-google-maps/api";

const GoogleMapsContext = createContext();

export const useGoogleMaps = () => useContext(GoogleMapsContext);

const libraries = ["places"];

export const GoogleMapsProvider = ({ children }) => {
  const googleMapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  return (
    <LoadScript googleMapsApiKey={googleMapApiKey} libraries={libraries}>
      <GoogleMapsContext.Provider value={{}}>
        {children}
      </GoogleMapsContext.Provider>
    </LoadScript>
  );
};
