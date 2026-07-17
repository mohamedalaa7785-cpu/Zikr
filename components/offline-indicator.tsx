'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    // Handle online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      // Hide indicator after 3 seconds
      const timer = setTimeout(() => setShowIndicator(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Don't show indicator if online and hasn't shown yet
  if (isOnline && !showIndicator) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isOnline
          ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
          : 'bg-gradient-to-r from-red-600 to-orange-600'
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        {isOnline ? (
          <>
            <Wifi className="h-5 w-5 text-white flex-shrink-0" />
            <span className="text-white font-medium text-sm">
              متصل بالإنترنت - يتم مزامنة البيانات
            </span>
          </>
        ) : (
          <>
            <WifiOff className="h-5 w-5 text-white flex-shrink-0 animate-pulse" />
            <span className="text-white font-medium text-sm">
              أنت غير متصل بالإنترنت - يعمل الموقع بدون اتصال
            </span>
            <AlertCircle className="h-4 w-4 text-white ml-auto flex-shrink-0" />
          </>
        )}
      </div>
    </div>
  );
}
