import { useState, createContext } from "react";

export const userDetailsContext = createContext();

export default function UserDetailsContext(props) {

    const [usersDetails,setUsersDetails]=useState([]);
    const [childrenArr, setChildrenArr] = useState([]);
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        tz: "",
        birthDate: new Date(),
        gender: "",
        hMO: 0,
        parent_1_tz: "",
        parent_2_tz: ""
    });
   
    return (
        <userDetailsContext.Provider value={{ user, setUser, childrenArr, setChildrenArr,usersDetails,setUsersDetails}}>
            {props.children}
        </userDetailsContext.Provider>
    )
}
