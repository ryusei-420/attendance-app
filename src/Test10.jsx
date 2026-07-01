import { query,collection,where,getDocs,orderBy } from "firebase/firestore";
import { db } from "./firebase/firebase";

const getLogs = async (user) => {

    const now = new Date();
    const start = new Date(now.getFullYear(),now.getMonth(),1).toLocaleDateString();
    const end = new Date(now.getFullYear(),now.getMonth()+1,1).toLocaleDateString();
    
    const b =  query(
        collection(db,"kintaidata",user.uid,"logs"),
        where("logName","==","attendanceLog"),
        where("start",">=",start),
        where("start","<",end),
        orderBy("shift.day"),
        orderBy("shift.type.clockIn"),
        orderBy("shift.type.clockOut")
    );

    try {

        const snapshot = await getDocs(b);
        console.log(snapshot);
        if (snapshot.empty) return snapshot.empty;

        const mappedData = snapshot.docs.map( (docItem) => ( { id:docItem.id, ...docItem.data() } ) );
        return mappedData;

    } catch (error) {

        console.log(error.code);

    }

}

const getQuerySnapshot = async ( user ) => {

    const now = new Date();
    const rangeStart = new Date(now.getFullYear(),now.getMonth(),1).toLocaleDateString();
    const rangeEnd = new Date(now.getFullYear(),now.getMonth()+1,1).toLocaleDateString();
    
    const b =  query(
        collection(db,"kintaidata",user.uid,"logs"),
        where("logName","==","attendanceLog"),
        where("start",">=",rangeStart),
        where("start","<",rangeEnd),
        orderBy("shift.day"),
        orderBy("shift.type.clockIn"),
        orderBy("shift.type.clockOut")
    );

    try {

        const snapshot = await getDocs(b);
        console.log(snapshot);
        if (snapshot.empty) return snapshot.empty;

        const mappedData = snapshot.docs.map( (docItem) => ( { id:docItem.id, ...docItem.data() } ) );
        return mappedData;

    } catch (error) {

        console.log(error.code);

    }
}

export default getLogs;