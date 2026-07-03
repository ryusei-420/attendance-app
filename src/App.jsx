import { Routes, Route } from "react-router-dom";
import RegistrationPage from "./components/auth/RegistrationPage";
import EmailNotVerified from "./components/auth/EmailNotVerified";
import Dashboard from "./components/dashboard/Dashboard";
import { useAuth } from "./components/auth/AuthContext";
import Loading from "./components/common/Loading";

function App() {
  const { user } = useAuth();

  if (user === "loading") return <Loading />;
  if (user === null) return <RegistrationPage />;
  if (!user.emailVerified) return <EmailNotVerified />;

  return (
    <Routes>
      <Route path="/" element={<Dashboard user={user} />} />
    </Routes>
  );
}

export default App;
