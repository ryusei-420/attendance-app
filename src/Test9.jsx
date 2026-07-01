import { addDoc, collection, Timestamp} from "firebase/firestore";
import { db } from "./firebase/firebase";

const Test9 = (user) => {

    const testdayo = async () => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(),now.getMonth(),1);
        const startOfNextMonth = new Date(now.getFullYear(),now.getMonth()+1,1);
        const days = (startOfNextMonth - startOfMonth)/(1000*60*60*24);
        for (let i = 1; days >= i; i++){
            try {
                await addDoc(collection(db, "kintaidata",user.uid,"logs"),{
                    shift:{
                        day:Timestamp.fromDate(new Date(now.getFullYear(),now.getMonth(),i,0,0,0,0)),
                        type:{
                            clockIn:Timestamp.fromDate(new Date(now.getFullYear(), now.getMonth(),i,8,0)),
                            clockOut:Timestamp.fromDate(new Date(now.getFullYear(),now.getMonth(),i,17,0))
                        }

                    },
                    logName:"attendanceLog",
                    start:new Date(now.getFullYear(),now.getMonth(),i).toLocaleDateString(),
                    user:user.uid
                    
                });

            } catch(error) {
                console.log(error);
            }
        }
        
    }

    testdayo();

}

export default Test9;