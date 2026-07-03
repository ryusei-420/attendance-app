import "../../styles/attendance-log.css";

const AttendanceLog = ({ logs }) => {
  if (logs === true) {
    return (
      <div className="attendance-log attendance-log--empty">
        <p>今月の勤怠データはまだありません</p>
      </div>
    );
  }

  return (
    <div className="attendance-log">
      <h2 className="attendance-log__title">今月の勤怠記録</h2>
      <div className="attendance-log__table-wrap">
        <table className="attendance-log__table">
          <thead>
            <tr>
              <th>日付</th>
              <th>出勤</th>
              <th>退勤</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((entry) => (
              <tr key={entry.id}>
                <td>{new Date(entry.shift.day.toDate()).toLocaleDateString("ja-JP")}</td>
                <td>
                  {new Date(entry.shift.type.clockIn.toDate()).toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>
                  {new Date(entry.shift.type.clockOut.toDate()).toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceLog;
