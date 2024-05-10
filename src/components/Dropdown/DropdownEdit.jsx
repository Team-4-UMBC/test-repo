import React from "react";
import DropdownButton from "../DropdownButton/DropdownButton";
import DropdownEditAcct from "../DropdownContent/DropdownEditAcct";
import "./Dropdown.css";
import { useState } from "react";

const DropdownEdit = ({buttonText, content}) => {

    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen((open) => !open);
    };

    return (
        <div className="dropdown">
            <DropdownButton toggle={toggleDropdown} open={open}>
                {buttonText}            
            </DropdownButton>
            <DropdownEditAcct open={open}>
                {content}
            </DropdownEditAcct>
        </div>
        
    );
};

export default DropdownEdit;