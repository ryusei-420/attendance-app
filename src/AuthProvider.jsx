import { createContext,useState,useEffect,useContext} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import "./index.css";

export const AuthContext = createContext(null);

const AuthProvider = ({children}) => {
    

    const [user,setUser] = useState("loading");

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (current) => {

            setUser(current);
            
        });
        return unSubscribe;

    },[]);


    return(
        <AuthContext.Provider value={user}>
            <div className="app-screen">{children}</div>
        </AuthContext.Provider>
    )
}

export  const useAuth  = () => useContext(AuthContext); 
export default AuthProvider;