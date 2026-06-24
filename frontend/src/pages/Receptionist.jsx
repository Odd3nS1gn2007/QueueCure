import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { UserPlus, Search, ArrowUp, Zap, Trash2 } from 'lucide-react';

const socket = io('http://localhost:5000');

export default function Receptionist() {
  const [department, setDepartment] = useState('General Medicine');
  const [queueState, setQueueState] = useState({ currentToken: 0, lastGeneratedToken: 0, waitingList: [], history: [] });
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [duration, setDuration] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    socket.emit('join_room', department);
    socket.on('queue_updated', (updatedQueue) => setQueueState(updatedQueue));
    return () => socket.off('queue_updated');
  }, [department]);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await fetch('http://localhost:5000/api/queue/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, department, phone, duration })
      });
      setName(''); setPhone(''); setDuration(15);
    } catch (err) { console.error(err); }
  };

  const handleCallNext = async () => {
    try {
      await fetch('http://localhost:5000/api/queue/next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department })
      });
    } catch (err) { console.error(err); }
  };

  const handleMoveToNext = async (patientId) => {
    try {
      await fetch('http://localhost:5000/api/queue/move-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department, patientId })
      });
    } catch (err) { console.error(err); }
  };

  const handleResetQueue = async () => {
    if (window.confirm(`⚠️ Completely wipe terminal queue arrays for ${department}?`)) {
      try {
        const response = await fetch('http://localhost:5000/api/queue/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ department })
        });
        if (!response.ok) throw new Error("Reset action failed");
      } catch (err) { console.error(err); }
    }
  };

  const filteredPatients = queueState.waitingList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tokenNumber.toString() === searchQuery
  );

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto">
      {/* Top Controller Ribbon */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#140f24] border border-purple-500/20 p-5 rounded-2xl w-full shadow-[0_0_15px_rgba(168,85,247,0.05)]">
        <div className="flex items-center gap-4">
          <label className="text-xs font-black uppercase tracking-widest text-purple-400">Department Matrix:</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-[#1c1632] border border-pink-500/30 text-white rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all">
            <option>General Medicine</option>
            <option>Pediatrics</option>
            <option>Cardiology</option>
            <option>Dermatology</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Left Column Controls */}
        <div className="space-y-6 lg:col-span-1">
          {/* Active Terminal Monitor */}
          <div className="bg-gradient-to-br from-[#1b0d2d] to-[#0f091c] border border-pink-500/30 p-6 rounded-2xl text-center shadow-[0_0_20px_rgba(236,72,153,0.05)] flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-black tracking-widest uppercase text-pink-400">Now Serving Stream</h3>
              <p className="text-7xl font-black text-white my-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">#{queueState.currentToken}</p>
              <button onClick={handleCallNext} disabled={queueState.waitingList.length === 0} className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-slate-800 disabled:to-slate-900 text-white font-black tracking-wider uppercase py-3 px-4 rounded-xl transition-all duration-200 shadow-[0_0_15px_rgba(236,72,153,0.3)] disabled:shadow-none"><Zap className="w-4 h-4" /> Trigger Next</button>
            </div>
            <div className="mt-6 pt-4 border-t border-purple-500/10">
              <button onClick={handleResetQueue} className="w-full flex items-center justify-center gap-2 border border-rose-500/40 bg-rose-500/5 hover:bg-rose-600/20 text-rose-400 font-bold tracking-wider uppercase py-2 px-4 rounded-xl transition duration-200 text-xs">
                <Trash2 className="w-4 h-4" /> Reset Stream Data
              </button>
            </div>
          </div>

          {/* New Input Form */}
          <div className="bg-[#140f24] border border-purple-500/20 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.2)]">
            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-cyan-400 mb-5"><UserPlus className="w-4 h-4" /> Inject New Profile</h3>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-purple-400 mb-1">Subject Label</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#1b152e] border border-purple-500/20 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-purple-400 mb-1">Comms Network Phone</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#1b152e] border border-purple-500/20 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-purple-400 mb-1">Estimated Cycle Window (Mins)</label>
                <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-[#1b152e] border border-purple-500/20 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
              </div>
              <button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 border border-purple-500/30 text-cyan-400 font-bold uppercase tracking-widest text-xs py-3 rounded-xl transition-all duration-200">Generate Token Array</button>
            </form>
          </div>
        </div>

        {/* Right Column Queue Lists */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-purple-400" />
            <input type="text" placeholder="Search operational matrices by index label or token identifier..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-[#140f24] border border-purple-500/30 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-purple-400/50 focus:ring-2 focus:ring-pink-500 outline-none shadow-inner" />
          </div>

          <div className="bg-[#140f24]/50 border border-purple-500/20 p-5 rounded-2xl min-h-[460px]">
            <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-4">Pending Pipeline Vectors ({filteredPatients.length})</h4>
            {filteredPatients.length === 0 ? (
              <div className="text-center py-24 text-purple-400/40 font-bold tracking-wide text-sm">Clear Pipeline. No operational targets active.</div>
            ) : (
              <div className="space-y-2.5">
                {filteredPatients.map((patient, idx) => (
                  <div key={patient._id} className="flex justify-between items-center bg-[#19122d]/80 border border-purple-500/20 p-4 rounded-xl shadow-md hover:border-pink-500/40 transition-colors">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2.5 py-1 rounded-md tracking-wider">TKN {patient.tokenNumber}</span>
                        <h5 className="font-bold text-white text-sm">{patient.name}</h5>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mt-1.5">Stack Index Reference: #{idx + 1}</p>
                    </div>
                    {idx > 0 && (
                      <button onClick={() => handleMoveToNext(patient._id)} className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-slate-900 px-3 py-2 rounded-xl transition-all border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.05)]">
                        <ArrowUp className="w-3.5 h-3.5" /> Intercept Next
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}