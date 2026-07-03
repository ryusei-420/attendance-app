import { setDoc, updateDoc, doc, collection, getDocs, deleteDoc } from "firebase/firestore";
import {
  EmailAuthProvider,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { isDemoUser, setDemoUserName } from "../../utils/demoMode";
import "../../styles/forms.css";

const AccountForm = ({ uid, formMode, user, onDemoUserNameChange }) => {
  const { exitDemoMode } = useAuth();
  const [value, setValue] = useState("");
  const [secondValue, setSecondValue] = useState("");
  const [isReauthenticated, setIsReauthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isDemo = isDemoUser(user);

  const handleUserName = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (isDemo) {
      setDemoUserName(value);
      onDemoUserNameChange?.(value);
      setValue("");
      setMessage("アカウント名を更新しました（デモ）");
      setLoading(false);
      return;
    }

    const ref = doc(db, "users", uid);

    try {
      if (formMode === "名称未設定") {
        await updateDoc(ref, { userName: value });
      } else {
        await setDoc(ref, { userName: value, uid });
      }
      setValue("");
      setMessage("アカウント名を更新しました");
    } catch (error) {
      console.error(error.code);
      setMessage("更新に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const changeEmail = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (isDemo) {
      if (isReauthenticated) {
        setMessage("メールアドレスを変更しました（デモ — 実際には保存されません）");
      } else {
        setMessage("新しいメールアドレスを入力してください（デモ）");
      }
      setIsReauthenticated(!isReauthenticated);
      setValue("");
      setSecondValue("");
      setLoading(false);
      return;
    }

    const cred = isReauthenticated ? false : EmailAuthProvider.credential(value, secondValue);

    try {
      if (isReauthenticated) {
        await verifyBeforeUpdateEmail(user, value);
        setMessage("確認メールを送信しました");
      } else {
        await reauthenticateWithCredential(user, cred);
        setMessage("新しいメールアドレスを入力してください");
      }
      setIsReauthenticated(!isReauthenticated);
      setValue("");
      setSecondValue("");
    } catch (error) {
      console.error(error.code);
      setMessage("メールアドレスの変更に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (isDemo) {
      if (isReauthenticated) {
        setMessage("パスワードを変更しました（デモ — 実際には保存されません）");
      } else {
        setMessage("新しいパスワードを入力してください（デモ）");
      }
      setIsReauthenticated(!isReauthenticated);
      setValue("");
      setSecondValue("");
      setLoading(false);
      return;
    }

    const cred = isReauthenticated ? null : EmailAuthProvider.credential(value, secondValue);

    try {
      if (isReauthenticated) {
        await updatePassword(user, value);
        setMessage("パスワードを変更しました");
      } else {
        await reauthenticateWithCredential(user, cred);
        setMessage("新しいパスワードを入力してください");
      }
      setIsReauthenticated(!isReauthenticated);
      setValue("");
      setSecondValue("");
    } catch (error) {
      console.error(error.code);
      setMessage("パスワードの変更に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const deleteUserData = async () => {
    const snapshots = await getDocs(collection(db, "kintaidata", user.uid, "logs"));
    await Promise.all(snapshots.docs.map((docItem) => deleteDoc(docItem.ref)));
    await deleteDoc(doc(db, "users", user.uid));
    await deleteUser(user);
  };

  const deleteAccount = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    if (isDemo) {
      if (isReauthenticated) {
        exitDemoMode();
      } else {
        setMessage("本当に削除する場合はもう一度ボタンを押してください（デモ）");
        setIsReauthenticated(true);
      }
      setLoading(false);
      return;
    }

    const cred = isReauthenticated ? null : EmailAuthProvider.credential(value, secondValue);

    try {
      if (isReauthenticated) {
        await deleteUserData();
      } else {
        await reauthenticateWithCredential(user, cred);
        setMessage("本当に削除する場合はもう一度ボタンを押してください");
      }
      setIsReauthenticated(!isReauthenticated);
      setSecondValue("");
    } catch (error) {
      console.error(error.code);
      setMessage("アカウントの削除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      if (isDemo) {
        exitDemoMode();
      } else {
        await signOut(auth);
      }
    } catch (error) {
      console.error(error.code);
    } finally {
      setLoading(false);
    }
  };

  const demoNotice = isDemo ? (
    <p className="account-form__demo-note">デモモード — 変更はブラウザ内のみ反映されます</p>
  ) : null;

  if (formMode === "changeName") {
    return (
      <form onSubmit={handleUserName} className="account-form">
        <h2 className="account-form__title">アカウント名変更</h2>
        {demoNotice}
        <label className="account-form__label" htmlFor="changeName">
          新しい名前
          <input
            id="changeName"
            className="account-form__input"
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </label>
        {message && <p className="account-form__message">{message}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          決定
        </button>
      </form>
    );
  }

  if (formMode === "changeEmail") {
    return (
      <form onSubmit={changeEmail} className="account-form">
        <h2 className="account-form__title">メールアドレス変更</h2>
        {demoNotice}
        <label className="account-form__label">
          {isReauthenticated ? "新しいメールアドレス" : "現在のメールアドレス"}
          <input
            className="account-form__input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </label>
        {!isReauthenticated && (
          <label className="account-form__label">
            パスワード
            <input
              className="account-form__input"
              type="password"
              value={secondValue}
              onChange={(event) => setSecondValue(event.target.value)}
            />
          </label>
        )}
        {message && <p className="account-form__message">{message}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          決定
        </button>
      </form>
    );
  }

  if (formMode === "changePassword") {
    return (
      <form onSubmit={changePassword} className="account-form">
        <h2 className="account-form__title">パスワード変更</h2>
        {demoNotice}
        <label className="account-form__label">
          {isReauthenticated ? "新しいパスワード" : "メールアドレス"}
          <input
            className="account-form__input"
            type={isReauthenticated ? "password" : "email"}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </label>
        {!isReauthenticated && (
          <label className="account-form__label">
            現在のパスワード
            <input
              className="account-form__input"
              type="password"
              value={secondValue}
              onChange={(event) => setSecondValue(event.target.value)}
            />
          </label>
        )}
        {message && <p className="account-form__message">{message}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          決定
        </button>
      </form>
    );
  }

  if (formMode === "deleteAccount") {
    return (
      <form onSubmit={deleteAccount} className="account-form account-form--danger">
        <h2 className="account-form__title">アカウント削除</h2>
        {demoNotice}
        <p className="account-form__warning">この操作は取り消せません。勤怠データもすべて削除されます。</p>
        {!isReauthenticated && !isDemo && (
          <>
            <label className="account-form__label">
              メールアドレス
              <input
                className="account-form__input"
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
            </label>
            <label className="account-form__label">
              パスワード
              <input
                className="account-form__input"
                type="password"
                value={secondValue}
                onChange={(event) => setSecondValue(event.target.value)}
              />
            </label>
          </>
        )}
        {message && <p className="account-form__message">{message}</p>}
        <button type="submit" className="btn btn-danger" disabled={loading}>
          {isReauthenticated ? "削除する" : "確認する"}
        </button>
      </form>
    );
  }

  if (formMode === "logout") {
    return (
      <div className="account-form">
        <h2 className="account-form__title">{isDemo ? "デモを終了" : "ログアウト"}</h2>
        {demoNotice}
        <p className="account-form__description">
          {isDemo ? "デモモードを終了してログイン画面に戻りますか？" : "ログアウトしますか？"}
        </p>
        <button type="button" className="btn btn-secondary" onClick={logOut} disabled={loading}>
          {isDemo ? "デモを終了" : "ログアウト"}
        </button>
      </div>
    );
  }

  return null;
};

export default AccountForm;
