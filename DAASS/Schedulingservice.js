// ─────────────────────────────────────────────────────────────────────────────
// DAASS Scheduling Engine
// Core brain: priority scoring, time estimation, capacity management
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL_MINUTES   = 480;                                       // 8hr day
const BUFFER_PCT      = 0.15;
const SAFE_CAPACITY   = Math.floor(TOTAL_MINUTES * (1 - BUFFER_PCT)); // 408 min
const BUFFER_POOL     = TOTAL_MINUTES - SAFE_CAPACITY;               // 72 min

// Symptom → { base priority class, base consultation time (min) }
const SYMPTOM_MAP = {
  chest_pain:  { priority: 1, time: 12 },
  trauma:      { priority: 1, time: 15 },
  high_fever:  { priority: 2, time: 10 },
  pregnancy:   { priority: 2, time: 12 },
  fever_cold:  { priority: 3, time: 7  },
  stomach:     { priority: 3, time: 8  },
  diabetes_bp: { priority: 4, time: 6  },
  routine:     { priority: 4, time: 5  },
  other:       { priority: 3, time: 7  },
};

// ─── Urgency Score (0–100, higher = more urgent) ──────────────────────────────
export function computeUrgencyScore(patient) {
  const s = SYMPTOM_MAP[patient.symptom] || { priority: 3, time: 7 };
  let score = 0;

  // Symptom-based priority weight (P1=100pts base, P4=25pts base)
  score += (5 - s.priority) * 25;

  // Emergency type boost
  if (patient.type === 'emergency') score += 50;

  // Age risk (elderly & very young are higher risk)
  const age = parseInt(patient.age);
  if (age >= 65 || age <= 5) score += 15;
  else if (age >= 50)        score += 8;

  // Pain severity contribution
  const pain = parseInt(patient.pain) || 1;
  score += pain * 2;

  return Math.min(score, 100);
}

// ─── Estimated Consultation Time ──────────────────────────────────────────────
export function estimateConsultTime(patient) {
  const s = SYMPTOM_MAP[patient.symptom] || { priority: 3, time: 7 };
  let t = s.time;

  const age = parseInt(patient.age);
  if (age >= 65 || age <= 5) t += 3;   // elderly/child need more time
  if (patient.type === 'emergency') t += 3;

  const pain = parseInt(patient.pain) || 1;
  if (pain >= 8) t += 2;               // severe pain = more complex

  return t;
}

// ─── Priority Class from score ────────────────────────────────────────────────
export function getPriorityClass(score) {
  if (score >= 70) return 1;  // Emergency
  if (score >= 50) return 2;  // Severe
  if (score >= 30) return 3;  // Moderate
  return 4;                   // Mild
}

// ─── Sort + annotate queue ────────────────────────────────────────────────────
// Takes array of patient docs, returns sorted with waitMins & position added
export function buildOptimizedQueue(patients) {
  // Sort: higher urgency first, then earlier arrival
  const sorted = [...patients].sort((a, b) => {
    if (b.urgencyScore !== a.urgencyScore) return b.urgencyScore - a.urgencyScore;
    return new Date(a.arrivalTime) - new Date(b.arrivalTime);
  });

  let elapsed = 0;
  return sorted.map((p, i) => {
    const annotated = {
      ...p.toObject ? p.toObject() : p,
      position: i + 1,
      waitMins: elapsed,
    };
    elapsed += p.estimatedTime;
    return annotated;
  });
}

// ─── Capacity Report ──────────────────────────────────────────────────────────
export function getCapacityReport(waitingPatients, completedPatients) {
  const scheduledMin  = waitingPatients.reduce((s, p) => s + p.estimatedTime, 0);
  const servedMin     = completedPatients.reduce((s, p) => s + p.estimatedTime, 0);
  const totalUsed     = scheduledMin + servedMin;
  const bufferUsed    = Math.max(0, totalUsed - SAFE_CAPACITY);
  const bufferLeft    = Math.max(0, BUFFER_POOL - bufferUsed);
  const overload      = totalUsed > SAFE_CAPACITY + BUFFER_POOL;
  const overloadMins  = Math.max(0, totalUsed - (SAFE_CAPACITY + BUFFER_POOL));

  return {
    safeCapacity:    SAFE_CAPACITY,
    bufferPool:      BUFFER_POOL,
    totalMinutes:    TOTAL_MINUTES,
    scheduledMin,
    servedMin,
    totalUsed,
    bufferUsed,
    bufferLeft,
    bufferPct:       Math.round((bufferLeft / BUFFER_POOL) * 100),
    capacityPct:     Math.min(Math.round((totalUsed / SAFE_CAPACITY) * 100), 999),
    overload,
    overloadMins,
    utilizationPct:  completedPatients.length
      ? Math.min(Math.round((servedMin / SAFE_CAPACITY) * 100), 100)
      : 0,
  };
}

export { SAFE_CAPACITY, BUFFER_POOL, TOTAL_MINUTES };