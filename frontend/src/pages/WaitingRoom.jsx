// frontend/src/pages/WaitingRoom.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Volume2 } from 'lucide-react';

const socket = io('http://localhost:5000');

export default function WaitingRoom() {
  const [department, setDepartment] = useState('General Medicine');
  const [queue, setQueue] = useState({ currentToken: 0, waitingList: [] });
  const [announcement, setAnnouncement] = useState('Welcome to QueueCure Display');

  useEffect(() => {
    socket.emit('join_room', department);
    
    socket.on('queue_updated', (updatedQueue) => setQueue(updatedQueue));
    
    socket.on('call_patient', (data) => {
      const message = `Token number ${data.tokenNumber}, ${data.patientName}, please proceed to ${department}`;
      setAnnouncement(message);
      
      // Local zero-bandwidth Native Text-To-Speech Trigger
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); // Clear old spoken text queues
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
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-center bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
        <select value={department} onChange={e => setDepartment(e.target.value)} className="bg-slate-900 border border-slate-700 text-white font-bold rounded-xl px-4 py-2">
          <option>General Medicine</option>
          <option>Pediatrics</option>
          <option>Cardiology</option>
          <option>Dermatology</option>
        </select>
      </div>

      {/* Hero Visual Token Board Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-b from-indigo-950/50 to-slate-950 border border-indigo-500/30 p-12 rounded-3xl text-center flex flex-col justify-center items-center shadow-2xl">
          <span className="text-sm font-bold uppercase tracking-widest text-indigo-400">Now Proceed To Doctor</span>
          <div className="text-9xl font-black text-white my-6 tracking-tighter">
            #{queue.currentToken}
          </div>
          <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-300 px-4 py-2 rounded-xl text-xs font-semibold">
            <Volume2 className="w-4 h-4 animate-pulse" /> {announcement}
          </div>
        </div>

        {/* Dynamic Next Up Sub-Sidebar Panel */}
        <div className="bg-slate-800/30 border border-slate-700/40 p-6 rounded-3xl">
          <h3 className="text-md font-bold text-slate-400 mb-4 border-b border-slate-700 pb-2">Next Up</h3>
          {queue.waitingList.slice(0, 4).length === 0 ? (
            <div className="text-slate-600 text-sm py-10 text-center">No upcoming patients</div>
          ) : (
            <div className="space-y-3">
              {queue.waitingList.slice(0, 4).map((p) => (
                <div key={p._id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex justify-between items-center animate-fade-in">
                  <span className="font-semibold text-white truncate max-w-[120px]">{p.name}</span>
                  <span className="text-xs font-black bg-slate-800 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-md">Token {p.tokenNumber}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}