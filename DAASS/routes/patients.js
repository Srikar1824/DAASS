import express from 'express';
import Patient from '../models/Patient.js';
import {
  buildOptimizedQueue,
  getCapacityReport,
  computeUrgencyScore,
  estimateConsultTime,
  getPriorityClass
} from '../Schedulingservice.js';

const router = express.Router();

/* ─────────────────────────────────────────────
   POST → Add New Patient
────────────────────────────────────────────── */
router.post('/', async (req, res) => {
  try {
    const { name, age, phone, symptom, pain, type } = req.body;

    const urgencyScore  = computeUrgencyScore(req.body);
    const estimatedTime = estimateConsultTime(req.body);
    const priorityClass = getPriorityClass(urgencyScore);

    const patient = await Patient.create({
      name,
      age,
      phone,
      symptom,
      pain,
      type,
      urgencyScore,
      estimatedTime,
      priorityClass,
      status: 'waiting'
    });

    res.status(201).json({ patient });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ─────────────────────────────────────────────
   GET → Optimized Queue
────────────────────────────────────────────── */
router.get('/queue', async (req, res) => {
  try {
    const waiting   = await Patient.find({ status: 'waiting' });
    const completed = await Patient.find({ status: 'completed' });
    const noShows   = await Patient.find({ status: 'noshow' });

    const queue    = buildOptimizedQueue(waiting);
    const capacity = getCapacityReport(waiting, completed);

    const stats = {
      inQueue: waiting.length,
      emergency: waiting.filter(p => p.priorityClass === 1).length,
      served: completed.length,
      avgWait: queue.length
        ? Math.round(queue.reduce((s, p) => s + p.waitMins, 0) / queue.length)
        : 0,
      noShows: noShows.length
    };

    res.json({ queue, stats, capacity });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ─────────────────────────────────────────────
   PATCH → Mark Complete
────────────────────────────────────────────── */
router.patch('/:id/complete', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );

    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    res.json({ message: 'Patient marked completed', patient });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ─────────────────────────────────────────────
   PATCH → Mark No-Show
────────────────────────────────────────────── */
router.patch('/:id/noshow', async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { status: 'noshow' },
      { new: true }
    );

    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    res.json({ message: 'Patient marked no-show', patient });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ─────────────────────────────────────────────
   PATCH → Upgrade to Emergency
────────────────────────────────────────────── */
router.patch('/:id/emergency', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    patient.type = 'emergency';
    patient.urgencyScore = 100;
    patient.priorityClass = 1;

    await patient.save();

    res.json({ message: 'Upgraded to emergency', patient });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;