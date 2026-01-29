import React from 'react';
import { Target, Flame, TrendingUp, Trophy } from 'lucide-react';
import { STATS } from '../constants';
import { motion } from 'framer-motion';

const iconMap = {
  Target: Target,
  Flame: Flame,
  TrendingUp: TrendingUp,
  Trophy: Trophy,
};

const Stats = () => {
  return (
    <section className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(225,29,72,0.1),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, index) => {
            const Icon = iconMap[stat.icon];
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-white/5 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-zinc-800 rounded-lg flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-lg">
                  {Icon && <Icon size={28} />}
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3 uppercase tracking-wide">{stat.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{stat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
