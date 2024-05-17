import { useState, useEffect } from "react";
import { AdminTable } from "./adminTable";

const AdminList = () => {
    const [users, setUsers] = useState({users: []});

    function FetchData() {
        useEffect(() => {
            fetch("/all_users").then((res) => 
            res.json().then((data) => {
                    setUsers({
                        users: data.users
                    })
                })
            );
        }, []);
    }

    FetchData();

    return (
        <div>
            <AdminTable rows={users}/>
        </div>
    )
    
}




export default AdminList;