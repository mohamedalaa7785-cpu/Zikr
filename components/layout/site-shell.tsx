import { Footer } from './footer';
import { Navbar } from './navbar';

export function SiteShell({ children }: { children: React.ReactNode }) {
  return <div className='min-h-screen'><Navbar /><main>{children}</main><Footer /></div>;
}
