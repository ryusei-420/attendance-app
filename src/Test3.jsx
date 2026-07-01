import Loading from "./loading";
import Test11 from "./Test11";
import Test8 from "./Test8";
import FormComponent from "./FormComponent.jsx";

const Test3 = ({screenMode,user}) => {


    if (screenMode === null) return <Loading/>
    if (screenMode === true) return <Test8 snapShot={screenMode}/>
    if (screenMode === "kintai") return <Test11 user={user}/> 
    if (screenMode[0].logName === "attendanceLog") return <Test8 snapShot={screenMode}/>
    if (screenMode === "changeName") return <FormComponent formMode={screenMode} uid={user.uid}/>
    if (screenMode === "changeEmail") return <FormComponent formMode={screenMode} user={user}/>
    if (screenMode === "changePassword") return <FormComponent formMode={screenMode} user={user}/>
    if (screenMode === "deleteAccount") return <FormComponent formMode={screenMode} user={user}/>
    if (screenMode === "logout") return <FormComponent formMode={screenMode} user={user}/>
    if (screenMode === "log") return 

}

export default Test3;