// backend/server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Queue from './models/Queue.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());

connectDB();

const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] }
});

async function getOrCreateQueue(department) {
  let queue = await Queue.findOne({ department });
  if (!queue) {
    queue = await Queue.create({ department, currentToken: 0, lastGeneratedToken: 0, waitingList: [], history: [] });
  }
  return queue;
}

io.on('connection', (socket) => {
  socket.on('join_room', async (room) => {
    socket.join(room);
    try {
      const queue = await getOrCreateQueue(room);
      socket.emit('queue_updated', queue);
    } catch (err) {
      console.error(err);
    }
  });
});

// 1. Add Patient / Generate Token
app.post('/api/queue/add', async (req, res) => {
  const { name, department, phone, duration } = req.body;
  try {
    const queue = await getOrCreateQueue(department);
    queue.lastGeneratedToken += 1;

    const newPatient = {
      name,
      phone,
      duration: Number(duration) || 15,
      tokenNumber: queue.lastGeneratedToken
    };

    queue.waitingList.push(newPatient);
    await queue.save();

    io.to(department).emit('queue_updated', queue);
    res.status(201).json({ success: true, queue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Move to Next (Bypass Logic)
app.post('/api/queue/move-next', async (req, res) => {
  const { department, patientId } = req.body;
  try {
    const queue = await Queue.findOne({ department });
    if (!queue) return res.status(404).json({ error: "Queue not found" });

    const index = queue.waitingList.findIndex(p => p._id.toString() === patientId);
    if (index > -1) {
      const [patient] = queue.waitingList.splice(index, 1);
      queue.waitingList.unshift(patient);
      await queue.save();

      io.to(department).emit('queue_updated', queue);
      return res.json({ success: true, queue });
    }
    res.status(404).json({ error: "Patient not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Call Next Patient
app.post('/api/queue/next', async (req, res) => {
  const { department } = req.body;
  try {
    const queue = await Queue.findOne({ department });
    if (!queue || queue.waitingList.length === 0) {
      return res.status(400).json({ error: "No patients waiting" });
    }

    const currentPatient = queue.waitingList.shift();
    queue.currentToken = currentPatient.tokenNumber;
    queue.history.push(currentPatient);
    await queue.save();

    io.to(department).emit('queue_updated', queue);
    io.to(department).emit('call_patient', { patientName: currentPatient.name, tokenNumber: currentPatient.tokenNumber });

    res.json({ success: true, queue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. NEW: Reset Department Queue Collection Entry Completely
app.post('/api/queue/reset', async (req, res) => {
  const { department } = req.body;
  try {
    const resetQueue = await Queue.findOneAndUpdate(
      { department },
      { $set: { currentToken: 0, lastGeneratedToken: 0, waitingList: [], history: [] } },
      { new: true, upsert: true }
    );
    
    io.to(department).emit('queue_updated', resetQueue);
    res.json({ success: true, queue: resetQueue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`🚀 Real MongoDB Engine on http://localhost:${PORT}`));