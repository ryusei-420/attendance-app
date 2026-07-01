import { sendEmailVerification } from "firebase/auth";
import { useAuth } from "./AuthProvider";
import { useState,  } from "react";
import { doc, setDoc} from "firebase/firestore";
import "./EmailNotVerified.css"
import handleError from "./error";
import { useNavigate } from "react-router-dom" 

const EmailNotVerified = () => {

    const user = useAuth();

    const [message, setMessage] = useState("送信ボタンを押して認証メールを送信してください");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [sent,setSent] = useState(false);
    const [inputUserName,setInputUserName] = useState("");
    
    const sendEmail = async () => {

        setLoading(true);

        try {
            await sendEmailVerification(user);
            setMessage("確認メールを送信しました。\nメール内のリンクをクリックして手続きを完了してください。\n");
            setSent(true);
        } catch (error) {
            handleError( error.code, setErrorMessage);
        } finally {
            setLoading(false);
        }
    }



    const create = async (e) => {
        e.preventDefault();
        setLoading(true);
        const ref = doc(db,"users",user.uid);

        try {

            await setDoc(ref,{
                userName:inputUserName,
                uid:user.uid
            });
            setInputUserName("");
            
        } catch (error){
            console.log(error.code);
        } finally {
            setLoading(true);
        }
    } 

    window.addEventListener("focus", () => {
        console.log("focus");
        user.reload();
        location.reload();
    })



    return (
        <div className="not-verified-page" >
            <div className="conteiner">
                <p className="message">{message}</p>
                { !sent && <button  className="send-button" onClick={sendEmail} disabled={loading} >送信</button>}
                {sent && 
                <>
                    <p className="sub-message">
                        メールが届かない場合<button className="resend-button" onClick={sendEmail}>こちら</button>を押してください
                    </p>
                </>
                }
            </div> 

        </div>
    )
}

export default EmailNotVerified;