import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Volume2 } from 'lucide-react';

const socket = io('http://localhost:5000');

export default function WaitingRoom() {
  const [department, setDepartment] = useState('General Medicine');
  const [queue, setQueue] = useState({ currentToken: 0, waitingList: [] });
  const [announcement, setAnnouncement] = useState('System Initialized: Ready for Callstream');

  useEffect(() => {
    socket.emit('join_room', department);
    socket.on('queue_updated', (updatedQueue) => setQueue(updatedQueue));
    
    socket.on('call_patient', (data) => {
      const message = `Token number ${data.tokenNumber}, ${data.patientName}, please proceed to ${department}`;
      setAnnouncement(message);
      
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    });

    return () => {
      socket.off('queue_updated');
      socket.off('call_patient');
    };
  }, [department]);

  return (
    <div className="space-y-8 w-full max-w-[1400px] mx-auto px-2">
      {/* Selector Module */}
      <div className="flex justify-center bg-[#140f24] p-4 rounded-2xl border border-purple-500/20 shadow-[0_0_15px_rgba(0,0,0,0.3)]">
        <select value={department} onChange={e => setDepartment(e.target.value)} className="bg-[#1c1632] border border-cyan-500/30 text-cyan-400 font-black tracking-widest uppercase text-sm rounded-xl px-5 py-2.5 focus:outline-none transition-all">
          <option>General Medicine</option>
          <option>Pediatrics</option>
          <option>Cardiology</option>
          <option>Dermatology</option>
        </select>
      </div>

      {/* Main Broadcast Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        {/* Massive Screen Component */}
        <div className="lg:col-span-2 bg-gradient-to-b from-[#180e2b] to-[#0a0612] border-2 border-pink-500/40 p-12 rounded-3xl text-center flex flex-col justify-center items-center shadow-[0_0_35px_rgba(236,72,153,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-70 animate-pulse"></div>
          <span className="text-xs font-black uppercase tracking-[0.3em] text-pink-400">PROCEED TO ASSIGNED HUB</span>
          <div className="text-9xl md:text-[11rem] font-black text-white my-8 tracking-tighter drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]">
            #{queue.currentToken}
          </div>
          <div className="flex items-center gap-3 bg-purple-500/10 text-purple-300 px-5 py-3 border border-purple-500/20 rounded-2xl text-xs font-bold tracking-wide shadow-md">
            <Volume2 className="w-5 h-5 text-cyan-400 animate-bounce flex-shrink-0" /> {announcement}
          </div>
        </div>

        {/* Side Queue Status Block */}
        <div className="bg-[#140f24]/70 border border-purple-500/20 p-6 rounded-3xl flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-purple-400 mb-5 border-b border-purple-500/10 pb-3">Upcoming Pipeline Queue</h3>
          {queue.waitingList.slice(0, 5).length === 0 ? (
            <div className="text-purple-400/30 font-bold tracking-wider text-xs py-24 text-center">Pipeline Stack Vacant</div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto">
              {queue.waitingList.slice(0, 5).map((p) => (
                <div key={p._id} className="bg-[#1c1433]/70 border border-purple-500/10 p-4 rounded-xl flex justify-between items-center shadow-sm">
                  <span className="font-bold text-slate-200 truncate max-w-[150px] text-sm uppercase tracking-wide">{p.name}</span>
                  <span className="text-xs font-black bg-slate-900 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg tracking-wider">TKN {p.tokenNumber}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}