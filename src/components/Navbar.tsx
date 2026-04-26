'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ displayName: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('nutrilens_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('nutrilens_token');
    localStorage.removeItem('nutrilens_user');
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'วิเคราะห์อาหาร', href: '/analyze' },
    { name: 'แดชบอร์ด', href: '/dashboard' },
    { name: 'ประวัติ', href: '/history' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0 shadow-sm bg-white/80 backdrop-blur-md">
      <div className="container-app flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 no-underline group">
          <span className="text-2xl group-hover:rotate-12 transition-transform">🍃</span>
          <span className="text-xl font-bold text-health-green-dark tracking-tight">
            NutriLens<span className="text-health-green"> AI</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline ${
                pathname === link.href 
                  ? 'text-health-green bg-health-green-light/30' 
                  : 'text-health-text hover:bg-health-green-light/20'
              }`}
            >
              {link.name}
            </a>
          ))}
          
          <div className="h-6 w-px bg-health-border mx-2" />

          {user ? (
            <div className="flex items-center gap-3 ml-2">
              <div className="flex items-center gap-2 py-1.5 px-3 rounded-full bg-health-bg border border-health-border">
                <div className="w-6 h-6 rounded-full bg-health-green text-white flex items-center justify-center text-[10px]">
                  <User className="w-3 h-3" />
                </div>
                <span className="text-sm font-semibold text-health-dark">{user.displayName}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-health-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="ออกจากระบบ"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <a 
              href="/login" 
              className="btn-primary py-2 px-6 ml-2 no-underline text-sm shadow-sm hover:shadow-md transition-all h-auto"
            >
              เข้าสู่ระบบ
            </a>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-health-text"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-card rounded-none border-x-0 border-b-0 p-4 space-y-2 fade-in">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block px-4 py-3 rounded-xl text-health-text no-underline hover:bg-health-bg"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          {user ? (
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50"
            >
              ออกจากระบบ ({user.displayName})
            </button>
          ) : (
            <a 
              href="/login" 
              className="block px-4 py-3 rounded-xl bg-health-green text-white text-center no-underline font-bold"
              onClick={() => setIsMenuOpen(false)}
            >
              เข้าสู่ระบบ
            </a>
          )}
        </div>
      )}
    </nav>
  );
}
