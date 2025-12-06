import { writable, get } from 'svelte/store';

// --- Data Structures ---
// Patient: { id, name, type, duration (30|60), color }
// Schedule: { "YYYY-MM-DD": { "HH:MM": { patientId, isHead, type: 'start'|'extend' } } }
// Notification: { id, message, type }

// --- Persistence Helpers ---
const persist = (key, store, defaultVal) => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        store.set(JSON.parse(stored));
      } catch (e) { console.error(e); }
    }
    store.subscribe(v => localStorage.setItem(key, JSON.stringify(v)));
  }
};

// --- Stores ---
export const patients = writable([
  { id: 'p1', name: '张伟', type: '脑卒中', duration: 60, color: 'bg-blue-500' },
  { id: 'p2', name: '李娜', type: '骨折术后', duration: 30, color: 'bg-emerald-500' }
]);

export const schedule = writable({});
export const selectedPatientId = writable(null);
export const currentDate = writable(new Date().toLocaleDateString('en-CA'));
export const toasts = writable([]);

// Initialize
persist('rehab_patients_v2', patients, []);
persist('rehab_schedule_v2', schedule, {});

// --- Toast Actions ---
export const showToast = (message, type = 'info') => {
  const id = Math.random();
  toasts.update(t => [...t, { id, message, type }]);
  setTimeout(() => {
    toasts.update(t => t.filter(x => x.id !== id));
  }, 3000);
};

// --- Patient Actions ---
export const addPatient = (p) => {
  patients.update(list => [...list, { ...p, id: crypto.randomUUID() }]);
  showToast('Patient added', 'success');
};

export const updatePatient = (id, updates) => {
  patients.update(list => list.map(p => p.id === id ? { ...p, ...updates } : p));
  showToast('Patient updated', 'success');
};

export const deletePatient = (id) => {
  patients.update(list => list.filter(p => p.id !== id));
  selectedPatientId.update(curr => curr === id ? null : curr);
  showToast('Patient deleted', 'warning');
};

// --- Schedule Actions ---

// Helper to get time + minutes
const addMinutes = (time, mins) => {
  const [h, m] = time.split(':').map(Number);
  const date = new Date(0, 0, 0, h, m + mins);
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');
  return `${hh}:${mm}`;
};

// ... (existing imports)

export const selectedDuration = writable(30);

// ... (existing code)

export const paintSlot = (time) => {
  const sPatientId = get(selectedPatientId);
  if (!sPatientId) return showToast('Please select a patient first', 'error');

  const allPatients = get(patients);
  const patient = allPatients.find(p => p.id === sPatientId);
  if (!patient) return;

  const date = get(currentDate);
  const sch = get(schedule);
  const daySchedule = sch[date] || {};

  // Check availability
  if (daySchedule[time]) return showToast('Slot already occupied', 'error');

  // Use selectedDuration if available, otherwise patient default, otherwise 30
  const duration = get(selectedDuration) || (parseInt(patient.duration) || 30);

  // Logic for 60 mins (2 slots)
  if (duration === 60) {
    const nextTime = addMinutes(time, 30);
    // We only support up to 20:00, so check bounds logic in component or here
    // If nextTime is > 20:00 or whatever limit, we might block or allow.
    // Assuming strict 30 min slots.

    if (daySchedule[nextTime]) {
      return showToast('Next slot is occupied (Needs 1h)', 'error');
    }

    // Commit
    schedule.update(s => ({
      ...s,
      [date]: {
        ...(s[date] || {}),
        [time]: { patientId: patient.id, isHead: true, duration: 60 },
        [nextTime]: { patientId: patient.id, isHead: false, duration: 60, headTime: time }
      }
    }));
  } else {
    // 30 mins
    schedule.update(s => ({
      ...s,
      [date]: {
        ...(s[date] || {}),
        [time]: { patientId: patient.id, isHead: true, duration: 30 }
      }
    }));
  }
  showToast('Scheduled successfully', 'success');
};

export const clearSlot = (date, time) => {
  schedule.update(s => {
    const day = { ...(s[date] || {}) };
    const slot = day[time];
    if (!slot) return s;

    // If it's a head of a multi-slot, we need to find the others. 
    // Or if it's a tail, find the head.
    // Simplification: We remove the clicked slot. 
    // If the slot has a 'headTime' (it's a tail), we remove the head too.
    // If the slot isHead and duration > 30, we remove the next slot too.

    let slotsToRemove = [time];

    if (slot.duration === 60) {
      if (slot.isHead) {
        const nextTime = addMinutes(time, 30);
        slotsToRemove.push(nextTime);
      } else if (slot.headTime) {
        slotsToRemove.push(slot.headTime);
      }
    }

    slotsToRemove.forEach(t => delete day[t]);

    return { ...s, [date]: day };
  });
  showToast('Slot cleared', 'info');
};

export const copyYesterday = () => {
  const date = get(currentDate);
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  const yesterday = d.toLocaleDateString('en-CA');

  const allSch = get(schedule);
  const msg = allSch[yesterday] ? 'Copied yesterday\'s schedule' : 'No data from yesterday';
  const type = allSch[yesterday] ? 'success' : 'warning';

  if (allSch[yesterday]) {
    schedule.update(s => ({
      ...s,
      [date]: JSON.parse(JSON.stringify(allSch[yesterday])) // Deep copy
    }));
  }
  showToast(msg, type);
};
