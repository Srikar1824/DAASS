import express    from 'express';
import cors       from 'cors';
import mongoose   from 'mongoose';
import dotenv     from 'dotenv';
import patientRoutes from './routes/patients.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: '*',   // open for hackathon; restrict in prod
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/patients', patientRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'DAASS backend running', time: new Date().toISOString() });
});

// ─── DB + Start ───────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 DAASS backend running → http://localhost:${PORT}`);
      console.log(`   Queue endpoint → http://localhost:${PORT}/api/patients/queue`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });