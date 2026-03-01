const TOTAL_MINUTES   = 480;                                       // 8hr day //
const BUFFER_PCT      = 0.15;
const SAFE_CAPACITY   = Math.floor(TOTAL_MINUTES * (1 - BUFFER_PCT)); // 408 min //
const BUFFER_POOL     = TOTAL_MINUTES - SAFE_CAPACITY;               // 72 min as buffer //


const SYMPTOM_MAP = {
  chest_pain:  { priority: 1, time: 12 },
  trauma:      { priority: 1, time: 15 },
  high_fever:  { priority: 2, time: 10 }, // priority and expected time for symptoms //
  pregnancy:   { priority: 2, time: 12 },
  fever_cold:  { priority: 3, time: 7  },
  stomach:     { priority: 3, time: 8  },
  diabetes_bp: { priority: 4, time: 6  },
  routine:     { priority: 4, time: 5  },
  other:       { priority: 3, time: 7  },
};


export function computeUrgencyScore(patient) {
  const s = SYMPTOM_MAP[patient.symptom] || { priority: 3, time: 7 }; // base score from symptom priority //
  let score = 0;

  
  score += (5 - s.priority) * 25;

  
  if (patient.type === 'emergency') score += 50; // in - case of emergency //

  
  const age = parseInt(patient.age);
  if (age >= 65 || age <= 5) score += 15; //age factor //
  else if (age >= 50)        score += 8;

  
  const pain = parseInt(patient.pain) || 1;
  score += pain * 2;       // pain factor //

  return Math.min(score, 100);
}


export function estimateConsultTime(patient) {
  const s = SYMPTOM_MAP[patient.symptom] || { priority: 3, time: 7 };
  let t = s.time;       // estimated time //

  const age = parseInt(patient.age);
  if (age >= 65 || age <= 5) t += 3;   
  if (patient.type === 'emergency') t += 3;

  const pain = parseInt(patient.pain) || 1;
  if (pain >= 8) t += 2;               

  return t;
}


export function getPriorityClass(score) {
  if (score >= 70) return 1; 
  if (score >= 50) return 2;   // priority class based on urgency score //
  if (score >= 30) return 3;  
  return 4;                   
}


export function buildOptimizedQueue(patients) {
  
  const sorted = [...patients].sort((a, b) => {
    if (b.urgencyScore !== a.urgencyScore) return b.urgencyScore - a.urgencyScore;
    return new Date(a.arrivalTime) - new Date(b.arrivalTime);  // sort by urgency score, then arrival time //
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


export function getCapacityReport(waitingPatients, completedPatients) {
  const scheduledMin  = waitingPatients.reduce((s, p) => s + p.estimatedTime, 0);
  const servedMin     = completedPatients.reduce((s, p) => s + p.estimatedTime, 0);
  const totalUsed     = scheduledMin + servedMin;
  const bufferUsed    = Math.max(0, totalUsed - SAFE_CAPACITY);
  const bufferLeft    = Math.max(0, BUFFER_POOL - bufferUsed);   // reports for doctor //
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