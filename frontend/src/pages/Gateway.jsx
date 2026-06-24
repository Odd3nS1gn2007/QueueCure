import React from 'react';
import { Link } from 'react-router-dom';
import { Monitor, ShieldAlert } from 'lucide-react';

export default function Gateway() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center px-4 w-full">
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(236,72,153,0.3)]">
        QUEUE
      </h1>
      <p className="text-purple-300 max-w-md mb-12 text-xs md:text-sm uppercase tracking-widest font-semibold opacity-80">
        Select control matrix terminal view below to execute operational streams.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Neon Pink Reception Portal */}
        <Link to="/receptionist" className="group bg-[#170f26]/60 border border-pink-500/20 p-8 rounded-3xl hover:border-pink-500/80 transition-all duration-300 text-left shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.15)] relative overflow-hidden">
          <div className="w-14 h-14 bg-pink-500/10 text-pink-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300 border border-pink-500/20 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.6)]">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-white mb-2 tracking-wide uppercase group-hover:text-pink-400 transition-colors">Reception Control</h3>
          <p className="text-xs text-purple-200/60 leading-relaxed">Register incoming tokens, bypass positional arrays for priority handling, and push atomic live updates.</p>
        </Link>

        {/* Neon Cyan Board Portal */}
        <Link to="/waiting-room" className="group bg-[#170f26]/60 border border-purple-500/20 p-8 rounded-3xl hover:border-cyan-500/80 transition-all duration-300 text-left shadow-[0_0_25px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
          <div className="w-14 h-14 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300 border border-cyan-500/20 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.6)]">
            <Monitor className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-white mb-2 tracking-wide uppercase group-hover:text-cyan-400 transition-colors">Public Monitor View</h3>
          <p className="text-xs text-purple-200/60 leading-relaxed">Widescreen television display module built for live lobby tracking paired with automated audio callouts.</p>
        </Link>
      </div>
    </div>
  );
}