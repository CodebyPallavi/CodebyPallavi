import React, { useState } from 'react';
import { Menu, X, Phone, Instagram, Facebook } from 'lucide-react';
import { NAV_LINKS, CONTACT } from '../constants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a href="#" className="text-3xl font-bold italic tracking-tighter text-primary">
              ADIYASH<span className="text-white">GYM</span>
            </a>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-300 hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wider"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
             <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 text-white bg-primary hover:bg-red-700 px-4 py-2 rounded-full transition-colors">
                <Phone size={18} />
                <span className="font-semibold">Join Now</span>
             </a>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.label}
              </a>
            ))}
             <a
                href={`tel:${CONTACT.phone}`}
                className="mt-4 flex items-center justify-center gap-2 w-full text-white bg-primary px-4 py-3 rounded-md font-semibold"
             >
                <Phone size={18} /> Call Now
             </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
