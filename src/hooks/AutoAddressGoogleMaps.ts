"use client";

import { RefObject, useEffect, useRef, useState } from "react";

// 1. Tell TypeScript that 'google' exists on the global window object
declare global {
  interface Window {
    google: typeof google;
  }
}

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
  countryCode: string | undefined | null,
  onAddressSelect: (details: AddressDetails) => void
) {
  // 2. Fix "cascading renders" warning by initializing state safely based on the window object
  const [isLoaded, setIsLoaded] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.google?.maps?.places) {
      return true;
    }
    return false;
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onAddressSelectRef = useRef(onAddressSelect);
  useEffect(() => {
    onAddressSelectRef.current = onAddressSelect;
  }, [onAddressSelect]);

  // Load the script only if not already loaded
  useEffect(() => {
    if (isLoaded) return;

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
      const handleLoad = () => setIsLoaded(true);
      script.addEventListener("load", handleLoad);
      return () => script.removeEventListener("load", handleLoad);
    }
  }, [isLoaded]);

  // 3. Store the country code in a ref to use during initial mount without triggering the useEffect dependency warning
  const countryCodeRef = useRef(countryCode);
  useEffect(() => {
    countryCodeRef.current = countryCode;
  }, [countryCode]);

  // Initialize Autocomplete
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    // 4. Remove 'any' and use standard Google Maps types
    const options: google.maps.places.AutocompleteOptions = {
      fields: ["address_components", "formatted_address", "name"],
      types: ["address"],
    };

    const initialCountryCode = countryCodeRef.current;
    if (initialCountryCode && initialCountryCode.trim().length > 0) {
      options.componentRestrictions = { country: initialCountryCode.toLowerCase() };
    }

    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
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

        if (types.includes("locality")) {
          city = component.long_name;
        } else if (!city && types.includes("sublocality_level_1")) {
          city = component.long_name;
        } else if (!city && types.includes("administrative_area_level_2")) {
          city = component.long_name;
        }

        if (types.includes("administrative_area_level_1")) stateProvince = component.long_name;
        if (types.includes("postal_code")) postalCode = component.long_name;
        if (types.includes("country")) {
          country = component.long_name;
          returnedCountryCode = component.short_name;
        }
      }

      onAddressSelectRef.current({
        streetAddress: streetNumber || route ? `${streetNumber} ${route}`.trim() : (place.name || ""),
        city,
        stateProvince,
        postalCode,
        country,
        countryCode: returnedCountryCode,
      });
    });

    return () => {
      if (window.google?.maps?.event && listener) {
        window.google.maps.event.removeListener(listener);
      }
      document.querySelectorAll(".pac-container").forEach((node) => node.remove());
    };
  }, [isLoaded, inputRef]); // 'countryCode' is removed from deps because we read it safely via countryCodeRef

  // Handle dynamic country updates
  useEffect(() => {
    if (autocompleteRef.current) {
      if (countryCode && countryCode.trim().length > 0) {
        autocompleteRef.current.setComponentRestrictions({ country: countryCode.toLowerCase() });
      } else {
        // 5. Remove 'null as any' - passing null natively clears restrictions
        autocompleteRef.current.setComponentRestrictions(null);
      }
    }
  }, [countryCode]);

  return { isLoaded };
}