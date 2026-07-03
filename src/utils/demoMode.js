export const DEMO_USER = {
  uid: "demo-user",
  email: "demo@example.com",
  emailVerified: true,
  isDemo: true,
};

export const isDemoUser = (user) => user?.isDemo === true;

const STORAGE_KEYS = {
  userName: "demo_userName",
  logs: "demo_logs",
  workStatus: "demo_workStatus",
  onDuty: "demo_onDuty",
  onBreak: "demo_onBreak",
  breakData: "demo_breakData",
};

export const toDemoTimestamp = (date) => ({
  toDate: () => (date instanceof Date ? date : new Date(date)),
});

const serializeLog = (log) => ({
  ...log,
  shift: {
    day: log.shift.day.toDate().toISOString(),
    type: {
      clockIn: log.shift.type.clockIn.toDate().toISOString(),
      clockOut: log.shift.type.clockOut.toDate().toISOString(),
    },
  },
});

const deserializeLog = (log) => ({
  ...log,
  shift: {
    day: toDemoTimestamp(log.shift.day),
    type: {
      clockIn: toDemoTimestamp(log.shift.type.clockIn),
      clockOut: toDemoTimestamp(log.shift.type.clockOut),
    },
  },
});

export const getDemoUserName = () =>
  localStorage.getItem(STORAGE_KEYS.userName) || "デモユーザー";

export const setDemoUserName = (name) => {
  localStorage.setItem(STORAGE_KEYS.userName, name);
};

export const getDemoLogs = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.logs) || "[]");
    return raw.map(deserializeLog);
  } catch {
    return [];
  }
};

const saveDemoLogs = (logs) => {
  localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(logs.map(serializeLog)));
};

export const addDemoLog = (log) => {
  const logs = getDemoLogs();
  logs.push({ id: `demo-${Date.now()}`, ...log });
  saveDemoLogs(logs);
};

export const generateDemoSampleLogs = () => {
  const now = new Date();
  const logs = [];

  for (let day = 1; day <= now.getDate(); day += 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    if (date.getDay() === 0 || date.getDay() === 6) continue;

    logs.push({
      id: `demo-sample-${day}`,
      shift: {
        day: toDemoTimestamp(new Date(now.getFullYear(), now.getMonth(), day, 0, 0, 0, 0)),
        type: {
          clockIn: toDemoTimestamp(new Date(now.getFullYear(), now.getMonth(), day, 8, 30)),
          clockOut: toDemoTimestamp(new Date(now.getFullYear(), now.getMonth(), day, 17, 30)),
        },
      },
      logName: "attendanceLog",
      start: date.toLocaleDateString(),
      user: DEMO_USER.uid,
    });
  }

  saveDemoLogs(logs);
};

export const getDemoLogsForMonth = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleDateString();

  const logs = getDemoLogs().filter(
    (entry) => entry.logName === "attendanceLog" && entry.start >= start && entry.start < end
  );

  if (logs.length === 0) return true;

  return logs.sort((a, b) => {
    const dayDiff = a.shift.day.toDate() - b.shift.day.toDate();
    if (dayDiff !== 0) return dayDiff;
    return a.shift.type.clockIn.toDate() - b.shift.type.clockIn.toDate();
  });
};

export const initDemoData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.userName)) {
    localStorage.setItem(STORAGE_KEYS.userName, "デモユーザー");
  }
  if (getDemoLogs().length === 0) {
    generateDemoSampleLogs();
  }
};

export const clearDemoData = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
};

export const demoWorkStorage = {
  getWorkStatus: () => localStorage.getItem(STORAGE_KEYS.workStatus),
  setWorkStatus: (value) => localStorage.setItem(STORAGE_KEYS.workStatus, value),
  removeWorkStatus: () => localStorage.removeItem(STORAGE_KEYS.workStatus),
  getOnDuty: () => localStorage.getItem(STORAGE_KEYS.onDuty),
  setOnDuty: (value) => localStorage.setItem(STORAGE_KEYS.onDuty, value),
  removeOnDuty: () => localStorage.removeItem(STORAGE_KEYS.onDuty),
  getOnBreak: () => localStorage.getItem(STORAGE_KEYS.onBreak),
  setOnBreak: (value) => localStorage.setItem(STORAGE_KEYS.onBreak, value),
  removeOnBreak: () => localStorage.removeItem(STORAGE_KEYS.onBreak),
  getBreakData: () => JSON.parse(localStorage.getItem(STORAGE_KEYS.breakData) || "null"),
  setBreakData: (value) => localStorage.setItem(STORAGE_KEYS.breakData, JSON.stringify(value)),
  removeBreakData: () => localStorage.removeItem(STORAGE_KEYS.breakData),
  clearSession: () => {
    demoWorkStorage.removeWorkStatus();
    demoWorkStorage.removeOnDuty();
    demoWorkStorage.removeOnBreak();
    demoWorkStorage.removeBreakData();
  },
};
