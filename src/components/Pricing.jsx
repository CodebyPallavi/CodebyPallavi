import React from 'react';
import { PRICING } from '../constants';
import { motion } from 'framer-motion';
import { Check, Crown } from 'lucide-react';

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-white mb-4"
          >
            MEMBERSHIP <span className="text-primary">PLANS</span>
          </motion.h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose the best package that fits your needs and budget.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`relative flex flex-col p-8 rounded-2xl ${
                plan.popular
                  ? 'bg-zinc-900 border-2 border-primary scale-105 shadow-2xl shadow-primary/20 z-10'
                  : 'bg-zinc-900/50 border border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  Most Popular
                </div>
              )}
              {plan.badge && (
                <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                  <Crown size={12} /> {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-300 uppercase tracking-widest mb-4">{plan.tier}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-extrabold text-white">₹{plan.price}</span>
                  <span className="text-gray-500 font-medium">/{plan.period}</span>
                </div>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                    <Check className="text-primary flex-shrink-0" size={18} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
                  plan.popular
                    ? 'bg-primary text-white hover:bg-red-700'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                Choose {plan.tier}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
