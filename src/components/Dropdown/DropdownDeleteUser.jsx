import React, { useState } from "react";
import DropdownDeleteButton from "../DropdownButton/DropdownDeleteButton";
import DropdownDeleteUserContent from "../DropdownContent/DropdownDeleteUserContent";
import "./Dropdown.css";

const DropdownDeleteUser = ({ buttonText, content, user }) => {

    const [open, setOpen] = useState(false);

    const toggleDropdown = () => {
        setOpen((open) => !open);
    }

    return (
        <div className="dropdown">
            <DropdownDeleteButton toggle={toggleDropdown} open={open}>
                {buttonText}            
            </DropdownDeleteButton>
            <DropdownDeleteUserContent open={open} user1={user}>
                {content}
            </DropdownDeleteUserContent>
        </div>
        
    );
};

export default DropdownDeleteUser;