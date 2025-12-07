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
  { id: 'p1', name: '张伟', type: '脑卒中', duration: 30, color: 'bg-blue-500', contact: '13812345678', frequency: '2025.12.01开始', price: 100, category: 'Inpatient' },
  { id: 'p2', name: '李娜', type: '骨折术后', duration: 60, color: 'bg-emerald-500', contact: '13987654321', frequency: '每周三次', price: 150, category: 'Outpatient' }
]);

export const schedule = writable({});
export const selectedPatientId = writable(null);
export const currentDate = writable(new Date().toLocaleDateString('en-CA'));
export const toasts = writable([]);

// Initialize
persist('rehab_patients_v3', patients, []);
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
  showToast('患者已添加', 'success');
};

export const updatePatient = (id, updates) => {
  patients.update(list => list.map(p => p.id === id ? { ...p, ...updates } : p));

  // If the updated patient is currently selected, update the selectedDuration logic too
  if (get(selectedPatientId) === id && updates.duration) {
    selectedDuration.set(updates.duration);
  }

  showToast('患者已更新', 'success');
};

export const deletePatient = (id) => {
  patients.update(list => list.filter(p => p.id !== id));
  selectedPatientId.update(curr => curr === id ? null : curr);
  showToast('患者已删除', 'warning');
};

export const clearAllPatients = () => {
  patients.set([]);
  selectedPatientId.set(null);
  showToast('所有患者已清空', 'warning');
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

// ... (existing imports)

export const selectedDuration = writable(30);

export const scheduleSettings = writable({
  startHour: 7,
  endHour: 20,
  timeStep: 30
});
persist('rehab_settings_v1', scheduleSettings, { startHour: 7, endHour: 20, timeStep: 30 });

export const paintSlot = (time, specificDetails = null) => {
  let patient;
  let duration;

  if (specificDetails?.patient) {
    patient = specificDetails.patient;
    duration = specificDetails.duration || (Number(patient.duration) || 30);
  } else {
    const sPatientId = get(selectedPatientId);
    if (!sPatientId) return showToast('请先选择一个患者', 'error');

    const allPatients = get(patients);
    patient = allPatients.find(p => p.id === sPatientId);
    if (!patient) return;

    duration = get(selectedDuration) || (Number(patient.duration) || 30);
  }

  const { timeStep } = get(scheduleSettings);
  const date = get(currentDate);
  const sch = get(schedule);
  const daySchedule = sch[date] || {};

  const slotsNeeded = Math.ceil(duration / timeStep);
  const timesToReserve = [];
  let checkTime = time;

  // 1. Validation Phase
  for (let i = 0; i < slotsNeeded; i++) {
    if (daySchedule[checkTime]) {
      return showToast(`时间段 ${checkTime} 已被占用`, 'error');
    }
    // Optional: check bounds (e.g. beyond 20:00 or endHour)
    // We'll skip bound check for now or rely on grid not showing them, 
    // but reserving invisible slots is fine.

    timesToReserve.push(checkTime);
    checkTime = addMinutes(checkTime, timeStep);
  }

  // 2. Commit Phase
  schedule.update(s => {
    const newDay = { ...(s[date] || {}) };

    timesToReserve.forEach((t, index) => {
      if (index === 0) {
        newDay[t] = {
          patientId: patient.id,
          isHead: true,
          duration: duration
        };
      } else {
        newDay[t] = {
          patientId: patient.id,
          isHead: false,
          duration: duration,
          headTime: time
        };
      }
    });

    return { ...s, [date]: newDay };
  });

  showToast('预约成功', 'success');
};

export const clearSlot = (date, time) => {
  const { timeStep } = get(scheduleSettings);

  schedule.update(s => {
    const day = { ...(s[date] || {}) };
    const slot = day[time];
    if (!slot) return s;

    let headTime = time;
    if (!slot.isHead && slot.headTime) {
      headTime = slot.headTime;
    }

    // Find the head slot to get duration
    const headSlot = day[headTime];
    if (!headSlot) {
      // Orphaned tail? just delete current
      delete day[time];
      return { ...s, [date]: day };
    }

    // Calculate how many slots this patient takes
    // Note: If we changed settings after booking, this might be tricky.
    // Ideally we assume the slot structure is consistent with current settings OR 
    // we trace forward using duration.
    // If duration is stored, we can calculate slots.

    // Better approach: Calculate slots based on duration and CURRENT timeStep? 
    // No, if I booked 60 mins on 30 min step (2 slots). Now step is 60.
    // head (00:00). Next is 01:00.
    // 00:30 is "hidden" in grid but exists in data.
    // We should delete based on DURATION.

    // Actually, we can just walk forward from headTime by original step size? No we don't know it.
    // But we know standard steps are 15, 30, 60.
    // Let's just delete the head and any slots that point to it?
    // Scanning the whole day is expensive but safe.
    // Scanning forward by some small increment (e.g. 5 mins?)

    // Optimized approach:
    // User clicked `time`. We found `headTime`.
    // We delete `headTime`.
    // We also need to delete any slot where `slot.headTime === headTime`.
    // Since we object is keyed by time, we can filter.

    Object.keys(day).forEach(t => {
      if (day[t].headTime === headTime || t === headTime) {
        delete day[t];
      }
    });

    return { ...s, [date]: day };
  });
  showToast('已清除', 'info');
};

export const checkYesterdayData = () => {
  const date = get(currentDate);
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  const yesterday = d.toLocaleDateString('en-CA');
  const allSch = get(schedule);
  return !!allSch[yesterday];
};

export const copyYesterday = () => {
  const date = get(currentDate);
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  const yesterday = d.toLocaleDateString('en-CA');

  const allSch = get(schedule);

  if (allSch[yesterday]) {
    schedule.update(s => ({
      ...s,
      [date]: JSON.parse(JSON.stringify(allSch[yesterday])) // Deep copy
    }));
    showToast('已复制昨日安排', 'success');
  } else {
    showToast('昨日无数据', 'warning');
  }
};

export const clearDay = () => {
  const date = get(currentDate);
  schedule.update(s => {
    const newSch = { ...s };
    delete newSch[date];
    return newSch;
  });
  showToast('本日安排已清空', 'success');
};
