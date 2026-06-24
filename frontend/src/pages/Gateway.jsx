// frontend/src/pages/Gateway.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, ShieldAlert } from 'lucide-react';

export default function Gateway() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 w-full">
      {/* Title updated to just "Queue" with an edge-to-edge layout layout flow */}
      <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
        Smart Clinic
      </h1>
      <p className="text-slate-400 max-w-md mb-12 text-sm md:text-base">
        Select a portal view below to launch either the front-desk live coordination hub or the public waiting room display board.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Reception Panel Portal */}
        <Link to="/receptionist" className="group bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl hover:border-indigo-500/50 transition-all duration-300 text-left shadow-xl hover:shadow-indigo-500/5">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Receptionist Control</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Register new entries, override positional layouts for priority handling, and issue real-time token calls.</p>
        </Link>

        {/* Public Board Portal */}
        <Link to="/waiting-room" className="group bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 text-left shadow-xl hover:shadow-cyan-500/5">
          <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
            <Monitor className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Public Monitor View</h3>
          <p className="text-xs text-slate-400 leading-relaxed">Responsive live display screen designed for external televisions featuring sound-triggered announcements.</p>
        </Link>
      </div>
    </div>
  );
}