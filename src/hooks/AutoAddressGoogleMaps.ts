"use client";

import { useEffect, useState, RefObject, useRef } from "react";

export interface AddressDetails {
  streetAddress: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  countryCode: string;
}

export function useGooglePlacesAutocomplete(
  inputRef: RefObject<HTMLInputElement | null>,
  countryCode: string,
  onAddressSelect: (details: AddressDetails) => void
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    const scriptId = "google-maps-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", () => setIsLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        fields: ["address_components", "formatted_address"],
        types: ["address"],
        componentRestrictions: { country: countryCode.toLowerCase() },
      }
    );

    const listener = autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place || !place.address_components) return;

      let streetNumber = "";
      let route = "";
      let city = "";
      let stateProvince = "";
      let postalCode = "";
      let country = "";
      let returnedCountryCode = "";

      for (const component of place.address_components) {
        const types = component.types;
        if (types.includes("street_number")) streetNumber = component.long_name;
        if (types.includes("route")) route = component.long_name;
        if (types.includes("locality") || types.includes("postal_town")) city = component.long_name;
        if (types.includes("administrative_area_level_1")) stateProvince = component.long_name;
        if (types.includes("postal_code")) postalCode = component.long_name;
        if (types.includes("country")) {
          country = component.long_name;
          returnedCountryCode = component.short_name;
        }
      }

      const formattedStreet = `${streetNumber} ${route}`.trim();

      onAddressSelect({
        streetAddress: formattedStreet,
        city,
        stateProvince,
        postalCode,
        country,
        countryCode: returnedCountryCode,
      });
    });

    return () => {
      window.google.maps.event.removeListener(listener);
      const pacContainers = document.querySelectorAll(".pac-container");
      pacContainers.forEach((node) => node.remove());
    };

  }, [isLoaded, inputRef]); 

  useEffect(() => {
    if (autocompleteRef.current && countryCode) {
      autocompleteRef.current.setComponentRestrictions({
        country: countryCode.toLowerCase(),
      });
    }
  }, [countryCode]);

  return { isLoaded };
}