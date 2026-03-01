import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import patientRoutes from '../routes/patients.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Middleware ─────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));

app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// ─── Routes ────────────────────────────────
app.use('/api/patients', patientRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    status: 'DAASS backend running on Vercel',
    time: new Date().toISOString()
  });
});

// ─── MongoDB connection (NO app.listen) ───
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

connectDB();

// ─── EXPORT app for Vercel ─────────────────
export default app;