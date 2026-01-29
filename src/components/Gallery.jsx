import React from 'react';
import { GALLERY_IMAGES } from '../constants';
import { motion } from 'framer-motion';

const Gallery = () => {
  return (
    <section id="gallery" className="py-24 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
              GYM <span className="text-primary">GALLERY</span>
            </h2>
            <p className="text-gray-400 max-w-xl">
              Witness the energy, equipment, and environment that awaits you.
            </p>
          </motion.div>

          <motion.a
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             href="#contact"
             className="text-white hover:text-primary transition-colors font-bold uppercase tracking-wider text-sm flex items-center gap-2 group"
          >
            Follow on Instagram <span className="block h-px w-8 bg-primary group-hover:w-12 transition-all" />
          </motion.a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {GALLERY_IMAGES.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`relative overflow-hidden rounded-xl bg-zinc-800 ${
                index % 5 === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
