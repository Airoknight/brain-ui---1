import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full py-5 px-6 md:px-12 flex justify-between items-center bg-white sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
         {/* Simple text logo to match "OSAT" style */}
         <span className="text-2xl font-black tracking-tighter text-gray-900">
            DSAT
            <span className="text-brand-red text-4xl leading-[0px] relative top-1">.</span>
         </span>
      </div>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <a href="#" className="hover:text-gray-900 transition-colors">Courses</a>
        <a href="#" className="hover:text-gray-900 transition-colors">Methodology</a>
        <a href="#" className="hover:text-gray-900 transition-colors">About</a>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block">Log in</a>
        <button className="bg-brand-red hover:bg-red-700 text-white text-sm font-bold py-2.5 px-6 rounded transition-colors shadow-sm">
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;