'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Car, User, LogIn, X, Menu } from 'lucide-react';
import { logout, selectAuth } from '../../store/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Button } from './Button';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(selectAuth);

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  const navItems = [
    { name: 'Home', path: '/', icon: null },
    { name: 'Book Ride', path: '/booking', icon: Car }, // ✅ ใส่ / นำหน้า
    { name: 'Dashboard', path: '/dashboard', icon: User },
  ];

  const handleSignOut = () => {
    dispatch(logout());
    setIsOpen(false);
    router.push('/');
  };

  return (
    <nav className="bg-card shadow-card sticky top-0 z-50 border-a">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-hero p-2 rounded-lg shadow-glow grid place-items-center">
                <Car className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-transport-blue">
                Transport systems
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={cx(
                    'px-3 py-2 rounded-md text-sm font-medium transition-smooth',
                    isActive(item.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    {Icon ? <Icon className="h-4 w-4" /> : null}
                    {item.name}
                  </span>
                </Link>
              );
            })}

            <div className="flex items-center space-x-2">
              {/* ✅ ถ้ายังไม่ล็อกอิน: แสดง Sign In + Sign Up */}
              {!isAuthenticated ? (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/login" className="cursor-pointer">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                  </Button>

                  <Button
                    size="sm"
                    className="bg-gradient-accent shadow-elegant cursor-pointer"
                    asChild
                  >
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              ) : (
                // ✅ ล็อกอินแล้ว: ซ่อน Sign In และแสดง Sign Out แทน
                <Button
                  size="sm"
                  className="bg-gradient-accent shadow-elegant cursor-pointer"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen((v) => !v)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={cx(
                      'block px-3 py-2 rounded-md text-base font-medium transition-smooth',
                      isActive(item.path)
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="inline-flex items-center gap-2">
                      {Icon ? <Icon className="h-4 w-4" /> : null}
                      {item.name}
                    </span>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-border space-y-2">
                {!isAuthenticated ? (
                  <>
                    <Button variant="outline" className="w-full cursor-pointer" asChild>
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Link>
                    </Button>

                    <Button
                      className="w-full bg-gradient-accent shadow-elegant cursor-pointer"
                      asChild
                    >
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full bg-gradient-accent shadow-elegant cursor-pointer"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
