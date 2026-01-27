import React from 'react';
import { CONTACT_INFO, NAV_LINKS } from '../constants';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Desc */}
          <div>
            <a href="#" className="text-3xl font-bold italic tracking-tighter text-primary block mb-6">
              ADIYASH<span className="text-white">GYM</span>
            </a>
            <p className="text-gray-400 mb-6">
              Empowering you to reach your fitness potential with expert guidance and premium facilities.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-zinc-800 p-2 rounded-full hover:bg-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-zinc-800 p-2 rounded-full hover:bg-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-zinc-800 p-2 rounded-full hover:bg-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <MapPin className="flex-shrink-0 text-primary" size={20} />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="flex-shrink-0 text-primary" size={20} />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-white transition-colors">{CONTACT_INFO.phone}</a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="flex-shrink-0 text-primary" size={20} />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">{CONTACT_INFO.email}</a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Opening Hours</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400">
                <Clock className="flex-shrink-0 text-primary" size={20} />
                <span>{CONTACT_INFO.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Adiyash Gym. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
