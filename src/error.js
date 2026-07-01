const handleError = ( errorCode, setter ) => {

    const errorList = {
        "auth/email-already-in-use" : () => setter("このメールアドレスは既に使用されています"),
        "auth/invalid-email" : () => setter("メールアドレスの形式が正しくありません"),
        "auth/weak-password" : () => setter("パスワードは6文字以上で入力してください"),
        "auth/user-not-found" : () => setter("ユーザーが存在しません"),
        "auth/invalid-credential" : () => setter("メールアドレスまたはパスワードが正しくありません"),
        "auth/wrong-password" : () => setter("パスワードが正しくありません"),
        "auth/too-many-requests" : () => setter("上限に達したました"),
        "auth/network-request-failed" : () => setter("ネットワークが不安定です"),
    }

    errorList[errorCode] ? errorList[errorCode]() : (console.log(errorCode), setMessage("予期せぬエラーが発生しました"))

}



export default handleError;