import React from 'react';
import { BRANCHES } from '../constants';
import { motion } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';

const Branches = () => {
  return (
    <section className="py-20 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-white mb-4"
          >
            OUR <span className="text-primary">LOCATIONS</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
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
              className="bg-zinc-950 p-6 rounded-xl border border-white/5 hover:border-primary/50 transition-colors"
            >
              <h3 className="text-xl font-bold text-white mb-2">{branch.name}</h3>
              <p className="text-gray-400 mb-4 flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                {branch.area}
              </p>
              <a href={`tel:${branch.phone}`} className="flex items-center gap-2 text-primary hover:text-white transition-colors">
                <Phone size={16} />
                <span className="font-semibold">{branch.phone}</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Branches;
