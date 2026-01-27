import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Programs from './components/Programs';
import Gallery from './components/Gallery';
import Trainers from './components/Trainers';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Branches from './components/Branches';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { CONTACT_INFO } from './constants';
import { Clock } from 'lucide-react';

function App() {
  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <Stats />
      <Programs />

      {/* Schedule Section */}
      <section id="schedule" className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-white uppercase tracking-wider">Gym Schedule</h2>
            <div className="inline-flex items-center gap-4 bg-black/20 px-8 py-4 rounded-full backdrop-blur-sm">
                <Clock className="text-white" size={32} />
                <div className="text-left">
                    <p className="text-white/80 text-sm font-medium">Opening Hours</p>
                    <p className="text-2xl font-bold text-white">{CONTACT_INFO.hours}</p>
                </div>
            </div>
            <p className="mt-6 text-white/80 max-w-2xl mx-auto">
                We are open 7 days a week. Check our FAQ for peak hours info.
            </p>
        </div>
      </section>

      <Gallery />
      <Trainers />
      <Pricing />
      <Testimonials />
      <Branches />
      <FAQ />
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}

export default App;
