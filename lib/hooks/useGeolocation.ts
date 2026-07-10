'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

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

function messageForError(err: GeolocationPositionError): string {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return 'تم رفض إذن الموقع. فعّل الوصول للموقع من إعدادات المتصفح لعرض مواقيت الصلاة بدقة.';
    case err.POSITION_UNAVAILABLE:
      return 'تعذّر تحديد موقعك حاليًا. تأكد من تفعيل خدمة الموقع (GPS).';
    case err.TIMEOUT:
      return 'انتهت مهلة تحديد الموقع. حاول مرة أخرى.';
    default:
      return err.message || 'حدث خطأ أثناء تحديد الموقع.';
  }
}

export function useGeolocation(): UseGeolocationReturn {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError(new Error('المتصفح لا يدعم تحديد الموقع.'));
      return;
    }

    // Clear any previous watcher before starting a new one
    stopWatching();

    setLoading(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
      },
      (err) => {
        setError(new Error(messageForError(err)));
        setLoading(false);
        stopWatching();
      },
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 20000 }
    );
  }, [stopWatching]);

  const clearLocation = useCallback(() => {
    stopWatching();
    setCoordinates(null);
    setError(null);
  }, [stopWatching]);

  // Clean up the watcher when the component using this hook unmounts
  useEffect(() => stopWatching, [stopWatching]);

  return {
    coordinates,
    loading,
    error,
    requestLocation,
    clearLocation,
  };
}
