import React from 'react';
import { TRAINERS } from '../constants';
import { motion } from 'framer-motion';
import { Instagram, Twitter, Linkedin } from 'lucide-react';

const Trainers = () => {
  return (
    <section id="trainers" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-heading font-bold text-white mb-4"
          >
            EXPERT <span className="text-primary">TRAINERS</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Our team of certified professionals dedicated to guiding you on your fitness journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRAINERS.map((trainer, index) => (
            <motion.div
              key={trainer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-zinc-900 rounded-xl overflow-hidden group hover:-translate-y-2 transition-transform duration-300 border border-white/5"
            >
              <div className="relative overflow-hidden h-80">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <a href="#" aria-label="Instagram" className="bg-white text-black p-2 rounded-full hover:bg-primary hover:text-white transition-colors"><Instagram size={18} /></a>
                  <a href="#" aria-label="Twitter" className="bg-white text-black p-2 rounded-full hover:bg-primary hover:text-white transition-colors"><Twitter size={18} /></a>
                  <a href="#" aria-label="LinkedIn" className="bg-white text-black p-2 rounded-full hover:bg-primary hover:text-white transition-colors"><Linkedin size={18} /></a>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-heading font-bold text-white mb-1 uppercase tracking-wide">{trainer.name}</h3>
                <p className="text-primary font-bold text-sm mb-2 uppercase tracking-widest">{trainer.specialty}</p>
                <p className="text-gray-500 text-xs font-medium">{trainer.experience} Experience</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trainers;
