"use client";

import { RefObject, useEffect, useRef, useState } from "react";

export function useGooglePlacesAutocomplete(
  inputRef: RefObject<HTMLInputElement | null>,
  countryCode: string | undefined | null,
  onAddressSelect: (details: any) => void,
) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setLoadError(new Error("Google Maps API key is missing."));
      return;
    }

    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    (window as any).initGooglePlaces = () => {
      setIsLoaded(true);
    };

    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]',
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&callback=initGooglePlaces`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      setLoadError(new Error("Google Maps script failed to load."));
    };

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || loadError) return;

    try {
      autocompleteRef.current = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          fields: ["address_components", "geometry"],
          componentRestrictions: countryCode
            ? { country: countryCode.toLowerCase() }
            : undefined,
        },
      );

      const listener = autocompleteRef.current.addListener(
        "place_changed",
        () => {
          const place = autocompleteRef.current?.getPlace();

          if (!place || !place.address_components) return;

          let streetNumber = "";
          let route = "";
          let city = "";
          let stateProvince = "";
          let postalCode = "";
          let selectedCountryCode = "";

          for (const component of place.address_components) {
            const types = component.types;
            if (types.includes("street_number"))
              streetNumber = component.long_name;
            if (types.includes("route")) route = component.long_name;
            if (types.includes("locality") || types.includes("postal_town"))
              city = component.long_name;
            if (types.includes("administrative_area_level_1"))
              stateProvince = component.short_name;
            if (types.includes("postal_code")) postalCode = component.long_name;
            if (types.includes("country"))
              selectedCountryCode = component.short_name;
          }

          onAddressSelect({
            streetAddress: `${streetNumber} ${route}`.trim(),
            city,
            stateProvince,
            postalCode,
            countryCode: selectedCountryCode,
          });
        },
      );

      return () => {
        if (listener) {
          google.maps.event.removeListener(listener);
        }
      };
    } catch (err) {
      console.warn(
        "Google Places Autocomplete failed to initialize. Falling back to manual entry.",
        err,
      );
      setLoadError(
        err instanceof Error ? err : new Error("Unknown initialization error"),
      );
    }
  }, [isLoaded, inputRef, loadError]);

  useEffect(() => {
    try {
      if (autocompleteRef.current && countryCode) {
        autocompleteRef.current.setComponentRestrictions({
          country: countryCode.toLowerCase(),
        });
      }
    } catch (err) {
      console.warn("Failed to update component restrictions", err);
    }
  }, [countryCode]);

  return { isLoaded, loadError };
}
