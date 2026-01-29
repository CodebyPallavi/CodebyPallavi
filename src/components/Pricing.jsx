import React from 'react';
import { PRICING } from '../constants';
import { motion } from 'framer-motion';
import { Check, Crown, ArrowRight } from 'lucide-react';

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-zinc-950 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.05),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-heading font-bold text-white mb-4"
          >
            MEMBERSHIP <span className="text-primary">PLANS</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Invest in your body with our flexible and affordable membership tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {PRICING.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative flex flex-col p-8 rounded-2xl transition-all duration-300 ${
                plan.popular
                  ? 'bg-zinc-900 border-2 border-primary scale-105 shadow-2xl shadow-primary/20 z-10'
                  : 'bg-zinc-900/40 border border-white/5 hover:border-white/20 hover:bg-zinc-900'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                   <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                     <Crown size={14} fill="currentColor" /> Most Popular
                   </span>
                </div>
              )}
              {plan.badge && !plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
                   <span className="bg-yellow-500 text-black text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                     <Crown size={14} fill="currentColor" /> {plan.badge}
                   </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-heading font-bold text-gray-400 uppercase tracking-widest mb-4">{plan.tier}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-heading font-bold text-white">₹{plan.price}</span>
                  <span className="text-gray-500 font-medium text-sm">/{plan.period.replace('per ', '')}</span>
                </div>
              </div>

              <div className="w-full h-px bg-white/10 mb-8" />

              <ul className="flex-1 space-y-5 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                    <div className="bg-primary/10 p-1 rounded-full text-primary mt-0.5">
                       <Check size={14} strokeWidth={3} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all focus-ring ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                Choose Plan <ArrowRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
