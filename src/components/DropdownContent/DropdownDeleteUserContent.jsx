import "./DropdownTable.css";
import { useState } from "react";

const DropdownDeleteUserContent = ({ children, open, user1 }) => {

    //For storing the user and userID in case you need them
    const [user, setUser] = useState(user1);
    const [userId, setUserId] = useState(user.id);


    /**
     * Delete the user from the database in the handleSubmit 
     */

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
        <div className={`dropdown-content2
        ${open ? "content-open" : null}`}>
        {children}
            <form onSubmit={handleSubmit}>
                <button type="submit" className="myButton">Delete</button>
            </form>

        </div>
    )
}

export default DropdownDeleteUserContent;