import React from 'react';

const HeroContent: React.FC = () => {
  return (
    <div className="flex flex-col items-start justify-center max-w-xl z-10">
      {/* Tagline */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-2 h-2 bg-brand-red rounded-full animate-pulse"></div>
        <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">Never Stop Educating</span>
      </div>

      {/* Headline */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
        Master the systems <br />
        <span className="text-gray-800">that build the world.</span>
      </h1>

      {/* Subtext */}
      <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-md">
        Don't just learn syntax. Understand the entire stack—from linear algebra to the server. Build the intuition that separates engineers from coders.
      </p>

      {/* Search Input */}
      <div className="relative w-full max-w-md group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400 group-focus-within:text-brand-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text" 
          placeholder="What do you want to master?" 
          className="block w-full pl-12 pr-12 py-4 bg-gray-50 border-2 border-transparent focus:border-gray-200 focus:bg-white rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 transition-all shadow-sm"
        />
        <div className="absolute inset-y-0 right-2 flex items-center">
             <button className="bg-brand-dark text-white p-2 rounded hover:bg-black transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
             </button>
        </div>
      </div>

      {/* Popular Tags */}
      <div className="mt-6 flex flex-wrap gap-2 text-xs text-gray-500 font-medium">
        <span>Popular:</span>
        <a href="#" className="hover:text-brand-red transition-colors">Linear Algebra</a>
        <span>•</span>
        <a href="#" className="hover:text-brand-red transition-colors">System Design</a>
        <span>•</span>
        <a href="#" className="hover:text-brand-red transition-colors">Compilers</a>
      </div>
    </div>
  );
};

export default HeroContent;