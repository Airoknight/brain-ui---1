import React from 'react';
import Navbar from './components/Navbar';
import HeroContent from './components/HeroContent';
import BrainGraph from './components/BrainGraph';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow flex flex-col md:flex-row items-center justify-between px-6 md:px-16 lg:px-24 py-8 md:py-0 relative overflow-hidden">
        
        {/* Left Column: Content */}
        <div className="w-full md:w-1/2 lg:w-5/12 pt-10 md:pt-0 pb-12 md:pb-0 z-10 order-2 md:order-1">
          <HeroContent />
        </div>

        {/* Right Column: Brain Viz */}
        <div className="w-full md:w-1/2 lg:w-7/12 h-[400px] md:h-[600px] relative order-1 md:order-2 flex items-center justify-center">
            {/* Background decorative glow */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-gray-100 to-transparent rounded-full opacity-50 blur-3xl pointer-events-none"></div>
            
            <BrainGraph />
        </div>

      </main>

      {/* Footer Trusted By Section */}
      <div className="w-full py-8 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
            <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">Trusted by engineers at</p>
            <div className="text-gray-400 text-sm font-medium">
                Curriculum aligned with top engineering cultures
            </div>
        </div>
      </div>
    </div>
  );
};

export default App;