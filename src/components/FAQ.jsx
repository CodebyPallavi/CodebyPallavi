import React, { useState } from 'react';
import { FAQ_DATA } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-heading font-bold text-white mb-4"
          >
            <span className="text-primary">FAQ</span>s
          </motion.h2>
          <p className="text-gray-400 text-lg">
            Common questions about our gym and services.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`bg-zinc-900/50 border ${activeIndex === index ? 'border-primary/50' : 'border-white/5'} rounded-xl overflow-hidden transition-colors`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                aria-expanded={activeIndex === index}
              >
                <span className={`text-lg font-heading font-bold pr-4 ${activeIndex === index ? 'text-white' : 'text-gray-300'}`}>
                  {item.question}
                </span>
                <span className={`flex-shrink-0 transition-colors ${activeIndex === index ? 'text-primary' : 'text-gray-500'}`}>
                  {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
