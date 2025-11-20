
import React, { useState } from 'react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Front Page', view: 'HOME' as ViewState },
    { label: 'News & Debates', view: 'NEWS' as ViewState },
    { label: 'Write Post', view: 'POST' as ViewState },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-accent-500 selection:text-white">
      {/* Header */}
      <header className="bg-school-900 text-white shadow-lg sticky top-0 z-50 border-b border-school-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center cursor-pointer group" onClick={() => onChangeView('HOME')}>
              <div className="relative mr-3">
                 <svg className="h-8 w-8 md:h-10 md:w-10 text-accent-500 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl md:text-2xl font-bold tracking-wider leading-none text-white">Notedly</span>
                <span className="text-[10px] md:text-xs text-school-200 tracking-[0.2em] uppercase font-medium mt-0.5">Student Voices</span>
              </div>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onChangeView(item.view)}
                  className={`text-sm font-bold transition-all duration-200 px-3 py-2 rounded-lg ${
                    currentView === item.view 
                      ? 'text-white bg-school-800 shadow-inner shadow-black/20' 
                      : 'text-school-200 hover:text-white hover:bg-school-800/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-school-200 hover:text-white hover:bg-school-800 focus:outline-none transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Glass Effect Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[64px] left-0 w-full bg-school-900/95 backdrop-blur-xl border-t border-school-800 shadow-2xl z-40 animate-in slide-in-from-top-2 fade-in">
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    onChangeView(item.view);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-4 rounded-xl text-base font-bold transition-all ${
                    currentView === item.view 
                      ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/20' 
                      : 'text-school-100 hover:bg-school-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {children}
      </main>

      {/* Footer - Optimized for Mobile */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-2">
               <span className="font-serif text-2xl font-bold text-white tracking-tight">Notedly</span>
            </div>
            <p className="text-sm opacity-60 max-w-xs mx-auto md:mx-0 leading-relaxed">
              Empowering student voices through journalism, debate, and creative media.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-800/50 rounded-full border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800 transition-colors group">
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">Made by</span>
              <span className="text-sm font-black text-slate-500 group-hover:text-slate-400 transition-all">
                Cristiano Idemudia
              </span>
            </div>
            <p className="text-xs font-medium text-slate-600">
              &copy; {new Date().getFullYear()} Notedly. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
