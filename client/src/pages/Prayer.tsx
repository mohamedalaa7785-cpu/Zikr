import { useState, useEffect } from 'react';
import { Clock, MapPin, Compass, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PrayerTime {
  name: string;
  nameAr: string;
  time: string;
  icon: React.ReactNode;
}

interface PrayerData {
  location: string;
  date: string;
  prayerTimes: PrayerTime[];
  nextPrayer: { name: string; timeRemaining: string };
  qiblaDirection: number;
}

export default function PrayerPage() {
  const [location, setLocation] = useState('Cairo, Egypt');
  const [prayerData, setPrayerData] = useState<PrayerData | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock prayer times data
  const mockPrayerData: PrayerData = {
    location: 'Cairo, Egypt',
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    prayerTimes: [
      { name: 'Fajr', nameAr: 'الفجر', time: '04:45', icon: <Sun className="w-6 h-6" /> },
      { name: 'Dhuhr', nameAr: 'الظهر', time: '12:15', icon: <Sun className="w-6 h-6" /> },
      { name: 'Asr', nameAr: 'العصر', time: '15:45', icon: <Sun className="w-6 h-6" /> },
      { name: 'Maghrib', nameAr: 'المغرب', time: '18:30', icon: <Moon className="w-6 h-6" /> },
      { name: 'Isha', nameAr: 'العشاء', time: '20:00', icon: <Moon className="w-6 h-6" /> },
    ],
    nextPrayer: { name: 'Asr', timeRemaining: '2h 15m' },
    qiblaDirection: 137, // Degrees from North
  };

  useEffect(() => {
    setPrayerData(mockPrayerData);
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Fallback if location access is denied
          console.log('Location access denied');
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-slate-700/50 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-emerald-500/5" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
              أوقات الصلاة
            </h1>
          </div>
          <p className="text-slate-300 text-lg">Prayer Times - Stay Connected to Your Faith</p>
        </div>
      </div>

      {/* Location Input */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <Input
              placeholder="Enter your location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-500"
            />
          </div>
          <Button className="bg-amber-600 hover:bg-amber-700">Search</Button>
        </div>
      </div>

      {prayerData && (
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8 space-y-8">
          {/* Next Prayer Countdown */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900/20 to-emerald-900/20 p-8 border border-amber-400/30">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-emerald-500/5" />
            <div className="relative text-center">
              <p className="text-slate-400 mb-2">Next Prayer</p>
              <h2 className="text-5xl font-bold text-amber-400 mb-4">{prayerData.nextPrayer.name}</h2>
              <p className="text-2xl text-emerald-400 font-semibold">{prayerData.nextPrayer.timeRemaining}</p>
            </div>
          </div>

          {/* Prayer Times Grid */}
          <div>
            <h3 className="text-2xl font-bold mb-6 text-amber-400">Today's Prayer Times</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {prayerData.prayerTimes.map((prayer, idx) => (
                <div
                  key={idx}
                  className="rounded-lg bg-slate-800/30 p-6 border border-slate-700/50 hover:border-amber-400/50 transition-all duration-300 text-center"
                >
                  <div className="flex justify-center mb-3 text-amber-400">
                    {prayer.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-1">{prayer.name}</h4>
                  <p className="text-sm text-slate-400 mb-3">{prayer.nameAr}</p>
                  <p className="text-2xl font-bold text-emerald-400">{prayer.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Qibla Direction */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 border border-slate-700/50">
            <h3 className="text-2xl font-bold mb-6 text-emerald-400 flex items-center gap-2">
              <Compass className="w-6 h-6" />
              Qibla Direction
            </h3>
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="relative w-64 h-64 mx-auto">
                  {/* Compass Circle */}
                  <div className="absolute inset-0 rounded-full border-4 border-slate-600 bg-slate-900/50" />
                  
                  {/* Cardinal Directions */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="absolute top-4 text-amber-400 font-bold">N</div>
                    <div className="absolute right-4 text-slate-400">E</div>
                    <div className="absolute bottom-4 text-slate-400">S</div>
                    <div className="absolute left-4 text-slate-400">W</div>
                  </div>

                  {/* Qibla Arrow */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: `rotate(${prayerData.qiblaDirection}deg)`,
                    }}
                  >
                    <div className="w-2 h-24 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-full" />
                  </div>

                  {/* Center Circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Qibla Direction</p>
                  <p className="text-3xl font-bold text-emerald-400">{prayerData.qiblaDirection}°</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">From North</p>
                  <p className="text-lg text-white">Southeast</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Your Location</p>
                  <p className="text-lg text-white">{location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prayer Reminders */}
          <div className="rounded-lg bg-slate-800/30 p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold mb-4 text-amber-400">Prayer Reminders</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <span className="text-slate-300">Enable notifications for prayer times</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <span className="text-slate-300">Notify 5 minutes before each prayer</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" />
                <span className="text-slate-300">Show Qibla direction reminder</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
