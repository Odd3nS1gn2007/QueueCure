// backend/models/Queue.js
import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  tokenNumber: { type: Number, required: true },
  phone: { type: String },
  duration: { type: Number, default: 15 },
  joinedAt: { type: Date, default: Date.now }
});

const QueueSchema = new mongoose.Schema({
  department: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['General Medicine', 'Pediatrics', 'Cardiology', 'Dermatology']
  },
  currentToken: { type: Number, default: 0 },
  lastGeneratedToken: { type: Number, default: 0 },
  waitingList: [PatientSchema],
  history: [PatientSchema]
}, { timestamps: true });

export default mongoose.model('Queue', QueueSchema);