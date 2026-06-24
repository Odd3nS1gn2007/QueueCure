import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Gateway from './pages/Gateway';
import Receptionist from './pages/Receptionist';
import WaitingRoom from './pages/WaitingRoom';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0b0813] text-slate-100 antialiased font-sans flex flex-col selection:bg-pink-500 selection:text-white">
        {/* Cyberpunk Navigation Header */}
        <nav className="bg-[#130f22]/90 border-b border-pink-500/30 p-4 sticky top-0 backdrop-blur-md z-50 w-full shadow-[0_4px_20px_rgba(236,72,153,0.15)]">
          <div className="w-full flex justify-between items-center px-4 md:px-8">
            <Link to="/" className="text-2xl font-black tracking-wider bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(236,72,153,0.3)]">
              ⚡ QUEUECURE
            </Link>
            <div className="space-x-6 text-xs md:text-sm font-bold tracking-widest uppercase">
              <Link to="/" className="text-slate-400 hover:text-pink-400 transition-all duration-200">Gateway</Link>
              <Link to="/receptionist" className="text-slate-400 hover:text-purple-400 transition-all duration-200">Receptionist</Link>
              <Link to="/waiting-room" className="text-slate-400 hover:text-cyan-400 transition-all duration-200">Live Display</Link>
            </div>
          </div>
        </nav>

        {/* Full Screen View Dynamic Injection */}
        <main className="w-full flex-1 p-4 md:p-8">
          <Routes>
            <Route path="/" element={<Gateway />} />
            <Route path="/receptionist" element={<Receptionist />} />
            <Route path="/waiting-room" element={<WaitingRoom />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}