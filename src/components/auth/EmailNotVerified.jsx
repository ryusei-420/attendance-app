import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import handleError from "../../utils/errorHandler";
import "../../styles/auth.css";

const EmailNotVerified = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("送信ボタンを押して認証メールを送信してください");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [sent, setSent] = useState(false);

  const sendEmail = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      await sendEmailVerification(user);
      setMessage(
        "確認メールを送信しました。\nメール内のリンクをクリックして手続きを完了してください。"
      );
      setSent(true);
    } catch (error) {
      handleError(error.code, setErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleFocus = () => {
      user.reload();
      location.reload();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user]);

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--verify">
        <div className="auth-card__header">
          <span className="auth-card__logo">✉</span>
          <h1 className="auth-card__title">メール認証</h1>
        </div>

        <p className="auth-verify__message">{message}</p>
        {errorMessage && <p className="auth-form__error">{errorMessage}</p>}

        {!sent && (
          <button type="button" className="btn btn-primary btn-block" onClick={sendEmail} disabled={loading}>
            {loading ? "送信中..." : "認証メールを送信"}
          </button>
        )}

        {sent && (
          <p className="auth-verify__resend">
            メールが届かない場合は
            <button type="button" className="auth-form__switch-link" onClick={sendEmail}>
              こちら
            </button>
            から再送信できます
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailNotVerified;
