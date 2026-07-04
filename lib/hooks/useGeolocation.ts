'use client';

import { useCallback, useEffect, useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface UseGeolocationReturn {
  coordinates: Coordinates | null;
  loading: boolean;
  error: Error | null;
  requestLocation: () => void;
  clearLocation: () => void;
}

export function useGeolocation(): UseGeolocationReturn {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError(new Error('Geolocation not supported'));
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.watchPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (err) => {
        setError(new Error(err.message));
        setLoading(false);
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  }, []);

  const clearLocation = useCallback(() => {
    setCoordinates(null);
    setError(null);
  }, []);

  return {
    coordinates,
    loading,
    error,
    requestLocation,
    clearLocation,
  };
}
