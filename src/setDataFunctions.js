import { db } from "./firebase/firebase";
import { addDoc, collection } from "firebase/firestore";

export const startDuty = () => {

    const now = Date.now();
    localStorage.setItem("onDuty",String(now));
    localStorage.setItem("workStatus","working");
    setWorkStatus("working");

}

export const saveWorkDateToLocal = ( workStatus ) => {

    localStorage.setItem("onDuty")
}

export const startBreak = () => {
    const now = Date.now();
    localStorage.setItem("onBreak",String(now));
    localStorage.setItem("workStatus","onBreak")
    setWorkStatus("onBreak");
}

export const endBreak = () => {

    const now = Date.now();
    const breakData = JSON.parse(localStorage.getItem("breakData"));
    const startBreakTime = localStorage.getItem("onBreak");
    const data = { startBreak:startBreakTime, endBreak:String(now) };

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

export const endDuty = async (e) => {

    e.preventDefault();
    setLoading(true);
    const startTime =  Number(localStorage.getItem("onDuty"));
    const breakData = JSON.parse(localStorage.getItem("breakData"));
    const ref = collection(db,"kintaidata",user.uid,"logs");

    const data = {

        clockIn : startTime,
        clockOut : Date.now(),
        breakData : breakData
        
    }

    try {

        await addDoc(ref,data);
        localStorage.removeItem("onDuty");
        localStorage.removeItem("breakData");
        localStorage.removeItem("workStatus");
        setWorkStatus(null);

    } catch (error) {
        console.log(error);
    } finally { 
        setLoading(false);

    }
}