import { Routes, Route, } from "react-router-dom";
import  RegistrationPage  from "./RegistrationPage";
import EmailNotVerified from "./EmailNotVerified";
import Test5 from "./Test5";
import  { useAuth }  from "./AuthProvider"
import Loading from "./loading";  

function App() {
  
  const user = useAuth();

  if ( user === "loading" )return <Loading/>
  if ( user === null ) return <RegistrationPage />
  if ( !user.emailVerified ) return <EmailNotVerified/>
  
  return (
    <Routes>
      <Route path="/" element={<Test5 user={user}/>}/>
    </Routes>
  )
}

export default App;