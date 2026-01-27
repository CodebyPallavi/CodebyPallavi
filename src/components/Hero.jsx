import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <div id="home" className="relative h-screen">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', // Higher res version of Gallery[0]
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary font-bold tracking-wider uppercase mb-4">Welcome to Adiyash Gym</h2>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              SCULPT YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-800">PERFECT BODY</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Join the elite fitness community in Mumbai. State-of-the-art equipment,
              expert trainers, and a motivating atmosphere to help you crush your goals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#programs"
                className="px-8 py-4 bg-primary hover:bg-red-700 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 group"
              >
                Explore Programs
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#contact"
                className="px-8 py-4 border-2 border-white hover:bg-white hover:text-black text-white font-bold rounded-full transition-all text-center"
              >
                Book Free Trial
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
