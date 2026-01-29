import React from 'react';
import { Zap, Dumbbell, Swords, Heart, Users, ArrowRight } from 'lucide-react';
import { PROGRAMS } from '../constants';
import { motion } from 'framer-motion';

const iconMap = {
  Zap: Zap,
  Dumbbell: Dumbbell,
  Swords: Swords,
  Heart: Heart,
  Users: Users,
};

const Programs = () => {
  return (
    <section id="programs" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
              OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-600">PROGRAMS</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Expertly designed training programs to help you push your limits and achieve your fitness goals.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((program, index) => {
             const Icon = iconMap[program.icon];
             return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl h-[400px] border border-white/5 cursor-pointer"
              >
                <img
                  src={program.image}
                  alt={program.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 transition-transform">
                    {Icon && <Icon size={24} />}
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-white mb-3 italic">{program.title}</h3>
                  <p className="text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform translate-y-2 group-hover:translate-y-0">
                    {program.description}
                  </p>
                  <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                    Learn More <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
             );
          })}
        </div>
      </div>
    </section>
  );
};

export default Programs;
