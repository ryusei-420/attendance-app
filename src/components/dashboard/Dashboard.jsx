import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import getLogs from "../../services/attendanceLogs";
import generateSampleLogs from "../../services/generateSampleLogs";
import { isDemoUser, getDemoUserName } from "../../utils/demoMode";
import Loading from "../common/Loading";
import ScreenRouter from "./ScreenRouter";
import "../../styles/dashboard.css";

const menuItems = [
  { id: "kintai", label: "打刻", icon: "⏱" },
  { id: "changeName", label: "アカウント名変更", icon: "✏️" },
  { id: "changeEmail", label: "メールアドレス変更", icon: "📧" },
  { id: "changePassword", label: "パスワード変更", icon: "🔒" },
  { id: "deleteAccount", label: "アカウント削除", icon: "🗑" },
  { id: "logout", label: "ログアウト", icon: "🚪" },
];

const demoMenuItems = menuItems.map((item) =>
  item.id === "logout" ? { ...item, label: "デモを終了", icon: "↩" } : item
);

const Dashboard = ({ user }) => {
  const [userName, setUserName] = useState(isDemoUser(user) ? getDemoUserName() : null);
  const [showPanel, setShowPanel] = useState(false);
  const [mode, setMode] = useState("kintai");
  const isDemo = isDemoUser(user);
  const sidebarItems = isDemo ? demoMenuItems : menuItems;

  useEffect(() => {
    if (isDemo) {
      setUserName(getDemoUserName());
      return undefined;
    }

    const ref = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap.exists()) {
        setUserName("名称未設定");
        return;
      }
      setUserName(snap.data().userName);
    });
    return unsubscribe;
  }, [user.uid, isDemo]);

  const openAttendanceLogs = async () => {
    try {
      const logs = await getLogs(user);
      setMode(logs);
      setShowPanel(false);
    } catch (error) {
      console.error(error.code);
    }
  };

  if (userName === null) return <Loading />;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header__brand">
          <span className="dashboard-header__logo">勤</span>
          <span className="dashboard-header__app-name">勤怠管理</span>
          {isDemo && <span className="dashboard-header__demo-badge">デモ</span>}
        </div>
        <button
          type="button"
          className="dashboard-header__user"
          onClick={() => setShowPanel((prev) => !prev)}
        >
          {userName}
        </button>
      </header>

      <div className="dashboard-body">
        {showPanel && (
          <aside className={`dashboard-sidebar ${showPanel ? "dashboard-sidebar--open" : ""}`}>
            <p className="dashboard-sidebar__title">メニュー</p>
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className="dashboard-sidebar__item"
                onClick={() => {
                  setMode(item.id);
                  setShowPanel(false);
                }}
              >
                <span className="dashboard-sidebar__icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
            <button type="button" className="dashboard-sidebar__item" onClick={openAttendanceLogs}>
              <span className="dashboard-sidebar__icon">📋</span>
              勤怠記録
            </button>
            {!isDemo && (
              <button
                type="button"
                className="dashboard-sidebar__item dashboard-sidebar__item--dev"
                onClick={() => generateSampleLogs(user)}
              >
                <span className="dashboard-sidebar__icon">🧪</span>
                サンプルデータ生成
              </button>
            )}
          </aside>
        )}

        <main className="dashboard-main">
          <ScreenRouter
            screenMode={mode}
            user={user}
            onDemoUserNameChange={isDemo ? setUserName : undefined}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
