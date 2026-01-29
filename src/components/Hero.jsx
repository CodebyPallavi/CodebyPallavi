import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Optimized Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80"
          alt="Modern gym interior with weights"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "outCirc" }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="h-[2px] w-12 bg-primary"></span>
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm md:text-base">
                Welcome to Adiyash Gym
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-white mb-6 leading-[0.9]">
              SCULPT YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-600">
                PERFECT BODY
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl font-light leading-relaxed">
              Join the elite fitness community in Mumbai. Experience state-of-the-art equipment,
              expert trainers, and a motivating atmosphere designed to help you crush your goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#programs"
                className="group px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-none skew-x-[-10deg] transition-all flex items-center justify-center gap-2 focus-ring"
              >
                <span className="skew-x-[10deg] flex items-center gap-2">
                  Explore Programs
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </span>
              </a>
              <a
                href="#contact"
                className="group px-8 py-4 border border-white hover:bg-white hover:text-black text-white font-bold rounded-none skew-x-[-10deg] transition-all text-center focus-ring"
              >
                <span className="skew-x-[10deg] block">
                  Book Free Trial
                </span>
              </a>
            </div>
          </motion.div>

          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8"
          >
            <div>
              <h3 className="text-3xl font-heading font-bold text-white">500+</h3>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Members</p>
            </div>
            <div>
              <h3 className="text-3xl font-heading font-bold text-white">50+</h3>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Equipment</p>
            </div>
             <div>
              <h3 className="text-3xl font-heading font-bold text-white">10+</h3>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Trainers</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
