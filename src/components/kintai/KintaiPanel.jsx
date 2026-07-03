import { useState, useEffect } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import {
  isDemoUser,
  demoWorkStorage,
  addDemoLog,
  toDemoTimestamp,
} from "../../utils/demoMode";
import "../../styles/kintai.css";

const statusLabels = {
  working: "勤務中",
  onBreak: "休憩中",
};

const KintaiPanel = ({ user }) => {
  const [workStatus, setWorkStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isDemo = isDemoUser(user);

  useEffect(() => {
    setWorkStatus(demoWorkStorage.getWorkStatus());
  }, []);

  const startDuty = () => {
    demoWorkStorage.setOnDuty(String(Date.now()));
    demoWorkStorage.setWorkStatus("working");
    demoWorkStorage.removeBreakData();
    demoWorkStorage.removeOnBreak();
    setWorkStatus("working");
    setMessage("出勤しました");
  };

  const startBreak = () => {
    demoWorkStorage.setOnBreak(String(Date.now()));
    demoWorkStorage.setWorkStatus("onBreak");
    setWorkStatus("onBreak");
    setMessage("休憩を開始しました");
  };

  const endBreak = () => {
    const breakData = demoWorkStorage.getBreakData();
    const startBreakTime = Number(demoWorkStorage.getOnBreak());
    const entry = { startBreak: startBreakTime, endBreak: Date.now() };
    const updated = breakData === null ? [entry] : [...breakData, entry];

    demoWorkStorage.setBreakData(updated);
    demoWorkStorage.setWorkStatus("working");
    demoWorkStorage.removeOnBreak();
    setWorkStatus("working");
    setMessage("業務を再開しました");
  };

  const endDuty = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const startDutyTime = Number(demoWorkStorage.getOnDuty());
    const breakData = demoWorkStorage.getBreakData();
    const endDutyTime = Date.now();
    const clockInDate = new Date(startDutyTime);

    try {
      if (isDemo) {
        addDemoLog({
          shift: {
            day: toDemoTimestamp(
              new Date(clockInDate.getFullYear(), clockInDate.getMonth(), clockInDate.getDate())
            ),
            type: {
              clockIn: toDemoTimestamp(new Date(startDutyTime)),
              clockOut: toDemoTimestamp(new Date(endDutyTime)),
            },
          },
          logName: "attendanceLog",
          start: clockInDate.toLocaleDateString(),
          user: user.uid,
          breakData,
        });
      } else {
        await addDoc(collection(db, "kintaidata", user.uid, "logs"), {
          shift: {
            day: Timestamp.fromDate(
              new Date(clockInDate.getFullYear(), clockInDate.getMonth(), clockInDate.getDate())
            ),
            type: {
              clockIn: Timestamp.fromDate(new Date(startDutyTime)),
              clockOut: Timestamp.fromDate(new Date(endDutyTime)),
            },
          },
          logName: "attendanceLog",
          start: clockInDate.toLocaleDateString(),
          user: user.uid,
          breakData,
        });
      }

      demoWorkStorage.clearSession();
      setWorkStatus(null);
      setMessage("退勤しました。お疲れ様でした！");
    } catch (error) {
      console.error(error);
      setMessage("退勤の保存に失敗しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kintai-panel">
      <div className="kintai-card">
        <h2 className="kintai-title">勤怠打刻</h2>

        {isDemo && <p className="kintai-demo-note">デモモード — 打刻データはブラウザ内に保存されます</p>}

        {workStatus && (
          <span className={`kintai-status kintai-status--${workStatus}`}>
            {statusLabels[workStatus]}
          </span>
        )}

        {message && <p className="kintai-message">{message}</p>}

        <div className="kintai-actions">
          {workStatus === null && (
            <button type="button" className="btn btn-primary btn-large" onClick={startDuty}>
              出勤
            </button>
          )}

          {workStatus === "working" && (
            <>
              <button
                type="button"
                className="btn btn-danger btn-large"
                disabled={loading}
                onClick={endDuty}
              >
                {loading ? "保存中..." : "退勤"}
              </button>
              <button type="button" className="btn btn-secondary btn-large" onClick={startBreak}>
                休憩
              </button>
            </>
          )}

          {workStatus === "onBreak" && (
            <button type="button" className="btn btn-primary btn-large" onClick={endBreak}>
              業務に戻る
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KintaiPanel;
