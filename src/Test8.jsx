import "./logmode.css";

const Test8 = ({ snapShot }) => {                         

    if (snapShot === true ) return <p>勤怠データが存在しません</p>

    return (
        <div className="log-mode">
            <table>
                <thead>
                    <tr>
                        <th>日付</th>
                        <th>出勤</th>
                        <th>退勤</th>
                    </tr>
                </thead>
                <tbody>
                    {snapShot.map((e) =>
                        <tr>
                            <td>{new Date(e.shift.day.toDate()).toLocaleDateString()}</td>
                            <td>
                                {new Date(e.shift.type.clockIn.toDate()).toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"})}
                            </td>
                            <td>
                                {new Date(e.shift.type.clockOut.toDate()).toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"})}
                            </td>
                        </tr> 
                    )}

                </tbody>
            </table>
        </div>
    )

    
}

export default Test8;