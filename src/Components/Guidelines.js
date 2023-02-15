import React, { useContext } from "react";
import { userDetailsContext } from "./UserDetailsContext";

export default function Guidelines() {

    const userDetailsCtx = useContext(userDetailsContext);
    
    return (
        <div className="card text-center h-50 d-inline-block d-grid gap-3 shadow p-3 mb-5 bg-body rounded">
            <div className="card-header">----------------------הוראות למילוי הטופס----------------------</div>
            <h1>שלום לך {userDetailsCtx.user.firstName} {userDetailsCtx.user.lastName} </h1>
            <p>עליך למלא את כל הפרטים המופיעם בטופס </p>
            <p>לתשומת לבך כל הפרטים הינם חובה</p>
            <h4>בהצלחה</h4>
            <div className="card-footer text-muted"></div>
        </div>
    )
}