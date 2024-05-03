import React from "react";
import DropdownButton from "../DropdownButton/DropdownButton";
import DropdownCreateContent from "../DropdownContent/DropdownCreateContent";
import "./Dropdown.css";
import { useState } from "react";

const DropdownCreate = ({buttonText, content}) => {

    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen((open) => !open);
    };

    return (
        <div className="dropdown">
            <DropdownButton toggle={toggleDropdown} open={open}>
                {buttonText}            
            </DropdownButton>
            <DropdownCreateContent open={open}>
                {content}
            </DropdownCreateContent>
        </div>
        
    );
};

export default DropdownCreate;