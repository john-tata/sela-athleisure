import React from 'react';

const shopLinks = [
  { label: 'Shop All', href: '/shop' },
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Collections', href: '/collections' },
  { label: 'About SELA', href: '/about' },
];

const customerCare = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Shipping Info', href: '/shipping' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Track Order', href: '/track-order' },
];

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/selaathleisure',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.333.014 8.741 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/2349060366423',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.017 24c-6.624 0-11.99-5.367-11.99-11.988C.027 5.39 5.393.024 12.017.024c6.624 0 11.99 5.366 11.99 11.988 0 6.62-5.366 11.988-11.99 11.988zm0-21.998c-5.51 0-9.99 4.484-9.99 9.986 0 1.767.462 3.484 1.34 4.999L2 22.023l4.882-1.283c1.456.797 3.096 1.216 4.766 1.216h.005c5.51 0 9.99-4.484 9.99-9.986 0-2.666-1.038-5.174-2.925-7.062A9.928 9.928 0 0012.017 2.002z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@sela_athleisure',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
];

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-neutral-950 text-white">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Column 1: Brand Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold tracking-tight">
                SELA
              </span>
            </a>

            <p className="text-neutral-400 text-sm leading-relaxed mb-6 max-w-xs">
              Premium athleisure designed for people who move. Crafted with
              intention, worn with confidence.
            </p>

            {/* Payment Icons */}
            <div className="flex items-center gap-3 text-neutral-500">
              <svg className="w-8 h-5" viewBox="0 0 48 32" fill="currentColor">
                <rect width="48" height="32" rx="4" fillOpacity="0.1" />
                <text
                  x="24"
                  y="21"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="currentColor"
                >
                  VISA
                </text>
              </svg>

              <svg className="w-8 h-5" viewBox="0 0 48 32" fill="currentColor">
                <rect width="48" height="32" rx="4" fillOpacity="0.1" />
                <text
                  x="24"
                  y="21"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="currentColor"
                >
                  MC
                </text>
              </svg>

              <svg className="w-8 h-5" viewBox="0 0 48 32" fill="currentColor">
                <rect width="48" height="32" rx="4" fillOpacity="0.1" />
                <text
                  x="24"
                  y="21"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="currentColor"
                >
                  Amex
                </text>
              </svg>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-6">
              Shop
            </h3>

            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-6">
              Customer Care
            </h3>

            <ul className="space-y-3">
              {customerCare.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social & Contact */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-6">
              Follow Us
            </h3>

            <div className="flex items-center gap-3 mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 text-neutral-400 hover:bg-white hover:text-black transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="space-y-2 text-sm text-neutral-400">
              <p>support@selaathleisure.com</p>
              <p>0906 036 6423</p>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} TataTechSolutions. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-xs text-neutral-500">
            <a
              href="/privacy"
              className="hover:text-neutral-300 transition-colors duration-300"
            >
              Privacy Policy
            </a>

            <a
              href="/terms"
              className="hover:text-neutral-300 transition-colors duration-300"
            >
              Terms of Service
            </a>

            <a
              href="/cookies"
              className="hover:text-neutral-300 transition-colors duration-300"
            >
              Cookie Policy
            </a>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;