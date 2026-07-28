import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';

const navLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const location = useLocation();
const isHome = location.pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount);
const openCart = useCartStore((s) => s.open);


  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[999] h-[60px] lg:h-[72px] flex items-center justify-between px-4 sm:px-6 lg:px-12 transition-all duration-[400ms] ${
          (scrolled || !isHome)
            ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)]'
            : 'bg-transparent'
        }`}
      >
        <Link
  to="/"
  className="z-10"
  onClick={() => setMobileOpen(false)}
>
  <span
    className={`font-display text-2xl tracking-wider transition-colors duration-[400ms] ${
      (scrolled || !isHome) ? 'text-rich-black' : 'text-white'
    }`}
  >
    SELA
  </span>
</Link>

        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
            key={link.label}
            to={link.href}
              className={`font-body text-sm font-medium uppercase tracking-[0.05em] transition-colors duration-300 hover:text-gold ${
                (scrolled || !isHome)
                 ? 'text-rich-black' 
                 : 'text-white'
              }`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className={`transition-colors duration-300 hover:text-gold ${(scrolled || !isHome) ? 'text-rich-black' : 'text-white'}`}>
            <Search size={20} />
          </button>
          <button
            onClick={openCart}
            className={`relative transition-colors duration-300 hover:text-gold ${(scrolled || !isHome) ? 'text-rich-black' : 'text-white'}`}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] bg-gold text-white text-[11px] font-body font-medium rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen(true)} className={`lg:hidden transition-colors duration-300 ${(scrolled || !isHome) ? 'text-rich-black' : 'text-white'}`}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 z-[1000] bg-white transition-transform duration-[400ms] ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 sm:px-6 h-[60px]">
          <Link
  to="/"
  onClick={() => setMobileOpen(false)}
  className="font-display text-2xl tracking-wider text-rich-black"
>
  SELA
</Link>
          <button onClick={() => setMobileOpen(false)} className="text-rich-black"><X size={24} /></button>
        </div>
        <div className="flex flex-col items-center justify-center gap-6 pt-16">
          {navLinks.map((link, i) => (
            <Link
             key={link.label}
              to={link.href}
               onClick={() => setMobileOpen(false)}
              className="font-display text-[32px] font-normal text-rich-black"
              style={{
                 animation: `fadeIn 0.4s ease ${i * 0.1}s forwards`,
                  opacity: 0,
               }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  );
}
