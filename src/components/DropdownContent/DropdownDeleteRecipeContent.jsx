import "./DropdownTable.css";
import { useState } from "react";

const DropdownDeleteUserContent = ({ children, open, recipe1 }) => {

    //For storing the recipe and Recipe ID in case you need them
    const [recipe, setRecipe] = useState(recipe1);
    const [recipeId, setRecipeId] = useState(recipe.id);


    /**
     * Delete the recipe from the database in the handleSubmit 
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