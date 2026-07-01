import { setDoc, updateDoc, doc, collection, getDocs, deleteDoc } from "firebase/firestore";
import {
    EmailAuthProvider, verifyBeforeUpdateEmail, reauthenticateWithCredential, updatePassword, deleteUser, signOut
} from "firebase/auth";
import { auth } from "./firebase/firebase";
import { useState } from "react";
import { db } from "./firebase/firebase";
import "./panel.css";

const FormComponent = ({uid,formMode,user}) => {

    const [ value, setValue ] = useState("");
    const [ secondValue, setSecondValue ] = useState("");
    const [isReauthenticated, setIsReauthenticated] = useState(false);
    const [ screenState, setScreenState] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUserName = async (e) => {
        e.preventDefault();
        setLoading(true);

        const ref = doc( db,"users",uid);

        const updateDate = {
            userName:value,
        }

        const setDate = {
            userName:value,
            uid:uid
        }

        try {

            formMode === "名称未設定" ? await updateDoc(ref,updateDate) : await setDoc(ref,setDate);
            setValue("");
            setScreenState(true);

        } catch (error) {

            console.log(error.code);

        } finally {

            setLoading(true);

        }
        
    }

    const changeEmail = async (e) => {

        e.preventDefault();
        setLoading(true);

        const cred = isReauthenticated? false : EmailAuthProvider.credential(value,secondValue);

        try {

            isReauthenticated? await verifyBeforeUpdateEmail(user,value) : await reauthenticateWithCredential(user,cred);
            setIsReauthenticated(isReauthenticated? false : true );
            setValue("");
            setSecondValue("");

        } catch(error) {

            console.log(error.code);

        } finally {

            setLoading(false);

        }

    }

    const changePassword = async (e) => {

        e.preventDefault();
        setLoading(true);

        const cred = isReauthenticated? null : EmailAuthProvider.credential(value,secondValue);
    
        try {
            isReauthenticated? await updatePassword(user,value) : await reauthenticateWithCredential(user,cred);
            setIsReauthenticated(isReauthenticated? false : true );
            setValue("");
            setSecondValue("");
        } catch (error) {
            console.log(error.code);
        } finally {
            setLoading(false);
        }

    }

    const deleteDate = async () => {

        try {

           const snapshots = await getDocs(collection(db,"kintaidata",user.uid,"logs"));
            deleteDoc(doc(db,"users",user.uid));
           await Promise.all(snapshots.docs.map( async (docItem) =>  {
                await deleteDoc(docItem.ref);
           }));
           await deleteUser(user);


        } catch (error) {

            console.log(error.code);
            
        }
    }

    const deleteAccount = async (e)  =>  {

        e.preventDefault();
        setLoading(true);

        const cred = isReauthenticated? null : EmailAuthProvider.credential(value,secondValue);


        try {

            isReauthenticated? await deleteDate() : await reauthenticateWithCredential(user,cred);
            setIsReauthenticated(isReauthenticated? false : true );
            setSecondValue("");

        } catch (error) {

            console.log(error.code);

        } finally {

            setLoading(false);

        }
    }

    const logOut = async (e) => {

        e.preventDefault();
        setLoading(true);

        try {
            await signOut(auth);
        } catch (error) {
            console.log(error.code);
        } finally {
            setLoading(false);
        }
    }

    
    if (formMode === "changeName") return (

        <form onSubmit={handleUserName} className="change-name">
            <p className="mode-title">アカウント名変更</p>
            <label htmlFor={formMode}>新しい名前
                <input id={formMode}  name={formMode} type="text" value={value} onChange={(e) => setValue(e.target.value)}/>
            </label>
            <button type="submit">決定</button>
        </form>

    )


    if (formMode === "changeEmail" ) return (  
        <form onSubmit={changeEmail} className="change-email">
            <label>Email
                <input value={value} onChange={(e) => setValue(e.target.value)}/>
            </label>
            {!isReauthenticated && <label>password
                <input value={secondValue} onChange={ (e) => setSecondValue(e.target.value)}/>
            </label>}
            <button disabled={loading} type="submit">決定</button>
        </form>
    )

    if (formMode === "changePassword") return (
        <form onSubmit={changePassword} className="change-password">
            <label>Email
                <input value={value} onChange={(e) => setValue(e.target.value)}/>
            </label>
            {!isReauthenticated && 
                <label>
                    <input value={secondValue} onChange={(e) => setSecondValue(e.target.value)} />
                </label>
            }
            <button type="submit" disabled={loading}>決定</button>
        </form>
    )

    if (formMode === "deleteAccount") return (
        <form onSubmit={deleteAccount}>
            {!isReauthenticated && 
                <>
                    <label>Email
                        <input value={value} onChange={(e) => setValue(e.target.value)}/>
                    </label>
                    <label>password
                        <input value={secondValue} onChange={(e) => setSecondValue(e.target.value)}/>
                    </label>
                </>
            }
            <button type="submit" disabled={loading}>{isReauthenticated? "消去する" : "決定"}</button>
        </form>
    )

    if (formMode === "logout") return (

        <button onClick={logOut}>ログアウト</button>

    )
}

export default FormComponent;