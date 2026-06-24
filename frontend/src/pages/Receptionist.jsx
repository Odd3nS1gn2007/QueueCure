// frontend/src/pages/Receptionist.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { UserPlus, Search, LogOut, ArrowUp, Zap, Trash2 } from 'lucide-react';

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

  // Triggers backend wipeout endpoint for the active department
  const handleResetQueue = async () => {
    if (window.confirm(`⚠️ Are you sure you want to completely clear the live queue for ${department}? This resets tokens to 0.`)) {
      try {
        const response = await fetch('http://localhost:5000/api/queue/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ department })
        });
        if (!response.ok) throw new Error("Reset action failed");
      } catch (err) {
        console.error("Error resetting department queue:", err);
      }
    }
  };

  const filteredPatients = queueState.waitingList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tokenNumber.toString() === searchQuery
  );

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/50 border border-slate-700/40 p-4 rounded-2xl w-full">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-slate-400">Department:</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-slate-900 border border-slate-700 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>General Medicine</option>
            <option>Pediatrics</option>
            <option>Cardiology</option>
            <option>Dermatology</option>
          </select>
        </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800/50 border border-indigo-500/20 p-6 rounded-2xl text-center shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold tracking-wider uppercase text-indigo-400">Now Serving</h3>
              <p className="text-6xl font-black text-white my-2">#{queueState.currentToken}</p>
              <button onClick={handleCallNext} disabled={queueState.waitingList.length === 0} className="mt-5 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200"><Zap className="w-5 h-5" /> Call Next Patient</button>
            </div>
            {/* Reset Live Queue Button Trigger Panel */}
            <div className="mt-6 pt-4 border-t border-slate-700/40">
              <button onClick={handleResetQueue} className="w-full flex items-center justify-center gap-2 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white font-medium py-2 px-4 rounded-xl transition duration-200 text-xs">
                <Trash2 className="w-4 h-4" /> Reset Live Queue
              </button>
            </div>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white mb-4"><UserPlus className="w-5 h-5 text-indigo-400" /> New Registration</h3>
            <form onSubmit={handleAddPatient} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Patient Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500" placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Estimated Checkup (Mins)</label>
                <input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500" />
              </div>
              <button type="submit" className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-xl transition">Generate Token</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
            <input type="text" placeholder="Search by name or token number..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-800/40 border border-slate-700/60 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div className="bg-slate-800/20 border border-slate-700/30 p-4 rounded-2xl min-h-[400px]">
            <h4 className="text-sm font-bold text-slate-400 mb-3">Upcoming Active Queue ({filteredPatients.length})</h4>
            {filteredPatients.length === 0 ? (
              <div className="text-center py-20 text-slate-500 text-sm">No active matching patients.</div>
            ) : (
              <div className="space-y-2">
                {filteredPatients.map((patient, idx) => (
                  <div key={patient._id} className="flex justify-between items-center bg-slate-800/60 border border-slate-700/40 p-4 rounded-xl">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black bg-slate-700 text-indigo-300 px-2 py-0.5 rounded-md">Token {patient.tokenNumber}</span>
                        <h5 className="font-semibold text-white">{patient.name}</h5>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Position: #{idx + 1}</p>
                    </div>
                    {idx > 0 && (
                      <button onClick={() => handleMoveToNext(patient._id)} className="flex items-center gap-1.5 text-xs font-semibold bg-amber-500/10 hover:bg-amber-50 text-amber-400 hover:text-slate-900 px-3 py-2 rounded-lg transition-all border border-amber-500/20">
                        <ArrowUp className="w-3.5 h-3.5" /> Move to Next
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