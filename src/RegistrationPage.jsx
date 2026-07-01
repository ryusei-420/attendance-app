import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import "./RegistrationPage.css";
import handleError from "./error";

const RegistrationPage = () => {

    const user = useAuth();


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode,setMode] = useState("register");
    const [message, setMessage] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    

    const handleSubmit =  async (e) => {
        e.preventDefault();
        setLoading(true);


        
        const login = async () => {
            setLoading(true);
           try {
                await signInWithEmailAndPassword(auth,email,password);
                setPassword("");
                setEmail("");
            } catch (error){
                handleError(error.code);
            } finally {
                setLoading(false);
            }
        }

        const createUser = async () => {
            setLoading(true);
           try {
                await createUserWithEmailAndPassword(auth,email,password);
                setPassword("");
                setEmail("");
            } catch (error){
                handleError(error.code);
            } finally {
                setLoading(false);
            }
        }

        mode === "login" ? login() : createUser();

    }

    if ( user === null ) return  (
        <div className="registar-form">
           <form onSubmit={handleSubmit}>
                <p className="mode-name">{mode === "login" ? "ログイン" : "アカウント登録"}</p>
                <label>メールアドレス:
                    <input
                        placeholder="user1234@example.com"
                        type="email"
                        className="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <div className="input-password">
                    <label>パスワード:
                        <input 
                            type={showPassword ? "text": "password"}
                            className="password" 
                            value={password}
                            onChange={((e) => setPassword(e.target.value))}
                        />
                        <button
                            className="show-password"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}>{showPassword ? "隠す" : "表示" }
                        </button>
                    </label>
                </div>
                {message !== null && <p className="error-message" > {`※${message}`}</p>}
                <button type="submit" className="submit-button" disabled={loading}>決定</button>
                <p className="select-mode-name" >{ mode === "login" ? "アカウント登録は" : "ログインは"}
                    <button type="button" className="select-mode" onClick={(e) => {setMode(mode === "login" ? "register":"login")}}>
                    こちら</button>
                </p>
           </form>
        </div>
    )

}

export default RegistrationPage;