const errorMessages = {
  "auth/email-already-in-use": "このメールアドレスは既に使用されています",
  "auth/invalid-email": "メールアドレスの形式が正しくありません",
  "auth/weak-password": "パスワードは6文字以上で入力してください",
  "auth/user-not-found": "ユーザーが存在しません",
  "auth/invalid-credential": "メールアドレスまたはパスワードが正しくありません",
  "auth/wrong-password": "パスワードが正しくありません",
  "auth/too-many-requests": "試行回数の上限に達しました",
  "auth/network-request-failed": "ネットワークが不安定です",
};

const handleError = (errorCode, setter) => {
  if (errorMessages[errorCode]) {
    setter(errorMessages[errorCode]);
    return;
  }

  console.error(errorCode);
  setter("予期せぬエラーが発生しました");
};

export default handleError;
