import { useState } from "react";
import { AdminTable } from "./adminTable";

const AdminList = () => {

    const sample = [
        {
            "id": 1,
            "username": "Michael",
            "email": "michael@gmail.com",
            "password": "1234"

        },
        {
            "id": 2,
            "username": "Robert",
            "email": "robert@gmail.com",
            "password": "4321"
        }
    ]

    const [data, setData] = useState(sample);
    /**
     * INSERT API CALLS HERE
     * Look at how sample array is used to see what I think is presented.
     * 
     * data gets passed into Table and the Table presents 3 things:
     *  id
     *  username
     *  email
     * If you want to change any of these it will be in the adminTable.jsx file
     * 
     * 
     */

    return (
        <div>
            <AdminTable rows={data}/>
        </div>
    )
    
}




export default AdminList;