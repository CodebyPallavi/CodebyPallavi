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
    <section className="py-20 bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, index) => {
            const Icon = iconMap[stat.icon];
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-zinc-950 p-6 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {Icon && <Icon size={24} />}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{stat.title}</h3>
                <p className="text-gray-400">{stat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
