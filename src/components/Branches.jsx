import React from 'react';
import { BRANCHES } from '../constants';
import { motion } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';

const Branches = () => {
  return (
    <section className="py-24 bg-zinc-900 relative">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(225,29,72,0.05),transparent_60%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-heading font-bold text-white mb-4"
          >
            OUR <span className="text-primary">LOCATIONS</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Find the nearest Adiyash Gym branch and start your workout today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BRANCHES.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-zinc-950 p-8 rounded-xl border border-white/5 hover:border-primary/50 transition-all group hover:-translate-y-1"
            >
              <h3 className="text-2xl font-heading font-bold text-white mb-3 group-hover:text-primary transition-colors">{branch.name}</h3>
              <p className="text-gray-400 mb-6 flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                {branch.area}
              </p>
              <a href={`tel:${branch.phone}`} className="inline-flex items-center gap-2 text-white bg-zinc-900 hover:bg-primary px-4 py-2 rounded-lg transition-colors text-sm font-bold uppercase tracking-wider">
                <Phone size={16} />
                <span>{branch.phone}</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Branches;
