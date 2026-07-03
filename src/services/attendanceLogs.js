import { query, collection, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { isDemoUser, getDemoLogsForMonth } from "../utils/demoMode";

const getMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleDateString();
  return { start, end };
};

const getLogs = async (user) => {
  if (isDemoUser(user)) {
    return getDemoLogsForMonth();
  }

  const { start, end } = getMonthRange();

  const logsQuery = query(
    collection(db, "kintaidata", user.uid, "logs"),
    where("logName", "==", "attendanceLog"),
    where("start", ">=", start),
    where("start", "<", end),
    orderBy("shift.day"),
    orderBy("shift.type.clockIn"),
    orderBy("shift.type.clockOut")
  );

  try {
    const snapshot = await getDocs(logsQuery);
    if (snapshot.empty) return true;

    return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
  } catch (error) {
    console.error(error.code);
    return true;
  }
};

export default getLogs;
