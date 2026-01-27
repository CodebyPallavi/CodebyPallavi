import React from 'react';
import { Zap, Dumbbell, Swords, Heart, Users } from 'lucide-react';
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
    <section id="programs" className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-white mb-4"
          >
            OUR <span className="text-primary">PROGRAMS</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose from our diverse range of training programs designed to help you achieve specific fitness goals.
          </p>
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
                className="group relative overflow-hidden rounded-2xl h-80"
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${program.image})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4 text-white">
                    {Icon && <Icon size={24} />}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{program.title}</h3>
                  <p className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {program.description}
                  </p>
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
