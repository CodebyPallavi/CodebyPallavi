import React from 'react';
import { TESTIMONIALS } from '../constants';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  return (
    <section className="py-24 bg-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-heading font-bold text-white mb-4"
          >
            MEMBER <span className="text-primary">STORIES</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Real results from real people who achieved their goals at Adiyash Gym.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-zinc-950 p-8 rounded-2xl border border-white/5 relative hover:border-primary/30 transition-colors group"
            >
              <div className="absolute top-6 right-6 text-zinc-800 group-hover:text-primary/20 transition-colors">
                 <Quote size={64} />
              </div>

              <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="text-white font-heading font-bold text-lg">{testimonial.name}</h4>
                      <p className="text-primary text-xs font-bold uppercase tracking-wider">{testimonial.duration}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-6 text-yellow-500">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-gray-300 italic leading-relaxed text-sm">
                    &quot;{testimonial.review}&quot;
                  </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
