import React from 'react';
import { CONTACT_INFO, NAV_LINKS } from '../constants';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-zinc-950 border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Desc */}
          <div>
            <a href="#" className="text-3xl font-heading font-bold italic tracking-tighter text-white block mb-6">
              ADIYASH<span className="text-primary">GYM</span>
            </a>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Empowering you to reach your fitness potential with expert guidance, premium facilities, and a supportive community.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="bg-zinc-900 p-3 rounded-lg text-white hover:bg-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" aria-label="Facebook" className="bg-zinc-900 p-3 rounded-lg text-white hover:bg-primary transition-colors"><Facebook size={20} /></a>
              <a href="#" aria-label="Twitter" className="bg-zinc-900 p-3 rounded-lg text-white hover:bg-primary transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-6 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-6 uppercase tracking-wide">Contact Us</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-gray-400 group">
                <MapPin className="flex-shrink-0 text-primary mt-1 group-hover:text-white transition-colors" size={20} />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-4 text-gray-400 group">
                <Phone className="flex-shrink-0 text-primary group-hover:text-white transition-colors" size={20} />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-white transition-colors">{CONTACT_INFO.phone}</a>
              </li>
              <li className="flex items-center gap-4 text-gray-400 group">
                <Mail className="flex-shrink-0 text-primary group-hover:text-white transition-colors" size={20} />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">{CONTACT_INFO.email}</a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-6 uppercase tracking-wide">Opening Hours</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 text-gray-400">
                <Clock className="flex-shrink-0 text-primary mt-1" size={20} />
                <div>
                   <span className="block text-white font-bold mb-1">Mon - Sun</span>
                   <span>5:00 AM - 11:00 PM</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Adiyash Gym. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
