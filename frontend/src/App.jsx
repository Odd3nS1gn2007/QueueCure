// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Gateway from './pages/Gateway';
import Receptionist from './pages/Receptionist';
import WaitingRoom from './pages/WaitingRoom';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100 antialiased font-sans">
        {/* Navigation Header */}
        <nav className="bg-slate-800/80 border-b border-slate-700/50 p-4 sticky top-0 backdrop-blur-md z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              ⚕️ QueueCure Hub
            </Link>
            <div className="space-x-6 text-sm font-medium">
              <Link to="/" className="text-slate-300 hover:text-indigo-400 transition">Gateway</Link>
              <Link to="/receptionist" className="text-slate-300 hover:text-indigo-400 transition">Receptionist</Link>
              <Link to="/waiting-room" className="text-slate-300 hover:text-indigo-400 transition">Live Display</Link>
            </div>
          </div>
        </nav>

        {/* Dynamic Route Injection View */}
        <main className="max-w-7xl mx-auto p-4 md:p-8">
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