import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { AuthContext } from "./AuthContext";
import { DEMO_USER, initDemoData, clearDemoData } from "../../utils/demoMode";

const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState("loading");
  const [isDemoMode, setIsDemoMode] = useState(
    () => sessionStorage.getItem("demoMode") === "true"
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const enterDemoMode = () => {
    initDemoData();
    sessionStorage.setItem("demoMode", "true");
    setIsDemoMode(true);
  };

  const exitDemoMode = () => {
    sessionStorage.removeItem("demoMode");
    clearDemoData();
    setIsDemoMode(false);
  };

  const user = isDemoMode ? DEMO_USER : firebaseUser;

  return (
    <AuthContext.Provider value={{ user, isDemoMode, enterDemoMode, exitDemoMode }}>
      <div className="app-screen">{children}</div>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
