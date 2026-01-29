import React, { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { NAV_LINKS, CONTACT } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isOpen ? 'bg-zinc-950/90 backdrop-blur-md border-b border-white/5 py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="text-2xl md:text-3xl font-heading font-bold italic tracking-tighter text-white group">
              ADIYASH<span className="text-primary group-hover:text-primary-hover transition-colors">GYM</span>
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative text-gray-300 hover:text-white px-3 py-2 text-sm font-medium uppercase tracking-wider transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
             <a
               href={`tel:${CONTACT.phone}`}
               className="flex items-center gap-2 text-white bg-primary hover:bg-primary-hover px-6 py-2 rounded-none -skew-x-12 font-bold uppercase text-sm tracking-wide transition-colors focus-ring"
             >
                <span className="skew-x-12 flex items-center gap-2">
                  <Phone size={16} /> Join Now
                </span>
             </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-zinc-950 border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
               <a
                  href={`tel:${CONTACT.phone}`}
                  className="mt-4 flex items-center justify-center gap-2 w-full text-white bg-primary hover:bg-primary-hover px-4 py-3 rounded-lg font-bold uppercase tracking-wide transition-colors"
               >
                  <Phone size={18} /> Call Now
               </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
