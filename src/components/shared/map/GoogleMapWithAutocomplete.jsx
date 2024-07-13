"use client";
import React, { useState, useRef, useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";
import {
  GoogleMap,
  Autocomplete,
  Marker,
} from "@react-google-maps/api";
import { IoLocationOutline } from "react-icons/io5";
import { useClaimFormContext } from "@/context/claimform-provider";

const containerStyle = {
  width: "100%",
  height: "200px",
};

const center = {
  lat: 27.9944024,
  lng: -81.7602544,
};

const libraries = ["places"];

const GoogleMapWithAutocomplete = ({ name, label, isRequired, register, errors, setValue }) => {
  const { getValues } = useClaimFormContext();
  const [autocomplete, setAutocomplete] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(center);
  const [address, setAddress] = useState("");
  const googleMapApi = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const autocompleteRef = useRef(null);

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  useEffect(() => {
    const currentAddress = getValues(name);
    setAddress(currentAddress);
    setValue(name, currentAddress); // Sync initial value
  }, [name, getValues, setValue]);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      const formattedAddress = place.formatted_address;
      setAddress(formattedAddress);
      setValue(name, formattedAddress); // Update form state with the new address

      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setMarkerPosition({ lat, lng });
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });
    getGeocode(lat, lng);
  };

  const getGeocode = (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          const formattedAddress = results[0].formatted_address;
          setAddress(formattedAddress);
          setValue(name, formattedAddress); // Update form state with the new address
        } else {
          console.log("No results found");
        }
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  };

  const handleChange = (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setValue(name, newAddress); // Update form state when user types manually
  };

  const handleIconClick = () => {
    getGeocode(markerPosition.lat, markerPosition.lng);
  };

  return (
    <>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        ref={autocompleteRef}
      >
        <div>
          <label htmlFor={name} className="text-sm mb-2 mt-3">{label} {isRequired && "*"}</label>
          <div className="flex items-center justify-between border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 mb-3">
            <input
            id={name}
              type="text"
              name={name}
              placeholder={`${label}${isRequired ? "*" : ""}`}
              {...register(name, { required: isRequired })}
              value={address}
              onChange={handleChange}
              className="w-full border-none outline-none"
            />
            <IoLocationOutline className="cursor-pointer" onClick={handleIconClick}/>
            {errors && (
              <ErrorMessage
                errors={errors}
                name={name}
                render={({}) => (
                  <p className="text-red-600 -mt-2 text-xs mb-2">
                    {label} is required
                  </p>
                )}
              />
            )}
          </div>
        </div>
      </Autocomplete>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition} // Update the center to markerPosition
        zoom={14}
        onClick={onMapClick}
      >
        <Marker position={markerPosition} />
      </GoogleMap>
    </>
  );
};

export default GoogleMapWithAutocomplete;
