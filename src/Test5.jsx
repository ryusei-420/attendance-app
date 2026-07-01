import { useState, useEffect } from "react";
import { db } from "./firebase/firebase";
import { doc, onSnapshot, deleteDoc, collection,getDocs } from "firebase/firestore";
import "./sumple.css";
import getLogs from "./Test10";
import Loading from "./loading";
import Test9 from "./Test9";
import Test3 from "./Test3";

const Test5 = ({user}) => {
    
    
    const [userName, setUserName] = useState(null);
    const [showPanel, setShowPanell] = useState(false);
    const [mode, setMode] = useState("kintai");

    useEffect(() => {
        const ref = doc(db, "users", user.uid);
        const unsub = onSnapshot(ref,(snap) => {
            if (!snap.exists()) return setUserName("名称未設定");
            const data = snap.data();
            setUserName(data.userName);
            
        });
        return unsub; 
    },[]);

    const logMode = async () => {

        try {

            const logs = await getLogs(user);
            setMode(logs);

        } catch (error) {

            console.log(error.code);

        }
    }

    if ( userName === null ) return <Loading/>

    return ( 
        <>
            <button className="user-name" onClick={() => setShowPanell(showPanel? false:true)}>{userName}</button>
            <div className="screen">
                {showPanel && 
                    <div className="panel">
                        <button onClick={() => setMode("kintai")}>打刻</button>
                        <button onClick={() => setMode("changeName")}>アカウント名変更</button>
                        <button onClick={() => setMode("changeEmail")}>メールアドレス変更</button>
                        <button onClick={() => setMode("changePassword")}>パスワード変更</button>
                        <button onClick={() => setMode("deleteAccount")}>アカウント消去</button>
                        <button onClick={() => setMode("logout")}>ログアウト</button>
                        <button onClick={logMode}>勤怠記録</button>
                        <button onClick={() => Test9(user)}>ログ生成</button>
                    </div>
                }
                <div className="mein-screen">
                    <Test3 screenMode={mode} user={user}/>
                </div>
            </div>
        </>
    )
}

export default Test5;