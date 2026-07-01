import { useState, useEffect } from "react";

import "./test.css";

const Test11 = ({user}) => {

    const [workStatus, setWorkStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        setWorkStatus(localStorage.getItem("workStatus"));

    },[]);

    const  handleWork = async (e) => {

        e.preventDefault();

        try {

            await endDuty2(user);

        } catch(error) {

            console.log(error.code);

        }

    }


    const startDuty2 = () => {

        localStorage.setItem("clockIn",Date.now());
        localStorage.setItem("workStatus","working");
        setWorkStatus("working");
    
    }


    const startBreak2 = () => {

        localStorage.setItem("onBreak",Date.now());
        localStorage.setItem("workStatus","onBreak")
        setWorkStatus("break");

    }

    const endBreak2 = () => {
    
        
        const breakData = JSON.parse(localStorage.getItem("breakData"));
        const startBreakTime = Number(localStorage.getItem("onBreak"));
        
        const data = { startBreak:startBreakTime, endBreak:Date.now() };
    
        if ( breakData === null ) {
    
            localStorage.setItem("breakData", JSON.stringify([data]));
    
        } else {
    
            breakData.push(data);
            localStorage.setItem("breakData",JSON.stringify(breakData));
    
        }
    
        localStorage.setItem("workStatus","working");
        localStorage.removeItem("onBreak");
        setWorkStatus("working");
    
    }

    const endDuty2 = async ( user ) => {

    
        const startDutyTime =  Number(localStorage.getItem("onDuty"));
        const breakData = JSON.parse(localStorage.getItem("breakData"));
        const endDutyTime = Date.now();

        // const ref = collection(db,"kintaidata",user.uid,"logs");

        const ref = null;
    
        const workData = {
    
            clockIn : startDutyTime,
            clockOut : endDutyTime,
            breakData : breakData
            
        }
    
        try {
    
            await addDoc(ref,workData);
            localStorage.removeItem("onDuty");
            localStorage.removeItem("breakData");
            localStorage.removeItem("workStatus");
            setWorkStatus(null);
    
        } catch (error) {
    
            return error;
    
        }
    
    }


    if ( workStatus === null ) return (

        <div>

            <button onClick={}>出勤</button>

        </div>

    )

    if ( workStatus === "working" ) return (
        <div>
            <button disabled={loading} onClick={handleWork}>退勤</button>
            <button onClick={() => startBreak2(setWorkStatus)}>休憩</button>
        </div>
    )

    if ( workStatus === "onBreak" ) return  (
        <div>
            <button onClick={() => endBreak2(setWorkStatus)}>業務に戻る</button>
        </div>
    )

}

export default Test11;