import Loading from "../common/Loading";
import KintaiPanel from "../kintai/KintaiPanel";
import AttendanceLog from "../kintai/AttendanceLog";
import AccountForm from "../forms/AccountForm";

const ScreenRouter = ({ screenMode, user, onDemoUserNameChange }) => {
  if (screenMode === null) return <Loading />;

  if (screenMode === true || screenMode?.[0]?.logName === "attendanceLog") {
    return <AttendanceLog logs={screenMode} />;
  }

  if (screenMode === "kintai") return <KintaiPanel user={user} />;
  if (screenMode === "changeName") {
    return (
      <AccountForm
        formMode={screenMode}
        uid={user.uid}
        user={user}
        onDemoUserNameChange={onDemoUserNameChange}
      />
    );
  }
  if (screenMode === "changeEmail") {
    return <AccountForm formMode={screenMode} user={user} onDemoUserNameChange={onDemoUserNameChange} />;
  }
  if (screenMode === "changePassword") {
    return <AccountForm formMode={screenMode} user={user} onDemoUserNameChange={onDemoUserNameChange} />;
  }
  if (screenMode === "deleteAccount") {
    return <AccountForm formMode={screenMode} user={user} onDemoUserNameChange={onDemoUserNameChange} />;
  }
  if (screenMode === "logout") {
    return <AccountForm formMode={screenMode} user={user} onDemoUserNameChange={onDemoUserNameChange} />;
  }

  return <Loading />;
};

export default ScreenRouter;
