import { Footer } from './footer';
import { Navbar } from './navbar';
import { PrayerAlertProvider } from './prayer-alert-provider';
import { InstallPrompt } from './install-prompt';

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
      <Footer />
      {/* Single mount point for prayer alerts + salawat reminders */}
      <PrayerAlertProvider />
      {/* PWA "add to home screen" invitation */}
      <InstallPrompt />
    </div>
  );
}
