import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import handleError from "../../utils/errorHandler";
import "../../styles/auth.css";

const RegistrationPage = () => {
  const { user, enterDemoMode } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("register");
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setPassword("");
      setEmail("");
    } catch (error) {
      handleError(error.code, setMessage);
    } finally {
      setLoading(false);
    }
  };

  if (user !== null) return null;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="auth-card__logo">勤</span>
          <h1 className="auth-card__title">{mode === "login" ? "ログイン" : "アカウント登録"}</h1>
          <p className="auth-card__subtitle">勤怠管理アプリへようこそ</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__label">
            メールアドレス
            <input
              placeholder="user1234@example.com"
              type="email"
              className="auth-form__input"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label className="auth-form__label">
            パスワード
            <div className="auth-form__password-row">
              <input
                type={showPassword ? "text" : "password"}
                className="auth-form__input"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                className="auth-form__toggle-password"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "隠す" : "表示"}
              </button>
            </div>
          </label>

          {message !== null && <p className="auth-form__error">{message}</p>}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "処理中..." : "決定"}
          </button>

          <p className="auth-form__switch">
            {mode === "login" ? "アカウントをお持ちでない方は" : "すでにアカウントをお持ちの方は"}
            <button
              type="button"
              className="auth-form__switch-link"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setMessage(null);
              }}
            >
              こちら
            </button>
          </p>
        </form>

        <div className="auth-demo">
          <p className="auth-demo__label">登録なしで試したい方</p>
          <button type="button" className="btn btn-secondary btn-block" onClick={enterDemoMode}>
            デモで試す
          </button>
          <p className="auth-demo__note">データはブラウザ内のみ保存され、本番環境には反映されません</p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
