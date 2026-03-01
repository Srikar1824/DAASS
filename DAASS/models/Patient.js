import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phone: String,
  symptom: String,
  pain: Number,
  type: String,

  urgencyScore: Number,
  priorityClass: Number,
  estimatedTime: Number,

  status: {
    type: String,
    default: 'waiting'
  },

  arrivalTime: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Patient', patientSchema);