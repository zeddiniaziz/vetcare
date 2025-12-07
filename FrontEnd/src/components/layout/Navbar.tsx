import { Link, useLocation } from 'react-router-dom';
import { PawPrint, Calendar, Users, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/pets', label: 'Pets', icon: PawPrint },
  { path: '/owners', label: 'Owners', icon: Users },
  { path: '/appointments', label: 'Appointments', icon: Calendar },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-14 w-10 items-center justify-center">
            <img src="/public/Brand.png" alt="VetCare" className="h-full w-full" />
          </div>
          <span className="text-xl font-bold text-foreground">VetCare</span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
