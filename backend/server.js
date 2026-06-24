// backend/server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Enable CORS so our frontend can talk to the backend safely
app.use(cors({
  origin: "http://localhost:5173", // Vite's default port
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());

// Initialize MongoDB Connection
connectDB();

// Live Socket.io Setup
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Socket.io Connection Router
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Join department room (e.g., 'pediatrics', 'cardiology')
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`👤 User joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// Make 'io' accessible to our API routes
app.set('io', io);

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "healthy", service: "clinic-queue-backend" });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Queue Server running on http://localhost:${PORT}`);
});