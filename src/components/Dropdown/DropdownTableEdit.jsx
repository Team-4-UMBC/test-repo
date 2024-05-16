import React, { useState } from "react";
import DropdownEditButton from "../DropdownButton/DropdownEditButton";
import DropdownTableContent from "../DropdownContent/DropdownTableContent";
import "./Dropdown.css";

const DropdownTableEdit = ({buttonText, content,  myRecipe}) => {

    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen((open) => !open);
    }

    return (
        <div className="dropdown">
            <DropdownEditButton toggle={toggleDropdown} open={open}>
                {buttonText}            
            </DropdownEditButton>
            <DropdownTableContent open={open} recipe1={myRecipe}>
                {content}
            </DropdownTableContent>
        </div>
        
    );
};

export default DropdownTableEdit;