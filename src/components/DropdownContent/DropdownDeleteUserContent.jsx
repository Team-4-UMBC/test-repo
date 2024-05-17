import "./DropdownTable.css";
import { useState } from "react";

const DropdownDeleteUserContent = ({ children, open, user1 }) => {

    /**
     * Delete the user from the database in the handleSubmit 
     */

    const handleSubmit = (e) => {
        e.preventDefault();
        return fetch('http://localhost:5000/delete_user', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': "application/json"
        }, body: JSON.stringify(user1),
        })
        .then(response => response.json())
            .then(data1 => {
                if (data1.status === 1){
                    alert("User deleted")
                }
                else {
                    alert("Failed to delete user")
                }
            })
    }

    return (
        <div className={`dropdown-content2
        ${open ? "content-open" : null}`}>
        {children}
            <button type="submit" className="myButton" onClick={handleSubmit}>Delete</button>

        </div>
    )
}

export default DropdownDeleteUserContent;