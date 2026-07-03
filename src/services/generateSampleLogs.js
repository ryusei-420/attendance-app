import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { isDemoUser, generateDemoSampleLogs } from "../utils/demoMode";

const generateSampleLogs = (user) => {
  if (isDemoUser(user)) {
    generateDemoSampleLogs();
    return;
  }

  const createLogs = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const days = (startOfNextMonth - startOfMonth) / (1000 * 60 * 60 * 24);

    for (let day = 1; day <= days; day += 1) {
      try {
        await addDoc(collection(db, "kintaidata", user.uid, "logs"), {
          shift: {
            day: Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth(), day, 0, 0, 0, 0)),
            type: {
              clockIn: Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth(), day, 8, 0)),
              clockOut: Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth(), day, 17, 0)),
            },
          },
          logName: "attendanceLog",
          start: new Date(now.getFullYear(), now.getMonth(), day).toLocaleDateString(),
          user: user.uid,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  createLogs();
};

export default generateSampleLogs;
