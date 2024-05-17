import React, { useState } from "react";
import DropdownDeleteButton from "../DropdownButton/DropdownDeleteButton";
import DropdownDeleteRecipeContent from "../DropdownContent/DropdownDeleteRecipeContent";
import "./Dropdown.css";

const DropdownDeleteRecipe = ({ buttonText, content, recipe }) => {

    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen((open) => !open);
    }

    return (
        <div className="dropdown">
            <DropdownDeleteButton toggle={toggleDropdown} open={open}>
                {buttonText}            
            </DropdownDeleteButton>
            <DropdownDeleteRecipeContent open={open} recipe1={recipe}>
                {content}
            </DropdownDeleteRecipeContent>
        </div>
        
    );
};

export default DropdownDeleteRecipe;