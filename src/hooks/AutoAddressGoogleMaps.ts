"use client";

import { RefObject, useEffect, useRef, useState } from "react";

export function useGooglePlacesAutocomplete(
  inputRef: RefObject<HTMLInputElement | null>,
  countryCode: string | undefined | null,
  onAddressSelect: (details: any) => void,
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // 1. Load Google Maps Script
  useEffect(() => {
    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]',
    );

    if (existingScript) {
      const handleLoad = () => setIsLoaded(true);
      existingScript.addEventListener("load", handleLoad);
      if ((existingScript as any).loaded) setIsLoaded(true);
      return () => existingScript.removeEventListener("load", handleLoad);
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      (script as any).loaded = true;
      setIsLoaded(true);
    };
    document.head.appendChild(script);
  }, []);

  // 2. Initialize Autocomplete UI on the Input
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    // Attach the built-in Google Places UI to the input
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ["address_components", "geometry"],
      componentRestrictions: countryCode ? { country: countryCode.toLowerCase() } : undefined,
    });

    // Listen for when the user selects a place from the dropdown
    const listener = autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      
      if (!place || !place.address_components) return;

      let streetNumber = "";
      let route = "";
      let city = "";
      let stateProvince = "";
      let postalCode = "";
      let selectedCountryCode = "";

      // Parse Google's address_components array into standard fields
      for (const component of place.address_components) {
        const types = component.types;
        if (types.includes("street_number")) streetNumber = component.long_name;
        if (types.includes("route")) route = component.long_name;
        if (types.includes("locality") || types.includes("postal_town")) city = component.long_name;
        if (types.includes("administrative_area_level_1")) stateProvince = component.short_name;
        if (types.includes("postal_code")) postalCode = component.long_name;
        if (types.includes("country")) selectedCountryCode = component.short_name;
      }

      // Fire the callback to update your React state
      onAddressSelect({
        streetAddress: `${streetNumber} ${route}`.trim(),
        city,
        stateProvince,
        postalCode,
        countryCode: selectedCountryCode,
      });
    });

    return () => {
      if (listener) {
        google.maps.event.removeListener(listener);
      }
    };
    // Note: Intentionally excluding onAddressSelect from dependency array to prevent re-attaching
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, inputRef]); 

  // 3. Dynamically update country restrictions if the user changes the country in the form
  useEffect(() => {
    if (autocompleteRef.current && countryCode) {
      autocompleteRef.current.setComponentRestrictions({
        country: countryCode.toLowerCase(),
      });
    }
  }, [countryCode]);

  return { isLoaded };
}