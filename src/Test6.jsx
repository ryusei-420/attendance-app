import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "./firebase/firebase";

const Test6 = () => {
    const user = useAuth();

    const [userName, setUserName] = useState(null);

    
    return userName;
}

export default Test6;