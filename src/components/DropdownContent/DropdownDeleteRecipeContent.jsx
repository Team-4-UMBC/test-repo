import "./DropdownTable.css";
import { useState } from "react";

const DropdownDeleteUserContent = ({ children, open, recipe1 }) => {



    /**
     * Delete the recipe from the database in the handleSubmit 
     */

    const handleSubmit = (e) => {
        e.preventDefault();
        return fetch('http://localhost:5000/delete_recipe', {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': "application/json"
        }, body: JSON.stringify(recipe1),
        })
        .then(response => response.json())
            .then(data1 => {
                if (data1.status === 1){
                    alert("Recipe deleted")
                }
                else {
                    alert("Failed to delete recipe")
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